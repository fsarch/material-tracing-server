import { Module } from '@nestjs/common';
import { MaterialsModule } from './materials/materials.module.js';
import { MaterialTypesModule } from './material-types/material-types.module.js';
import { ManufacturersModule } from './manufacturers/manufacturers.module.js';
import { ShortCodesModule } from './short-codes/short-codes.module.js';

@Module({
  imports: [MaterialsModule, MaterialTypesModule, ManufacturersModule, ShortCodesModule]
})
export class ControllersModule {}
