import { Module } from '@nestjs/common';
import { McpModule } from '@rekog/mcp-nest';
import { PartTypeModule as PartTypeRepositoryModule } from '../../repositories/part-type/part-type.module.js';
import { PartTypeToolProvider } from '../tools/part-type-tool.provider.js';

@Module({
  imports: [
    PartTypeRepositoryModule,
    McpModule.forFeature([PartTypeToolProvider], 'material-tracing-server'),
  ],
  providers: [PartTypeToolProvider],
  exports: [PartTypeToolProvider],
})
export class PartTypeMcpModule {}
