import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { FsarchModule } from './fsarch/fsarch.module.js';
import { ControllersModule } from './controllers/controllers.module.js';
import { RepositoriesModule } from './repositories/repositories.module.js';
import { BaseTables1720373216667 } from "./database/migrations/1733690865449-base-tables.js";
import { MaterialType } from "./database/entities/material_type.entity.js";
import { Material } from "./database/entities/material.entity.js";
import { MaterialShortCode } from "./database/entities/material_short_code.entity.js";
import { ShortCode } from "./database/entities/short_code.entity.js";
import { ShortCodeType } from "./database/entities/short_code_type.entity.js";
import { Manufacturer } from "./database/entities/manufacturer.entity.js";
import { PartType } from "./database/entities/part_type.entity.js";
import { Part } from "./database/entities/part.entity.js";
import { PartShortCode } from "./database/entities/part_short_code.entity.js";
import { PartMaterial } from "./database/entities/part_material.entity.js";
import { PartChildren } from "./database/entities/part_children.entity.js";
import { PartAmount1748372988976 } from "./database/migrations/1748372988976-part-amount.js";
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CheckoutTime1749376805136 } from "./database/migrations/1749376805136-checkout-time.js";

@Module({
  imports: [
    FsarchModule.register({
      auth: {},
      database: {
        entities: [
          MaterialType,
          Material,
          MaterialShortCode,
          Manufacturer,
          ShortCode,
          ShortCodeType,
          PartType,
          PartMaterial,
          Part,
          PartShortCode,
          PartChildren,
        ],
        migrations: [
          BaseTables1720373216667,
          PartAmount1748372988976,
          CheckoutTime1749376805136,
        ],
      },
    }),
    EventEmitterModule.forRoot(),
    ControllersModule,
    RepositoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
