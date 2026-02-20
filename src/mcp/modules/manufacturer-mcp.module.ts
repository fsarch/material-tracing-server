import { Module } from '@nestjs/common';
import { McpModule } from '@rekog/mcp-nest';
import { ManufacturerModule as ManufacturerRepositoryModule } from '../../repositories/manufacturer/manufacturer.module.js';
import { ManufacturerToolProvider } from '../tools/manufacturer-tool.provider.js';

@Module({
  imports: [
    ManufacturerRepositoryModule,
    McpModule.forFeature([ManufacturerToolProvider], 'material-tracing-server'),
  ],
  providers: [ManufacturerToolProvider],
  exports: [ManufacturerToolProvider],
})
export class ManufacturerMcpModule {}


