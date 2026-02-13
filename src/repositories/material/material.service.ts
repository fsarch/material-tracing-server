import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Material } from "../../database/entities/material.entity.js";
import { IsNull, Repository, Not } from "typeorm";
import { MaterialCreateDto, MaterialUpdateDto } from "../../models/material.model.js";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { EEvent } from "../../constants/event.enum.js";
import { escapeSqlWildcards } from "../../utils/sql-search.utils.js";

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(Material) private readonly materialRepository: Repository<Material>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async CreateMaterial(createDto: MaterialCreateDto) {
    const createdMaterial = this.materialRepository.create({
      id: crypto.randomUUID(),
      name: createDto.name,
      materialTypeId: createDto.materialTypeId,
      externalId: createDto.externalId,
      imageRef: createDto.imageRef,
      hint: createDto.hint,
      archiveTime: createDto.archiveTime,
    });

    const savedMaterial = await this.materialRepository.save(createdMaterial);

    return {
      id: savedMaterial.id,
    };
  }

  public async ListMaterials(isArchived: boolean = false, search?: string): Promise<Array<Material>> {
    const query = this.materialRepository.createQueryBuilder('material');

    // Apply archive filter
    if (isArchived) {
      query.andWhere('material.archive_time IS NOT NULL');
    } else {
      query.andWhere('material.archive_time IS NULL');
    }

    // Apply search filter
    if (search !== undefined && search !== '') {
      const escapedSearch = escapeSqlWildcards(search);
      
      query.andWhere(
        '(material.name ILIKE :search OR material.external_id = :exactSearch OR material.material_type_id = :exactSearch)',
        { search: `%${escapedSearch}%`, exactSearch: search }
      );
    }
    
    return query.getMany();
  }

  public async ListByMaterialType(materialTypeId: string): Promise<Array<Material>> {
    return this.materialRepository.find({
      where: {
        materialTypeId,
      },
    });
  }

  public async GetById(id: string): Promise<Material | null> {
    return this.materialRepository.findOne({
      where: { id },
    });
  }

  public async CheckoutMaterial(id: string): Promise<void> {
    const material = await this.GetById(id);
    if (!material) {
      throw new NotFoundException("Not Found");
    }

    const checkoutTime = new Date();
    material.checkoutTime = checkoutTime;

    await this.materialRepository.save(material);

    this.eventEmitter.emit(EEvent.CHECKOUT_MATERIAL, {
      id,
      checkoutTime: checkoutTime.toISOString(),
    });
  }

  public async DeleteById(id: string, deletionTime = new Date().toISOString()): Promise<void> {
    await this.materialRepository.update({
      id,
      deletionTime: IsNull(),
    }, {
      deletionTime,
    });

    this.eventEmitter.emit(EEvent.DELETE_MATERIAL, {
      id,
      deletionTime,
    });
  }

  public async UpdateMaterial(id: string, updateDto: MaterialUpdateDto): Promise<void> {
    const material = await this.GetById(id);
    if (!material) {
      throw new NotFoundException('Material not found');
    }

    // Check if material is checked out
    if (material.checkoutTime) {
      throw new BadRequestException('Cannot update material that is checked out');
    }

    // Update only provided fields
    if (updateDto.name !== undefined) {
      material.name = updateDto.name;
    }
    if (updateDto.externalId !== undefined) {
      material.externalId = updateDto.externalId;
    }
    if (updateDto.hint !== undefined) {
      material.hint = updateDto.hint;
    }
    if (updateDto.archiveTime !== undefined) {
      material.archiveTime = updateDto.archiveTime;
    }

    await this.materialRepository.save(material);
  }
}
