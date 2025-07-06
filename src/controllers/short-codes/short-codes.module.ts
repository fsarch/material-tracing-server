import { Module } from '@nestjs/common';
import { ShortCodesController } from './short-codes.controller.js';
import { ShortCodeModule } from "../../repositories/short-code/short-code.module.js";
import { MaterialsModule } from './materials/materials.module.js';
import { PartsModule } from './parts/parts.module.js';
import { ActionsModule } from './actions/actions.module.js';

@Module({
  controllers: [ShortCodesController],
  imports: [ShortCodeModule, MaterialsModule, PartsModule, ActionsModule],
})
export class ShortCodesModule {}
