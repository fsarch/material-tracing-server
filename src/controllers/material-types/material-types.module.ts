import { Module } from '@nestjs/common';
import { MaterialTypesController } from './material-types.controller.js';
import { MaterialTypeModule } from "../../repositories/material-type/material-type.module.js";

@Module({
  controllers: [MaterialTypesController],
  imports: [MaterialTypeModule],
})
export class MaterialTypesModule {}
