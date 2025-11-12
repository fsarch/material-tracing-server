import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ShortCode } from "../../database/entities/short_code.entity.js";
import { MaterialShortCode } from "../../database/entities/material_short_code.entity.js";
import { PartShortCode } from "../../database/entities/part_short_code.entity.js";
import * as crypto from "node:crypto";
import { customAlphabet } from "nanoid";
import { ShortCodeType } from "../../constants/short-code-type.enum.js";
import { ShortCodeCreateDto, ShortCodeUpdateDto } from "../../models/short-code.model.js";

export const nolookalikesSafe = '346789ABCDEFGHJKLMNPQRTUVWXY';
const nanoid = customAlphabet(nolookalikesSafe, 8);

export type TListShortCodeOptions = {
  shortCodeTypeId: ShortCodeType;
};

export type TShortCodeConnection = {
  type: 'material' | 'part';
  id: string;
} | null;

@Injectable()
export class ShortCodeService {
  constructor(
    @InjectRepository(ShortCode)
    private readonly shortCodeRepository: Repository<ShortCode>,
    @InjectRepository(MaterialShortCode)
    private readonly materialShortCodeRepository: Repository<MaterialShortCode>,
    @InjectRepository(PartShortCode)
    private readonly partShortCodeRepository: Repository<PartShortCode>,
  ) {
  }

  public async CreateShortCode() {
    const createdShortCode = this.shortCodeRepository.create({
      id: crypto.randomUUID(),
      code: nanoid(),
    });

    const savedShortCode = await this.shortCodeRepository.save(createdShortCode);

    return {
      id: savedShortCode.id,
      code: savedShortCode.code,
    };
  }

  public async CreateShortCodeFromDto(createDto: ShortCodeCreateDto) {
    const createdShortCode = this.shortCodeRepository.create({
      id: crypto.randomUUID(),
      code: createDto.code,
      shortCodeTypeId: createDto.shortCodeTypeId,
      hint: createDto.hint,
    });

    const savedShortCode = await this.shortCodeRepository.save(createdShortCode);

    return {
      id: savedShortCode.id,
    };
  }

  public async ListShortCodes(selectOptions: TListShortCodeOptions): Promise<Array<ShortCode>> {
    const where: {
      shortCodeTypeId?: string
    } = {};

    if (selectOptions.shortCodeTypeId) {
      where.shortCodeTypeId = selectOptions.shortCodeTypeId;
    }

    return this.shortCodeRepository.find({
      where,
      order: {
        creationTime: "DESC",
      },
    });
  }

  public async GetShortCode(id: string): Promise<ShortCode | null> {
    return this.shortCodeRepository.findOne({
      where: { id },
    });
  }

  public async GetShortCodeByCode(code: string): Promise<ShortCode | null> {
    return this.shortCodeRepository.findOne({
      where: { code },
    });
  }

  public async UpdateShortCode(id: string, updateDto: { shortCodeTypeId: ShortCodeType }): Promise<void> {
    const shortCode = await this.shortCodeRepository.findOne({
      where: { id },
    });

    shortCode.shortCodeTypeId = updateDto.shortCodeTypeId;

    await this.shortCodeRepository.save(shortCode);
  }

  public async UpdateShortCodeHint(id: string, updateDto: ShortCodeUpdateDto): Promise<void> {
    const shortCode = await this.shortCodeRepository.findOne({
      where: { id },
    });

    if (!shortCode) {
      throw new NotFoundException('Short code not found');
    }

    if (updateDto.hint !== undefined) {
      shortCode.hint = updateDto.hint;
    }

    await this.shortCodeRepository.save(shortCode);
  }

  /**
   * Check if a short code is already connected to any resource (material or part)
   * @param shortCodeId The ID of the short code to check
   * @returns Connection information if connected, null if not connected
   */
  public async CheckShortCodeConnection(shortCodeId: string): Promise<TShortCodeConnection> {
    // Check for material connections
    const materialConnection = await this.materialShortCodeRepository.findOne({
      where: { shortCodeId },
    });

    if (materialConnection) {
      return {
        type: 'material',
        id: materialConnection.materialId,
      };
    }

    // Check for part connections
    const partConnection = await this.partShortCodeRepository.findOne({
      where: { shortCodeId },
    });

    if (partConnection) {
      return {
        type: 'part',
        id: partConnection.partId,
      };
    }

    return null;
  }
}
