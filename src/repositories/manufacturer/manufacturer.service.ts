import { Injectable } from '@nestjs/common';
import { Manufacturer } from "../../database/entities/manufacturer.entity.js";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ManufacturerCreateDto } from "../../models/manufacturer.model.js";

@Injectable()
export class ManufacturerService {
  constructor(
    @InjectRepository(Manufacturer)
    private readonly manufacturerRepository: Repository<Manufacturer>
  ) {}

  public async CreateManufacturer(createDto: ManufacturerCreateDto) {
    const createdManufacturer = this.manufacturerRepository.create({
      id: crypto.randomUUID(),
      name: createDto.name,
      externalId: createDto.externalId,
    });

    const savedManufacturer = await this.manufacturerRepository.save(createdManufacturer);

    return {
      id: savedManufacturer.id,
    };
  }

  public async ListManufacturers(): Promise<Array<Manufacturer>> {
    return this.manufacturerRepository.find();
  }
}
