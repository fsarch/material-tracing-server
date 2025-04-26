import { Module } from '@nestjs/common';
import { PartMaterialService } from './part-material.service.js';
import { TypeOrmModule } from "@nestjs/typeorm";
import { PartMaterial } from "../../database/entities/part_material.entity.js";

@Module({
  providers: [PartMaterialService],
  exports: [PartMaterialService],
  imports: [TypeOrmModule.forFeature([PartMaterial])],
})
export class PartMaterialModule {}
