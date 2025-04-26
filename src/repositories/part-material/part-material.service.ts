import { Injectable } from '@nestjs/common';
import { Repository } from "typeorm";
import { PartMaterial } from "../../database/entities/part_material.entity.js";
import { InjectRepository } from "@nestjs/typeorm";
import { Material } from "../../database/entities/material.entity.js";

@Injectable()
export class PartMaterialService {
  constructor(
    @InjectRepository(PartMaterial)
    private readonly partMaterialRepository: Repository<PartMaterial>,
  ) {
  }

  public async CreateOrGet(partId: string, materialId: string): Promise<{ id: string }> {
    const existingPartMaterial = await this.partMaterialRepository.findOneBy({
      partId,
      materialId,
    });
    if (existingPartMaterial) {
      return {
        id: existingPartMaterial.id,
      };
    }

    const createdMaterial = this.partMaterialRepository.create({
      id: crypto.randomUUID(),
      partId,
      materialId,
    });

    const savedMaterial = await this.partMaterialRepository.save(createdMaterial);

    return {
      id: savedMaterial.id,
    };
  }

  public async ListByPart(partId: string): Promise<Array<Material>> {
    const existingPartMaterial = await this.partMaterialRepository.createQueryBuilder('pm')
      .leftJoinAndSelect(Material, 'mat')
      .select('mat.*')
      .where({
        partId: partId,
      })
      .execute();

    return existingPartMaterial;
  }
}
