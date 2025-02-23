import { Module } from '@nestjs/common';
import { ManufacturerModule } from './manufacturer/manufacturer.module.js';
import { MaterialModule } from './material/material.module.js';
import { MaterialTypeModule } from './material-type/material-type.module.js';
import { ShortCodeModule } from './short-code/short-code.module.js';
import { MaterialShortCodeModule } from './material-short-code/material-short-code.module.js';

@Module({
  imports: [ManufacturerModule, MaterialModule, MaterialTypeModule, ShortCodeModule, MaterialShortCodeModule],
})
export class RepositoriesModule {}
