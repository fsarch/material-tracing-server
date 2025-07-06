import { Module } from '@nestjs/common';
import { PartTypesController } from './part-types.controller.js';
import { PartTypeModule } from "../../repositories/part-type/part-type.module.js";
import { ActionsModule } from './actions/actions.module.js';

@Module({
  controllers: [PartTypesController],
  imports: [PartTypeModule, ActionsModule],
})
export class PartTypesModule {}
