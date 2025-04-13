import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PartTypeCreateDto, PartTypeDto } from "../../models/part-type.model.js";
import { PartType } from "../../database/entities/part_type.entity.js";

@Injectable()
export class PartTypeService {
  constructor(
    @InjectRepository(PartType)
    private readonly partTypeRepository: Repository<PartType>,
  ) {
  }

  public async CreatePartType(createDto: PartTypeCreateDto) {
    const createdMaterialType = this.partTypeRepository.create({
      id: crypto.randomUUID(),
      name: createDto.name,
      externalId: createDto.externalId,
    });

    const savedMaterialType = await this.partTypeRepository.save(createdMaterialType);

    return {
      id: savedMaterialType.id,
    };
  }

  public async ListPartTypes(): Promise<Array<PartTypeDto>> {
    return this.partTypeRepository.find();
  }

  public async GetPartType(id: string): Promise<PartType | null> {
    return this.partTypeRepository.findOne({
      where: {
        id,
      },
    });
  }
}
