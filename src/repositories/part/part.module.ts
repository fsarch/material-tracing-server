import { Module } from '@nestjs/common';
import { PartService } from './part.service.js';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Part } from "../../database/entities/part.entity.js";
import { PartChildren } from "../../database/entities/part_children.entity.js";

@Module({
  providers: [PartService],
  exports: [PartService],
  imports: [
    TypeOrmModule.forFeature([
      Part,
      PartChildren,
    ]),
  ],
})
export class PartModule {}
