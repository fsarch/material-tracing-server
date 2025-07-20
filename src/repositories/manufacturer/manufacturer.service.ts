import { Injectable } from '@nestjs/common';
import { Manufacturer } from "../../database/entities/manufacturer.entity.js";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { ManufacturerCreateDto } from "../../models/manufacturer.model.js";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { EEvent } from "../../constants/event.enum.js";

@Injectable()
export class ManufacturerService {
  constructor(
    @InjectRepository(Manufacturer)
    private readonly manufacturerRepository: Repository<Manufacturer>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async CreateManufacturer(createDto: ManufacturerCreateDto) {
    const createdManufacturer = this.manufacturerRepository.create({
      id: crypto.randomUUID(),
      name: createDto.name,
      externalId: createDto.externalId,
      hint: createDto.hint,
    });

    const savedManufacturer = await this.manufacturerRepository.save(createdManufacturer);

    return {
      id: savedManufacturer.id,
    };
  }

  public async ListManufacturers(): Promise<Array<Manufacturer>> {
    return this.manufacturerRepository.find();
  }

  public async GetManufacturerById(id: string): Promise<Manufacturer | null> {
    return this.manufacturerRepository.findOne({
      where: {
        id,
      },
    });
  }

  public async DeleteManufacturer(id: string) {
    const deletionTime = new Date();

    await this.manufacturerRepository.update({
      id,
      deletionTime: IsNull(),
    }, {
      deletionTime,
    });

    this.eventEmitter.emit(EEvent.DELETE_MANUFACTURER, {
      id,
      deletionTime: deletionTime.toISOString(),
    });
  }
}
