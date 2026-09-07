import { Module } from '@nestjs/common';
import { PartTypeService } from './part-type.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartType } from '../../database/entities/part_type.entity.js';
import { ProductServerModule } from '../product-server/product-server.module.js';

@Module({
  providers: [PartTypeService],
  exports: [PartTypeService],
  imports: [TypeOrmModule.forFeature([PartType]), ProductServerModule],
})
export class PartTypeModule {}
