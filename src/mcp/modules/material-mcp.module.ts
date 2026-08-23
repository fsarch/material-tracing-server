import { Module } from '@nestjs/common';
import { MaterialModule as MaterialRepositoryModule } from '../../repositories/material/material.module.js';
import { MaterialToolProvider } from '../tools/material-tool.provider.js';

@Module({
  imports: [MaterialRepositoryModule],
  controllers: [MaterialToolProvider],
})
export class MaterialMcpModule {}
