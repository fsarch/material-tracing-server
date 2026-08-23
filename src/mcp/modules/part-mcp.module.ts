import { Module } from '@nestjs/common';
import { PartModule as PartRepositoryModule } from '../../repositories/part/part.module.js';
import { PartToolProvider } from '../tools/part-tool.provider.js';

@Module({
  imports: [PartRepositoryModule],
  controllers: [PartToolProvider],
})
export class PartMcpModule {}
