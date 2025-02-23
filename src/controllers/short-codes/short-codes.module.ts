import { Module } from '@nestjs/common';
import { ShortCodesController } from './short-codes.controller.js';
import { ShortCodeModule } from "../../repositories/short-code/short-code.module.js";
import { MaterialsModule } from './materials/materials.module.js';

@Module({
  controllers: [ShortCodesController],
  imports: [ShortCodeModule, MaterialsModule],
})
export class ShortCodesModule {}
