import { Module } from '@nestjs/common';
import { ActionsController } from './actions.controller.js';
import { ActionModule } from "../../../repositories/actions/action.module.js";

@Module({
  controllers: [ActionsController],
  imports: [ActionModule],
})
export class ActionsModule {}