import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Material } from "../../database/entities/material.entity.js";
import { IsNull, Repository } from "typeorm";
import { MaterialCreateDto, MaterialUpdateDto } from "../../models/material.model.js";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { EEvent } from "../../constants/event.enum.js";

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(Material) private readonly materialRepository: Repository<Material>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async CreateMaterial(createDto: MaterialCreateDto) {
    const createdMaterial = this.materialRepository.create({
      id: crypto.randomUUID(),
      name: createDto.name,
      materialTypeId: createDto.materialTypeId,
      externalId: createDto.externalId,
      imageRef: createDto.imageRef,
      hint: createDto.hint,
    });

    const savedMaterial = await this.materialRepository.save(createdMaterial);

    return {
      id: savedMaterial.id,
    };
  }

  public async ListMaterials(): Promise<Array<Material>> {
    return this.materialRepository.find();
  }

  public async ListByMaterialType(materialTypeId: string): Promise<Array<Material>> {
    return this.materialRepository.find({
      where: {
        materialTypeId,
      },
    });
  }

  public async GetById(id: string): Promise<Material | null> {
    return this.materialRepository.findOne({
      where: { id },
    });
  }

  public async CheckoutMaterial(id: string): Promise<void> {
    const material = await this.GetById(id);
    if (!material) {
      throw new NotFoundException("Not Found");
    }

    const checkoutTime = new Date();
    material.checkoutTime = checkoutTime;

    await this.materialRepository.save(material);

    this.eventEmitter.emit(EEvent.CHECKOUT_MATERIAL, {
      id,
      checkoutTime: checkoutTime.toISOString(),
    });
  }

  public async DeleteById(id: string, deletionTime = new Date().toISOString()): Promise<void> {
    await this.materialRepository.update({
      id,
      deletionTime: IsNull(),
    }, {
      deletionTime,
    });

    this.eventEmitter.emit(EEvent.DELETE_MATERIAL, {
      id,
      deletionTime,
    });
  }

  public async UpdateMaterial(id: string, updateDto: MaterialUpdateDto): Promise<void> {
    const material = await this.GetById(id);
    if (!material) {
      throw new NotFoundException('Material not found');
    }

    // Check if material is checked out
    if (material.checkoutTime) {
      throw new BadRequestException('Cannot update material that is checked out');
    }

    // Update only provided fields
    if (updateDto.name !== undefined) {
      material.name = updateDto.name;
    }
    if (updateDto.externalId !== undefined) {
      material.externalId = updateDto.externalId;
    }
    if (updateDto.hint !== undefined) {
      material.hint = updateDto.hint;
    }

    await this.materialRepository.save(material);
  }
}
