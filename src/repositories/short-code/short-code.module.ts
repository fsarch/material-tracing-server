import { Module } from '@nestjs/common';
import { ShortCodeService } from './short-code.service.js';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ShortCode } from "../../database/entities/short_code.entity.js";
import { MaterialShortCode } from "../../database/entities/material_short_code.entity.js";
import { PartShortCode } from "../../database/entities/part_short_code.entity.js";

@Module({
  providers: [ShortCodeService],
  exports: [ShortCodeService],
  imports: [TypeOrmModule.forFeature([ShortCode, MaterialShortCode, PartShortCode])],
})
export class ShortCodeModule {}
