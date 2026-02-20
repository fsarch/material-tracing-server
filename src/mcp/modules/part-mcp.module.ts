import { Module } from '@nestjs/common';
import { McpModule } from '@rekog/mcp-nest';
import { PartModule as PartRepositoryModule } from '../../repositories/part/part.module.js';
import { PartToolProvider } from '../tools/part-tool.provider.js';

@Module({
  imports: [
    PartRepositoryModule,
    McpModule.forFeature([PartToolProvider], 'material-tracing-server'),
  ],
  providers: [PartToolProvider],
  exports: [PartToolProvider],
})
export class PartMcpModule {}
