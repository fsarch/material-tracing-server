import { Injectable } from '@nestjs/common';
import { Part } from '../../database/entities/part.entity.js';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PartCreateDto, PartPatchDto } from '../../models/part.model.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EEvent } from '../../constants/event.enum.js';
import { PartChildren } from '../../database/entities/part_children.entity.js';
import { escapeSqlWildcards } from '../../utils/sql-search.utils.js';

@Injectable()
export class PartService {
  constructor(
    @InjectRepository(Part)
    private readonly partRepository: Repository<Part>,
    @InjectRepository(PartChildren)
    private readonly partChildrenRepository: Repository<PartChildren>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async CreatePart(createDto: PartCreateDto) {
    const createdMaterial = this.partRepository.create({
      id: crypto.randomUUID(),
      name: createDto.name,
      partTypeId: createDto.partTypeId,
      externalId: createDto.externalId,
      amount: createDto.amount,
      hint: createDto.hint,
      archiveTime: createDto.archiveTime,
    });

    const savedMaterial = await this.partRepository.save(createdMaterial);

    return {
      id: savedMaterial.id,
    };
  }

  public async UpdatePart(
    partId: string,
    patchDto: PartPatchDto,
  ): Promise<void> {
    const part = await this.partRepository.findOneOrFail({
      where: { id: partId },
    });

    if (patchDto.name !== undefined) {
      part.name = patchDto.name;
    }

    if (patchDto.amount !== undefined) {
      part.amount = patchDto.amount;
    }

    if (patchDto.externalId !== undefined) {
      part.externalId = patchDto.externalId;
    }

    if (patchDto.checkoutTime !== undefined) {
      part.checkoutTime = patchDto.checkoutTime;
    }

    if (patchDto.hint !== undefined) {
      part.hint = patchDto.hint;
    }

    if (patchDto.archiveTime !== undefined) {
      part.archiveTime = patchDto.archiveTime;
    }

    await this.partRepository.save(part);
  }

  public async ListParts(options: {
    skip?: number;
    take?: number;
    name?: string;
    isArchived?: boolean;
    search?: string;
  }): Promise<Array<Part>> {
    const query = this.partRepository.createQueryBuilder('part');

    // Apply archive filter (default to non-archived)
    const isArchived = options.isArchived ?? false;
    if (isArchived) {
      query.andWhere('part.archive_time IS NOT NULL');
    } else {
      query.andWhere('part.archive_time IS NULL');
    }

    // Apply search filter (takes precedence over name filter if both provided)
    if (options.search !== undefined && options.search !== '') {
      const escapedSearch = escapeSqlWildcards(options.search);

      // Check if search string is a valid UUID format
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const isUuid = uuidRegex.test(options.search);

      if (isUuid) {
        query.andWhere(
          '(part.name ILIKE :search OR part.external_id = :exactSearch OR part.part_type_id = :exactSearch)',
          { search: `%${escapedSearch}%`, exactSearch: options.search },
        );
      } else {
        query.andWhere(
          '(part.name ILIKE :search OR part.external_id = :exactSearch)',
          { search: `%${escapedSearch}%`, exactSearch: options.search },
        );
      }
    } else if (options.name !== undefined) {
      // Legacy name filter for backwards compatibility
      const escapedName = escapeSqlWildcards(options.name);

      query.andWhere('part.name ILIKE :name', { name: `%${escapedName}%` });
    }

    if (options.skip !== undefined) {
      query.skip(options.skip);
    }

    if (options.take !== undefined) {
      query.take(options.take);
    }

    return query.getMany();
  }

  public async ListPartsByPartType(partTypeId: string): Promise<Array<Part>> {
    return this.partRepository.find({
      where: {
        partTypeId,
      },
    });
  }

  public async GetAvailableAmount(id: string): Promise<number> {
    const totalAmount = (
      await this.partRepository.findOneOrFail({
        where: { id },
        select: { amount: true },
      })
    ).amount;

    const childrenPartAmount = await this.partChildrenRepository.sum('amount', {
      childPartId: id,
    });

    console.log('totalAmount', totalAmount, childrenPartAmount);

    return totalAmount - childrenPartAmount;
  }

  public async GetById(id: string): Promise<Part | null> {
    return this.partRepository.findOne({
      where: { id },
    });
  }

  public async DeletePart(
    id: string,
    deletionTime = new Date().toISOString(),
  ): Promise<void> {
    await this.partRepository.update(
      {
        id,
        deletionTime: IsNull(),
      },
      {
        deletionTime,
      },
    );

    this.eventEmitter.emit(EEvent.DELETE_PART, {
      id,
      deletionTime,
    });
  }
}
