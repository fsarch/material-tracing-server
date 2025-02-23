import { Module } from '@nestjs/common';
import { ShortCodeService } from './short-code.service.js';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ShortCode } from "../../database/entities/short_code.entity.js";

@Module({
  providers: [ShortCodeService],
  exports: [ShortCodeService],
  imports: [TypeOrmModule.forFeature([ShortCode])],
})
export class ShortCodeModule {}
