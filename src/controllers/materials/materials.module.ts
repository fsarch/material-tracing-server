import { Module } from '@nestjs/common';
import { MaterialsController } from './materials.controller.js';
import { MaterialModule } from "../../repositories/material/material.module.js";
import { MaterialTypeModule } from "../../repositories/material-type/material-type.module.js";
import { ShortCodesModule } from './short-codes/short-codes.module.js';

@Module({
  controllers: [MaterialsController],
  imports: [MaterialModule, MaterialTypeModule, ShortCodesModule],
})
export class MaterialsModule {}
