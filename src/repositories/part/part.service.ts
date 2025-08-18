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
      hint: createDto.hint,
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

    if (patchDto.checkoutTime !== undefined) {
      part.checkoutTime = patchDto.checkoutTime;
    }

    if (patchDto.hint !== undefined) {
      part.hint = patchDto.hint;
    }

    await this.partRepository.save(part);
  }

  public async ListParts(options: { skip?: number, take?: number, name?: string }): Promise<Array<Part>> {
    const query = this.partRepository.createQueryBuilder('part');

    if (options.name !== undefined) {
      // Escape PostgreSQL wildcard characters to prevent injection
      const escapedName = options.name
        .replace(/\\/g, '\\\\')  // Escape backslashes first
        .replace(/%/g, '\\%')    // Escape % wildcards
        .replace(/_/g, '\\_');   // Escape _ wildcards
      
      query.where('part.name ILIKE :name', { name: `%${escapedName}%` });
    }

    if (options.skip !== undefined) {
      query.skip(options.skip);
    }

    if (options.take !== undefined) {
      query.take(options.take);
    }

    return query.getMany();
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
