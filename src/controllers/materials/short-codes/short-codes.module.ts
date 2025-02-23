import { Module } from '@nestjs/common';
import { ShortCodesController } from './short-codes.controller.js';
import { MaterialShortCodeModule } from "../../../repositories/material-short-code/material-short-code.module.js";
import { ShortCodeModule } from "../../../repositories/short-code/short-code.module.js";

@Module({
  controllers: [ShortCodesController],
  imports: [ShortCodeModule, MaterialShortCodeModule],
})
export class ShortCodesModule {}
