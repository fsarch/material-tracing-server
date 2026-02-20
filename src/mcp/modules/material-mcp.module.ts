import { Module } from '@nestjs/common';
import { McpModule } from '@rekog/mcp-nest';
import { MaterialModule as MaterialRepositoryModule } from '../../repositories/material/material.module.js';
import { MaterialToolProvider } from '../tools/material-tool.provider.js';

@Module({
  imports: [
    MaterialRepositoryModule,
    McpModule.forFeature([MaterialToolProvider], 'material-tracing-server'),
  ],
  providers: [MaterialToolProvider],
  exports: [MaterialToolProvider],
})
export class MaterialMcpModule {}
