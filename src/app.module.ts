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
        ],
        migrations: [
          BaseTables1720373216667
        ],
      },
    }),
    ControllersModule,
    RepositoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
