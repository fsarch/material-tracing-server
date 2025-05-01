import { Module } from '@nestjs/common';
import { PartsController } from './parts.controller.js';
import { ShortCodeModule } from "../../../repositories/short-code/short-code.module.js";
import { PartShortCodeModule } from "../../../repositories/part-short-code/part-short-code.module.js";
import { PartModule } from "../../../repositories/part/part.module.js";

@Module({
  controllers: [PartsController],
  imports: [ShortCodeModule, PartShortCodeModule, PartModule],
})
export class PartsModule {}
