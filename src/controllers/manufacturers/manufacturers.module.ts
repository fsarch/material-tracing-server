import { Module } from '@nestjs/common';
import { ManufacturersController } from './manufacturers.controller.js';
import { ManufacturerModule } from "../../repositories/manufacturer/manufacturer.module.js";
import { ActionsModule } from './actions/actions.module.js';

@Module({
  controllers: [ManufacturersController],
  imports: [ManufacturerModule, ActionsModule],
})
export class ManufacturersModule {}
