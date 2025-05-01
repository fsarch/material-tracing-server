import { Module } from '@nestjs/common';
import { PartsController } from './parts.controller.js';
import { PartPartModule } from "../../../repositories/part-part/part-part.module.js";
import { PartModule } from "../../../repositories/part/part.module.js";

@Module({
  controllers: [PartsController],
  imports: [PartPartModule, PartModule],
})
export class PartsModule {}
