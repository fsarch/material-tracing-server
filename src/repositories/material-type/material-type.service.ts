import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { MaterialType } from "../../database/entities/material_type.entity.js";
import { Repository } from "typeorm";
import { MaterialTypeCreateDto } from "../../models/material-type.model.js";

@Injectable()
export class MaterialTypeService {
  constructor(
    @InjectRepository(MaterialType)
    private readonly materialTypeRepository: Repository<MaterialType>,
  ) {
  }

  public async CreateMaterialType(createDto: MaterialTypeCreateDto) {
    const createdMaterialType = this.materialTypeRepository.create({
      id: crypto.randomUUID(),
      name: createDto.name,
      externalId: createDto.externalId,
      manufacturerId: createDto.manufacturerId,
    });

    const savedMaterialType = await this.materialTypeRepository.save(createdMaterialType);

    return {
      id: savedMaterialType.id,
    };
  }

  public async ListMaterialTypes(): Promise<Array<MaterialType>> {
    return this.materialTypeRepository.find();
  }

  public async GetMaterialType(id: string): Promise<MaterialType | null> {
    return this.materialTypeRepository.findOne({
      where: {
        id,
      },
    });
  }
}
