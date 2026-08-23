import { Module } from '@nestjs/common';
import { ShortCodeModule as ShortCodeRepositoryModule } from '../../repositories/short-code/short-code.module.js';
import { ShortCodeToolProvider } from '../tools/short-code-tool.provider.js';

@Module({
  imports: [ShortCodeRepositoryModule],
  controllers: [ShortCodeToolProvider],
})
export class ShortCodeMcpModule {}
