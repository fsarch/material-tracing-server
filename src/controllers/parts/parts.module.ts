import { Module } from '@nestjs/common';
import { PartsController } from './parts.controller.js';
import { PartModule } from "../../repositories/part/part.module.js";
import { PartTypeModule } from "../../repositories/part-type/part-type.module.js";

@Module({
  controllers: [PartsController],
  imports: [PartModule, PartTypeModule],
})
export class PartsModule {}
