import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, Not } from 'typeorm';
import {
  PartTypeCreateDto,
  PartTypePatchDto,
} from '../../models/part-type.model.js';
import { PartType } from '../../database/entities/part_type.entity.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EEvent } from '../../constants/event.enum.js';
import { escapeSqlWildcards } from '../../utils/sql-search.utils.js';
import { ProductServerService } from '../product-server/product-server.service.js';
import { User } from '@fsarch/server/auth';
import { Span } from '@fsarch/server/tracing';

@Injectable()
export class PartTypeService {
  constructor(
    @InjectRepository(PartType)
    private readonly partTypeRepository: Repository<PartType>,
    private readonly eventEmitter: EventEmitter2,
    private readonly productServerService: ProductServerService,
  ) {}

  @Span({ name: 'part-type.create' })
  public async CreatePartType(
    createDto: PartTypeCreateDto,
    options: { user: User },
  ) {
    if (createDto.productId) {
      await this.assertProductExists(createDto.productId, options);
    }

    const createdMaterialType = this.partTypeRepository.create({
      id: crypto.randomUUID(),
      name: createDto.name,
      externalId: createDto.externalId,
      productId: createDto.productId,
      hint: createDto.hint,
      archiveTime: createDto.archiveTime,
    });

    const savedMaterialType =
      await this.partTypeRepository.save(createdMaterialType);

    return {
      id: savedMaterialType.id,
    };
  }

  private async assertProductExists(
    productId: string,
    options: { user: User },
  ): Promise<void> {
    const exists = await this.productServerService.validateProductExists(
      productId,
      options,
    );

    if (!exists) {
      throw new BadRequestException('Unknown product ID');
    }
  }

  public async ListPartTypes(
    isArchived: boolean = false,
    search?: string,
    productId?: string,
  ): Promise<Array<PartType>> {
    const query = this.partTypeRepository.createQueryBuilder('part_type');

    // Apply archive filter
    if (isArchived) {
      query.andWhere('part_type.archive_time IS NOT NULL');
    } else {
      query.andWhere('part_type.archive_time IS NULL');
    }

    // Apply search filter
    if (search !== undefined && search !== '') {
      const escapedSearch = escapeSqlWildcards(search);

      query.andWhere(
        '(part_type.name ILIKE :search OR part_type.external_id = :exactSearch)',
        { search: `%${escapedSearch}%`, exactSearch: search },
      );
    }

    // Apply explicit productId filter if provided
    if (productId !== undefined && productId !== '') {
      query.andWhere('part_type.product_id = :productId', { productId });
    }

    return query.getMany();
  }

  public async GetPartType(id: string): Promise<PartType | null> {
    return this.partTypeRepository.findOne({
      where: {
        id,
      },
    });
  }

  @Span({ name: 'part-type.update' })
  public async UpdatePartType(
    id: string,
    partTypePatchDto: PartTypePatchDto,
    options: { user: User },
  ): Promise<PartType | null> {
    const partType = await this.partTypeRepository.findOne({
      where: {
        id,
      },
    });

    if (partTypePatchDto.name !== undefined) {
      partType.name = partTypePatchDto.name;
    }

    if (partTypePatchDto.externalId !== undefined) {
      partType.externalId = partTypePatchDto.externalId;
    }

    if (partTypePatchDto.productId !== undefined) {
      if (partTypePatchDto.productId) {
        await this.assertProductExists(partTypePatchDto.productId, options);
      }
      partType.productId = partTypePatchDto.productId;
    }

    if (partTypePatchDto.hint !== undefined) {
      partType.hint = partTypePatchDto.hint;
    }

    if (partTypePatchDto.archiveTime !== undefined) {
      partType.archiveTime = partTypePatchDto.archiveTime;
    }

    await this.partTypeRepository.save(partType);

    return partType;
  }

  public async Delete(
    id: string,
    deletionTime = new Date().toISOString(),
  ): Promise<void> {
    await this.partTypeRepository.update(
      {
        id,
        deletionTime: IsNull(),
      },
      {
        deletionTime,
      },
    );

    this.eventEmitter.emit(EEvent.DELETE_PART_TYPE, {
      id,
      deletionTime,
    });
  }
}
