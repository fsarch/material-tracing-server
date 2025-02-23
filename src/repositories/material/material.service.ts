import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Material } from "../../database/entities/material.entity.js";
import { Repository } from "typeorm";
import { MaterialCreateDto } from "../../models/material.model.js";

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(Material) private readonly materialRepository: Repository<Material>,
  ) {}

  public async CreateMaterial(createDto: MaterialCreateDto) {
    const createdMaterial = this.materialRepository.create({
      id: crypto.randomUUID(),
      name: createDto.name,
      materialTypeId: createDto.materialTypeId,
      externalId: createDto.externalId,
      imageRef: createDto.imageRef,
    });

    const savedMaterial = await this.materialRepository.save(createdMaterial);

    return {
      id: savedMaterial.id,
    };
  }

  public async ListMaterials(): Promise<Array<Material>> {
    return this.materialRepository.find();
  }

  public async GetById(id: string): Promise<Material | null> {
    return this.materialRepository.findOne({
      where: { id },
    });
  }
}
