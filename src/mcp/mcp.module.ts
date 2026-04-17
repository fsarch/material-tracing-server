import { Module } from '@nestjs/common';
import { McpModule as RekovMcpModule } from '@rekog/mcp-nest';
import { ManufacturerMcpModule } from './modules/manufacturer-mcp.module.js';
import { MaterialMcpModule } from './modules/material-mcp.module.js';
import { MaterialTypeMcpModule } from './modules/material-type-mcp.module.js';
import { PartMcpModule } from './modules/part-mcp.module.js';
import { PartTypeMcpModule } from './modules/part-type-mcp.module.js';
import { ShortCodeMcpModule } from './modules/short-code-mcp.module.js';

@Module({
  imports: [
    RekovMcpModule.forRoot({
      name: 'material-tracing-server',
      version: '1.0.0',
      capabilities: {
        tools: {},
      },
      apiPrefix: '.ai',
    }),
    ManufacturerMcpModule,
    MaterialMcpModule,
    MaterialTypeMcpModule,
    PartMcpModule,
    PartTypeMcpModule,
    ShortCodeMcpModule,
  ],
})
export class McpModule {}
