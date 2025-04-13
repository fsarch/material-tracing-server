import { Module } from '@nestjs/common';
import { PartTypesController } from './part-types.controller.js';
import { PartTypeModule } from "../../repositories/part-type/part-type.module.js";

@Module({
  controllers: [PartTypesController],
  imports: [PartTypeModule],
})
export class PartTypesModule {}
