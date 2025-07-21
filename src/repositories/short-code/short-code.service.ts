import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ShortCode } from "../../database/entities/short_code.entity.js";
import * as crypto from "node:crypto";
import { customAlphabet } from "nanoid";
import { ShortCodeType } from "../../constants/short-code-type.enum.js";
import { ShortCodeCreateDto } from "../../models/short-code.model.js";

export const nolookalikesSafe = '346789ABCDEFGHJKLMNPQRTUVWXY';
const nanoid = customAlphabet(nolookalikesSafe, 8);

export type TListShortCodeOptions = {
  shortCodeTypeId: ShortCodeType;
};

@Injectable()
export class ShortCodeService {
  constructor(
    @InjectRepository(ShortCode)
    private readonly shortCodeRepository: Repository<ShortCode>,
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
}
