import { Module } from '@nestjs/common';
import { MaterialTypeModule as MaterialTypeRepositoryModule } from '../../repositories/material-type/material-type.module.js';
import { MaterialTypeToolProvider } from '../tools/material-type-tool.provider.js';

@Module({
  imports: [MaterialTypeRepositoryModule],
  providers: [MaterialTypeToolProvider],
  exports: [MaterialTypeToolProvider],
})
export class MaterialTypeMcpModule {}
