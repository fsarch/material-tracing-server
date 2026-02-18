import { Module } from '@nestjs/common';
import { McpService } from './mcp.service.js';
import { McpController } from './mcp.controller.js';
import { ToolRegistryService } from './core/tool-registry.service.js';
import { ManufacturerMcpModule } from './modules/manufacturer-mcp.module.js';
import { MaterialMcpModule } from './modules/material-mcp.module.js';
import { MaterialTypeMcpModule } from './modules/material-type-mcp.module.js';
import { PartMcpModule } from './modules/part-mcp.module.js';
import { PartTypeMcpModule } from './modules/part-type-mcp.module.js';
import { ShortCodeMcpModule } from './modules/short-code-mcp.module.js';

@Module({
  imports: [
    ManufacturerMcpModule,
    MaterialMcpModule,
    MaterialTypeMcpModule,
    PartMcpModule,
    PartTypeMcpModule,
    ShortCodeMcpModule,
  ],
  providers: [McpService, ToolRegistryService],
  controllers: [McpController],
  exports: [McpService],
})
export class McpModule {}
