import { Module } from '@nestjs/common';
import { MaterialsController } from './materials.controller.js';
import { ShortCodeModule } from "../../../repositories/short-code/short-code.module.js";
import { MaterialShortCodeModule } from "../../../repositories/material-short-code/material-short-code.module.js";
import { MaterialModule } from "../../../repositories/material/material.module.js";

@Module({
  controllers: [MaterialsController],
  imports: [ShortCodeModule, MaterialShortCodeModule, MaterialModule],
})
export class MaterialsModule {}
