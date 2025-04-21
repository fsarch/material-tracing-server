import { Module } from '@nestjs/common';
import { MaterialShortCodesController } from './short-codes.controller.js';
import { MaterialShortCodeModule } from "../../../repositories/material-short-code/material-short-code.module.js";
import { ShortCodeModule } from "../../../repositories/short-code/short-code.module.js";

@Module({
  controllers: [MaterialShortCodesController],
  imports: [ShortCodeModule, MaterialShortCodeModule],
})
export class ShortCodesModule {}
