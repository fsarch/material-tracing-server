import { Module } from '@nestjs/common';
import { MaterialsController } from './materials.controller.js';
import { PartMaterialModule } from "../../../repositories/part-material/part-material.module.js";
import { MaterialModule } from "../../../repositories/material/material.module.js";
import { PartModule } from "../../../repositories/part/part.module.js";

@Module({
  controllers: [MaterialsController],
  imports: [PartMaterialModule, MaterialModule, PartModule],
})
export class MaterialsModule {}
