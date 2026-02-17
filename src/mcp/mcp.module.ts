import { Module } from '@nestjs/common';
import { McpService } from './mcp.service.js';
import { ManufacturerModule } from '../repositories/manufacturer/manufacturer.module.js';
import { MaterialModule } from '../repositories/material/material.module.js';
import { MaterialTypeModule } from '../repositories/material-type/material-type.module.js';
import { PartModule } from '../repositories/part/part.module.js';
import { PartTypeModule } from '../repositories/part-type/part-type.module.js';
import { ShortCodeModule } from '../repositories/short-code/short-code.module.js';

@Module({
  imports: [
    ManufacturerModule,
    MaterialModule,
    MaterialTypeModule,
    PartModule,
    PartTypeModule,
    ShortCodeModule,
  ],
  providers: [McpService],
  exports: [McpService],
})
export class McpModule {}
