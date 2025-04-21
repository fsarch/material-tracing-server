import { Module } from '@nestjs/common';
import { PartShortCodesController } from './short-codes.controller.js';
import { ShortCodeModule } from "../../../repositories/short-code/short-code.module.js";
import { PartShortCodeModule } from "../../../repositories/part-short-code/part-short-code.module.js";

@Module({
  controllers: [PartShortCodesController],
  imports: [ShortCodeModule, PartShortCodeModule],
})
export class ShortCodesModule {}
