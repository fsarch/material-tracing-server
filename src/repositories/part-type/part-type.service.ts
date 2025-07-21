import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { PartTypeCreateDto, PartTypeDto, PartTypePatchDto } from "../../models/part-type.model.js";
import { PartType } from "../../database/entities/part_type.entity.js";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { EEvent } from "../../constants/event.enum.js";

@Injectable()
export class PartTypeService {
  constructor(
    @InjectRepository(PartType)
    private readonly partTypeRepository: Repository<PartType>,
    private readonly eventEmitter: EventEmitter2,
  ) {
  }

  public async CreatePartType(createDto: PartTypeCreateDto) {
    const createdMaterialType = this.partTypeRepository.create({
      id: crypto.randomUUID(),
      name: createDto.name,
      externalId: createDto.externalId,
      hint: createDto.hint,
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

  public async UpdatePartType(id: string, partTypePatchDto: PartTypePatchDto): Promise<PartType | null> {
    const partType = await this.partTypeRepository.findOne({
      where: {
        id,
      },
    });

    if (partTypePatchDto.name !== undefined) {
      partType.name = partTypePatchDto.name;
    }

    if (partTypePatchDto.externalId !== undefined) {
      partType.externalId = partTypePatchDto.externalId;
    }

    if (partTypePatchDto.hint !== undefined) {
      partType.hint = partTypePatchDto.hint;
    }

    await this.partTypeRepository.save(partType);

    return partType;
  }

  public async Delete(id: string, deletionTime = new Date().toISOString()): Promise<void> {
    await this.partTypeRepository.update({
      id,
      deletionTime: IsNull(),
    }, {
      deletionTime,
    });

    this.eventEmitter.emit(EEvent.DELETE_PART_TYPE, {
      id,
      deletionTime,
    });
  }
}
