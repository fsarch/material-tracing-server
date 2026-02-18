import { Module } from '@nestjs/common';
import { ManufacturerModule as ManufacturerRepositoryModule } from '../../repositories/manufacturer/manufacturer.module.js';
import { ManufacturerToolProvider } from '../tools/manufacturer-tool.provider.js';

@Module({
  imports: [ManufacturerRepositoryModule],
  providers: [ManufacturerToolProvider],
  exports: [ManufacturerToolProvider],
})
export class ManufacturerMcpModule {}
