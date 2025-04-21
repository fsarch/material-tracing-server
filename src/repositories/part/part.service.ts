import { Injectable } from '@nestjs/common';
import { Part } from "../../database/entities/part.entity.js";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { PartCreateDto } from "../../models/part.model.js";

@Injectable()
export class PartService {
  constructor(
    @InjectRepository(Part)
    private readonly partRepository: Repository<Part>,
  ) {
  }

  public async CreatePart(createDto: PartCreateDto) {
    const createdMaterial = this.partRepository.create({
      id: crypto.randomUUID(),
      name: createDto.name,
      partTypeId: createDto.partTypeId,
      externalId: createDto.externalId,
    });

    const savedMaterial = await this.partRepository.save(createdMaterial);

    return {
      id: savedMaterial.id,
    };
  }

  public async ListParts(): Promise<Array<Part>> {
    return this.partRepository.find();
  }

  public async GetById(id: string): Promise<Part | null> {
    return this.partRepository.findOne({
      where: { id },
    });
  }
}
