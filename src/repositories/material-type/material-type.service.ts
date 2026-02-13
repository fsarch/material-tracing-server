import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { MaterialType } from "../../database/entities/material_type.entity.js";
import { IsNull, Repository, Not } from "typeorm";
import { MaterialTypeCreateDto, MaterialTypeUpdateDto } from "../../models/material-type.model.js";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { EEvent } from "../../constants/event.enum.js";
import { escapeSqlWildcards } from "../../utils/sql-search.utils.js";

@Injectable()
export class MaterialTypeService {
  constructor(
    @InjectRepository(MaterialType)
    private readonly materialTypeRepository: Repository<MaterialType>,
    private readonly eventEmitter: EventEmitter2,
  ) {
  }

  public async CreateMaterialType(createDto: MaterialTypeCreateDto) {
    const createdMaterialType = this.materialTypeRepository.create({
      id: crypto.randomUUID(),
      name: createDto.name,
      externalId: createDto.externalId,
      manufacturerId: createDto.manufacturerId,
      hint: createDto.hint,
      archiveTime: createDto.archiveTime,
    });

    const savedMaterialType = await this.materialTypeRepository.save(createdMaterialType);

    return {
      id: savedMaterialType.id,
    };
  }

  public async ListMaterialTypes(isArchived: boolean = false, search?: string): Promise<Array<MaterialType>> {
    const query = this.materialTypeRepository.createQueryBuilder('material_type');

    // Apply archive filter
    if (isArchived) {
      query.andWhere('material_type.archive_time IS NOT NULL');
    } else {
      query.andWhere('material_type.archive_time IS NULL');
    }

    // Apply search filter
    if (search !== undefined && search !== '') {
      const escapedSearch = escapeSqlWildcards(search);
      
      query.andWhere(
        '(material_type.name ILIKE :search OR material_type.external_id = :exactSearch)',
        { search: `%${escapedSearch}%`, exactSearch: search }
      );
    }
    
    return query.getMany();
  }

  public async ListByManufacturer(manufacturerId: string): Promise<Array<MaterialType>> {
    return this.materialTypeRepository.find({
      where: {
        manufacturerId,
      },
    });
  }

  public async GetMaterialType(id: string): Promise<MaterialType | null> {
    return this.materialTypeRepository.findOne({
      where: {
        id,
      },
    });
  }

  public async DeleteById(id: string, deletionTime: string = new Date().toISOString()) {
    await this.materialTypeRepository.update({
      id,
      deletionTime: IsNull(),
    }, {
      deletionTime,
    });

    this.eventEmitter.emit(EEvent.DELETE_MATERIAL_TYPE, {
      id,
      deletionTime,
    });
  }

  public async UpdateMaterialType(id: string, updateDto: MaterialTypeUpdateDto): Promise<void> {
    const materialType = await this.GetMaterialType(id);
    if (!materialType) {
      throw new NotFoundException('Material type not found');
    }

    // Update only provided fields
    if (updateDto.name !== undefined) {
      materialType.name = updateDto.name;
    }
    if (updateDto.externalId !== undefined) {
      materialType.externalId = updateDto.externalId;
    }
    if (updateDto.hint !== undefined) {
      materialType.hint = updateDto.hint;
    }
    if (updateDto.archiveTime !== undefined) {
      materialType.archiveTime = updateDto.archiveTime;
    }

    await this.materialTypeRepository.save(materialType);
  }
}
