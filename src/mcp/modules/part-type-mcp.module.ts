import { Module } from '@nestjs/common';
import { PartTypeModule as PartTypeRepositoryModule } from '../../repositories/part-type/part-type.module.js';
import { PartTypeToolProvider } from '../tools/part-type-tool.provider.js';

@Module({
  imports: [PartTypeRepositoryModule],
  providers: [PartTypeToolProvider],
  exports: [PartTypeToolProvider],
})
export class PartTypeMcpModule {}
