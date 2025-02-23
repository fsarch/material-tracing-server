import { Module } from '@nestjs/common';
import { MaterialTypeService } from './material-type.service.js';
import { TypeOrmModule } from "@nestjs/typeorm";
import { MaterialType } from "../../database/entities/material_type.entity.js";

@Module({
  providers: [MaterialTypeService],
  exports: [MaterialTypeService],
  imports: [TypeOrmModule.forFeature([MaterialType])],
})
export class MaterialTypeModule {}
