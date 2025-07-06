import { Module } from '@nestjs/common';
import { MaterialTypesController } from './material-types.controller.js';
import { MaterialTypeModule } from "../../repositories/material-type/material-type.module.js";
import { ActionsModule } from './actions/actions.module.js';

@Module({
  controllers: [MaterialTypesController],
  imports: [MaterialTypeModule, ActionsModule],
})
export class MaterialTypesModule {}
