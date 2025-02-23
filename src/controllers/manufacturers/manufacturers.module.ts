import { Module } from '@nestjs/common';
import { ManufacturersController } from './manufacturers.controller.js';
import { ManufacturerModule } from "../../repositories/manufacturer/manufacturer.module.js";

@Module({
  controllers: [ManufacturersController],
  imports: [ManufacturerModule],
})
export class ManufacturersModule {}
