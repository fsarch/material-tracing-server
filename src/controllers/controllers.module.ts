import { Module } from '@nestjs/common';
import { MaterialsModule } from './materials/materials.module.js';
import { MaterialTypesModule } from './material-types/material-types.module.js';
import { ManufacturersModule } from './manufacturers/manufacturers.module.js';
import { ShortCodesModule } from './short-codes/short-codes.module.js';
import { MetaModule } from './meta/meta.module.js';
import { PartTypesModule } from './part-types/part-types.module.js';
import { PartsModule } from './parts/parts.module.js';
import { WellKnownModule } from './well-known/well-known.module.js';

@Module({
  imports: [
    MaterialsModule,
    MaterialTypesModule,
    ManufacturersModule,
    ShortCodesModule,
    MetaModule,
    PartTypesModule,
    PartsModule,
    WellKnownModule,
  ],
})
export class ControllersModule {}
