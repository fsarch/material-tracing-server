import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { PartChildren } from "../../database/entities/part_children.entity.js";
import { IsNull, Repository } from "typeorm";
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

  public async GetById(partId: string, childPartId: string): Promise<PartChildren> {
    return await this.partChildrenRepository.findOne({
      where: {
        partId,
        childPartId,
      },
    });
  }

  public async List(partId: string): Promise<Array<Part>> {
    const childParts = await this.partChildrenRepository.createQueryBuilder('pc')
      .where({
        partId: partId,
      })
      .leftJoinAndSelect(Part, 'pt', 'pc.child_part_id = pt.id')
      // .where('pt.id = pc.child_part_id')
      .select('pt.id', 'id')
      .addSelect('pt.name', 'name')
      .addSelect('pc.amount', 'amount')
      .execute();

    return childParts;
  }

  public async DeleteById(partChildrenId: string) {
    await this.partChildrenRepository.softDelete({
      id: partChildrenId,
    });
  }

  public async DeleteByPartId(partId: string, deletionTime = new Date().toISOString()) {
    await this.partChildrenRepository.update({
      partId,
      deletionTime: IsNull(),
    }, {
      deletionTime,
    });
  }
}
