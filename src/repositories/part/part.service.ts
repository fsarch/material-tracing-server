import { Injectable } from '@nestjs/common';
import { Part } from "../../database/entities/part.entity.js";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { PartCreateDto, PartPatchDto } from "../../models/part.model.js";

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
      amount: createDto.amount,
    });

    const savedMaterial = await this.partRepository.save(createdMaterial);

    return {
      id: savedMaterial.id,
    };
  }

  public async UpdatePart(partId: string, patchDto: PartPatchDto): Promise<void> {
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

    await this.partRepository.save(part);
  }

  public async ListParts(): Promise<Array<Part>> {
    return this.partRepository.find();
  }

  public async GetById(id: string): Promise<Part | null> {
    return this.partRepository.findOne({
      where: { id },
    });
  }

  public async DeletePart(id: string): Promise<void> {
    await this.partRepository.softDelete({
      id,
    });
  }
}
