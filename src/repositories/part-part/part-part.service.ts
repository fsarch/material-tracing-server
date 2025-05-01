import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { PartChildren } from "../../database/entities/part_children.entity.js";
import { Repository } from "typeorm";
import { Part } from "../../database/entities/part.entity.js";
import { Material } from "../../database/entities/material.entity.js";

@Injectable()
export class PartPartService {
  constructor(
    @InjectRepository(PartChildren)
    private readonly partChildrenRepository: Repository<PartChildren>,
  ) {
  }

  public async GetOrAdd(partId: string, childPartId: string, amount: number) {
    const existingPartChild = await this.partChildrenRepository.findOneBy({
      partId,
      childPartId,
    });
    if (existingPartChild) {
      existingPartChild.amount += amount;
      await this.partChildrenRepository.save(existingPartChild);

      return {
        id: existingPartChild.id,
      };
    }

    const createdPartChild = this.partChildrenRepository.create({
      id: crypto.randomUUID(),
      partId,
      childPartId,
      amount,
    });

    const savedPartChild = await this.partChildrenRepository.save(createdPartChild);

    return {
      id: savedPartChild.id,
    };
  }

  public async List(partId: string): Promise<Array<Part>> {
    const existingPartMaterial = await this.partChildrenRepository.createQueryBuilder('pc')
      .where({
        partId: partId,
      })
      .leftJoinAndSelect(Part, 'pt', 'pc.child_part_id = pt.id')
      // .where('pt.id = pc.child_part_id')
      .select('pt.*')
      .execute();

    return existingPartMaterial;
  }
}
