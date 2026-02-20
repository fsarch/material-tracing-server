import { Module } from '@nestjs/common';
import { McpModule } from '@rekog/mcp-nest';
import { ShortCodeModule as ShortCodeRepositoryModule } from '../../repositories/short-code/short-code.module.js';
import { ShortCodeToolProvider } from '../tools/short-code-tool.provider.js';

@Module({
  imports: [
    ShortCodeRepositoryModule,
    McpModule.forFeature([ShortCodeToolProvider], 'material-tracing-server'),
  ],
  providers: [ShortCodeToolProvider],
  exports: [ShortCodeToolProvider],
})
export class ShortCodeMcpModule {}
