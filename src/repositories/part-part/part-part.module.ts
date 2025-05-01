import { Module } from '@nestjs/common';
import { PartPartService } from './part-part.service.js';
import { TypeOrmModule } from "@nestjs/typeorm";
import { PartChildren } from "../../database/entities/part_children.entity.js";

@Module({
  providers: [PartPartService],
  exports: [PartPartService],
  imports: [TypeOrmModule.forFeature([PartChildren])],
})
export class PartPartModule {}
