import { Injectable } from '@nestjs/common';
import { Part } from "../../database/entities/part.entity.js";
import { IsNull, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { PartCreateDto, PartPatchDto } from "../../models/part.model.js";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { EEvent } from "../../constants/event.enum.js";
import { PartChildren } from "../../database/entities/part_children.entity.js";

@Injectable()
export class PartService {
  constructor(
    @InjectRepository(Part)
    private readonly partRepository: Repository<Part>,
    @InjectRepository(PartChildren)
    private readonly partChildrenRepository: Repository<PartChildren>,
    private readonly eventEmitter: EventEmitter2,
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

  public async ListPartsByPartType(partTypeId: string): Promise<Array<Part>> {
    return this.partRepository.find({
      where: {
        partTypeId,
      },
    });
  }

  public async GetAvailableAmount(id: string): Promise<number> {
    const totalAmount = (await this.partRepository.findOneOrFail({
      where: { id },
      select: { amount: true },
    })).amount;

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

  public async DeletePart(id: string, deletionTime = new Date().toISOString()): Promise<void> {
    await this.partRepository.update({
      id,
      deletionTime: IsNull(),
    }, {
      deletionTime,
    });

    this.eventEmitter.emit(EEvent.DELETE_PART, {
      id,
      deletionTime,
    });
  }
}
