import { MaterialType } from "./entities/material_type.entity.js";
import { Material } from "./entities/material.entity.js";
import { MaterialShortCode } from "./entities/material_short_code.entity.js";
import { Manufacturer } from "./entities/manufacturer.entity.js";
import { ShortCode } from "./entities/short_code.entity.js";
import { ShortCodeType } from "./entities/short_code_type.entity.js";
import { PartType } from "./entities/part_type.entity.js";
import { PartMaterial } from "./entities/part_material.entity.js";
import { Part } from "./entities/part.entity.js";
import { PartShortCode } from "./entities/part_short_code.entity.js";
import { PartChildren } from "./entities/part_children.entity.js";
import { BaseTables1720373216667 } from "./migrations/1733690865449-base-tables.js";
import { PartAmount1748372988976 } from "./migrations/1748372988976-part-amount.js";
import { CheckoutTime1749376805136 } from "./migrations/1749376805136-checkout-time.js";
import { AddHintFields1753046680101 } from "./migrations/1753046680101-add-hint-fields.js";
import { AddArchiveTime1766219951021 } from "./migrations/1766219951021-add-archive-time.js";

export const DATABASE_OPTIONS = {
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
    AddHintFields1753046680101,
    AddArchiveTime1766219951021,
  ],
};
