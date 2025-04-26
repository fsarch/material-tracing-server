import { Module } from '@nestjs/common';
import { ManufacturerModule } from './manufacturer/manufacturer.module.js';
import { MaterialModule } from './material/material.module.js';
import { MaterialTypeModule } from './material-type/material-type.module.js';
import { ShortCodeModule } from './short-code/short-code.module.js';
import { MaterialShortCodeModule } from './material-short-code/material-short-code.module.js';
import { PartTypeModule } from './part-type/part-type.module.js';
import { PartModule } from './part/part.module.js';
import { PartShortCodeModule } from "./part-short-code/part-short-code.module.js";
import { PartMaterialModule } from './part-material/part-material.module.js';

@Module({
  imports: [ManufacturerModule, MaterialModule, MaterialTypeModule, ShortCodeModule, MaterialShortCodeModule, PartTypeModule, PartModule, PartShortCodeModule, PartMaterialModule],
})
export class RepositoriesModule {}
