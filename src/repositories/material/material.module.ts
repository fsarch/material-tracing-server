import { Module } from '@nestjs/common';
import { MaterialService } from './material.service.js';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Material } from "../../database/entities/material.entity.js";

@Module({
  providers: [MaterialService],
  exports: [MaterialService],
  imports: [TypeOrmModule.forFeature([Material])],
})
export class MaterialModule {}
