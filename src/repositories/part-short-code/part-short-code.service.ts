import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PartShortCode } from "../../database/entities/part_short_code.entity.js";
import * as crypto from "node:crypto";

@Injectable()
export class PartShortCodeService {
  constructor(
    @InjectRepository(PartShortCode)
    private readonly partShortCodeRepository: Repository<PartShortCode>,
  ) {
  }

  public async Create(partId: string, shortCodeId: string) {
    const createdPartShortCode = this.partShortCodeRepository.create({
      id: crypto.randomUUID(),
      partId,
      shortCodeId,
    });

    const savedPartShortCode = await this.partShortCodeRepository.save(createdPartShortCode);

    return {
      id: savedPartShortCode.id,
    };
  }

  public async ListByPartId(partId: string): Promise<Array<PartShortCode>> {
    return await this.partShortCodeRepository.find({
      where: { partId },
    });
  }

  public async ListByShortCodeId(shortCodeId: string): Promise<Array<PartShortCode>> {
    return await this.partShortCodeRepository.find({
      where: { shortCodeId },
    });
  }

  public async DeleteById(id: string): Promise<void> {
    await this.partShortCodeRepository.softDelete({
      id,
    });
  }
}
