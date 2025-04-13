import { Module } from '@nestjs/common';
import { PartTypeService } from './part-type.service.js';
import { TypeOrmModule } from "@nestjs/typeorm";
import { PartType } from "../../database/entities/part_type.entity.js";

@Module({
  providers: [PartTypeService],
  exports: [PartTypeService],
  imports: [TypeOrmModule.forFeature([PartType])],
})
export class PartTypeModule {}
