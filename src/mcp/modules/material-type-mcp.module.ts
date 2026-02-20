import { Module } from '@nestjs/common';
import { McpModule } from '@rekog/mcp-nest';
import { MaterialTypeModule as MaterialTypeRepositoryModule } from '../../repositories/material-type/material-type.module.js';
import { MaterialTypeToolProvider } from '../tools/material-type-tool.provider.js';

@Module({
  imports: [
    MaterialTypeRepositoryModule,
    McpModule.forFeature([MaterialTypeToolProvider], 'material-tracing-server'),
  ],
  providers: [MaterialTypeToolProvider],
  exports: [MaterialTypeToolProvider],
})
export class MaterialTypeMcpModule {}
