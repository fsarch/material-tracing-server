import { ApiProperty } from "@nestjs/swagger";
import { MaterialType } from "../database/entities/material_type.entity.js";

export class MaterialTypeCreateDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  externalId: string;

  @ApiProperty()
  manufacturerId: string;
}

export class MaterialTypeDto {
  public static FromDbo(materialType: MaterialType): MaterialTypeDto {
    const materialTypeDto = new MaterialTypeDto();

    materialTypeDto.id = materialType.id;
    materialTypeDto.name = materialType.name;
    materialTypeDto.externalId = materialType.externalId;
    materialTypeDto.manufacturerId = materialType.manufacturerId;

    return materialTypeDto;
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  externalId: string;

  @ApiProperty()
  manufacturerId: string;
}
