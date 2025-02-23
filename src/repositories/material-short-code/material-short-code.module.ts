import { Module } from '@nestjs/common';
import { MaterialShortCodeService } from './material-short-code.service.js';
import { TypeOrmModule } from "@nestjs/typeorm";
import { MaterialShortCode } from "../../database/entities/material_short_code.entity.js";

@Module({
  providers: [MaterialShortCodeService],
  exports: [MaterialShortCodeService],
  imports: [TypeOrmModule.forFeature([MaterialShortCode])],
})
export class MaterialShortCodeModule {}
