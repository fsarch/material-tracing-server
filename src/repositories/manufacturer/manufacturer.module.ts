import { Module } from '@nestjs/common';
import { ManufacturerService } from './manufacturer.service.js';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Manufacturer } from "../../database/entities/manufacturer.entity.js";

@Module({
  providers: [ManufacturerService],
  exports: [ManufacturerService],
  imports: [TypeOrmModule.forFeature([Manufacturer])],
})
export class ManufacturerModule {}
