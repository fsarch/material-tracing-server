import { Module } from '@nestjs/common';
import { ProductServerController } from './product-server.controller.js';
import { ProductServerModule as ProductServerRepositoryModule } from '../../repositories/product-server/product-server.module.js';

@Module({
  controllers: [ProductServerController],
  imports: [ProductServerRepositoryModule],
})
export class ProductServerModule {}
