import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { PartShortCode } from '../../database/entities/part_short_code.entity.js';
import * as crypto from 'node:crypto';
import { Span } from '@fsarch/server/tracing';

@Injectable()
export class PartShortCodeService {
  constructor(
    @InjectRepository(PartShortCode)
    private readonly partShortCodeRepository: Repository<PartShortCode>,
  ) {}

  @Span({ name: 'part-short-code.create' })
  public async Create(partId: string, shortCodeId: string) {
    const createdPartShortCode = this.partShortCodeRepository.create({
      id: crypto.randomUUID(),
      partId,
      shortCodeId,
    });

    const savedPartShortCode =
      await this.partShortCodeRepository.save(createdPartShortCode);

    return {
      id: savedPartShortCode.id,
    };
  }

  public async ListByPartId(partId: string): Promise<Array<PartShortCode>> {
    return await this.partShortCodeRepository.find({
      where: { partId },
    });
  }

  /**
   * Bulk list PartShortCode entries for multiple partIds
   */
  public async ListByPartIds(partIds: Array<string>): Promise<Array<PartShortCode>> {
    if (!partIds || partIds.length === 0) return [];
    return await this.partShortCodeRepository.find({
      where: { partId: In(partIds) },
    });
  }

  public async ListByShortCodeId(
    shortCodeId: string,
  ): Promise<Array<PartShortCode>> {
    return await this.partShortCodeRepository.find({
      where: { shortCodeId },
    });
  }

  @Span({ name: 'part-short-code.delete' })
  public async DeleteById(id: string): Promise<void> {
    await this.partShortCodeRepository.softDelete({
      id,
    });
  }
}
