import { Module } from '@nestjs/common';
import { PartShortCodeService } from './part-short-code.service.js';
import { TypeOrmModule } from "@nestjs/typeorm";
import { PartShortCode } from "../../database/entities/part_short_code.entity.js";

@Module({
  providers: [PartShortCodeService],
  exports: [PartShortCodeService],
  imports: [TypeOrmModule.forFeature([PartShortCode])],
})
export class PartShortCodeModule {}
