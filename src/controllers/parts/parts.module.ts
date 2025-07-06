import { Module } from '@nestjs/common';
import { PartsController } from './parts.controller.js';
import { PartModule } from "../../repositories/part/part.module.js";
import { PartTypeModule } from "../../repositories/part-type/part-type.module.js";
import { ShortCodesModule } from "./short-codes/short-codes.module.js";
import { MaterialsModule } from './materials/materials.module.js';
import { PartsModule as PartPartsModule } from './parts/parts.module.js';
import { ActionsModule } from './actions/actions.module.js';

@Module({
  controllers: [PartsController],
  imports: [PartModule, PartTypeModule, ShortCodesModule, MaterialsModule, PartsModule, PartPartsModule, ActionsModule],
})
export class PartsModule {}
