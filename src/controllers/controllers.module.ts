import { Module } from '@nestjs/common';
import { MaterialsModule } from './materials/materials.module.js';
import { MaterialTypesModule } from './material-types/material-types.module.js';
import { ManufacturersModule } from './manufacturers/manufacturers.module.js';
import { ShortCodesModule } from './short-codes/short-codes.module.js';
import { MetaModule } from './meta/meta.module.js';
import { PartTypesModule } from './part-types/part-types.module.js';
import { PartsModule } from './parts/parts.module.js';
import { ProductServerModule } from './product-server/product-server.module.js';
import { CustomResourcesModule } from '../custom-resources/custom-resources.module.js';
import { REGISTERED_CUSTOM_RESOURCES } from './custom-resources.config.js';

@Module({
  imports: [
    MaterialsModule,
    MaterialTypesModule,
    ManufacturersModule,
    ShortCodesModule,
    MetaModule,
    PartTypesModule,
    PartsModule,
    ProductServerModule,
    CustomResourcesModule.forRoot({ resources: REGISTERED_CUSTOM_RESOURCES }),
  ],
})
export class ControllersModule {}
