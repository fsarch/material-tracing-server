import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialShortCode } from '../../database/entities/material_short_code.entity.js';
import * as crypto from 'node:crypto';
import { Span } from '@fsarch/server/tracing';

@Injectable()
export class MaterialShortCodeService {
  constructor(
    @InjectRepository(MaterialShortCode)
    private readonly materialShortCodeRepository: Repository<MaterialShortCode>,
  ) {}

  @Span({ name: 'material-short-code.create' })
  public async Create(materialId: string, shortCodeId: string) {
    const createdMaterialShortCode = this.materialShortCodeRepository.create({
      id: crypto.randomUUID(),
      materialId,
      shortCodeId,
    });

    const savedMaterialShortCode = await this.materialShortCodeRepository.save(
      createdMaterialShortCode,
    );

    return {
      id: savedMaterialShortCode.id,
    };
  }

  public async ListByMaterialId(
    materialId: string,
  ): Promise<Array<MaterialShortCode>> {
    return await this.materialShortCodeRepository.find({
      where: { materialId },
    });
  }

  public async ListByShortCodeId(
    shortCodeId: string,
  ): Promise<Array<MaterialShortCode>> {
    return await this.materialShortCodeRepository.find({
      where: { shortCodeId },
    });
  }

  @Span({ name: 'material-short-code.delete' })
  public async DeleteById(id: string): Promise<void> {
    await this.materialShortCodeRepository.softDelete({
      id,
    });
  }
}
