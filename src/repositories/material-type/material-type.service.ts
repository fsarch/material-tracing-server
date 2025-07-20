import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { MaterialType } from "../../database/entities/material_type.entity.js";
import { IsNull, Repository } from "typeorm";
import { MaterialTypeCreateDto } from "../../models/material-type.model.js";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { EEvent } from "../../constants/event.enum.js";

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
    });

    const savedMaterialType = await this.materialTypeRepository.save(createdMaterialType);

    return {
      id: savedMaterialType.id,
    };
  }

  public async ListMaterialTypes(): Promise<Array<MaterialType>> {
    return this.materialTypeRepository.find();
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
}
