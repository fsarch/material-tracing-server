import { Module } from '@nestjs/common';
import { ProductServerService } from './product-server.service.js';

@Module({
  providers: [ProductServerService],
  exports: [ProductServerService],
})
export class ProductServerModule {}
