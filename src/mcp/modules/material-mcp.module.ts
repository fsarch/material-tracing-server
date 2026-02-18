import { Module } from '@nestjs/common';
import { MaterialModule as MaterialRepositoryModule } from '../../repositories/material/material.module.js';
import { MaterialToolProvider } from '../tools/material-tool.provider.js';

@Module({
  imports: [MaterialRepositoryModule],
  providers: [MaterialToolProvider],
  exports: [MaterialToolProvider],
})
export class MaterialMcpModule {}
