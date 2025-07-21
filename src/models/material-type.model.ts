import { ApiProperty } from "@nestjs/swagger";
import { MaterialType } from "../database/entities/material_type.entity.js";
import { IsOptional } from "class-validator";

export class MaterialTypeCreateDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  externalId: string;

  @ApiProperty()
  manufacturerId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  hint?: string;
}

export class MaterialTypeUpdateDto {
  @ApiProperty({ required: false })
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  externalId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  hint?: string;
}

export class MaterialTypeDto {
  public static FromDbo(materialType: MaterialType): MaterialTypeDto {
    const materialTypeDto = new MaterialTypeDto();

    materialTypeDto.id = materialType.id;
    materialTypeDto.name = materialType.name;
    materialTypeDto.externalId = materialType.externalId;
    materialTypeDto.manufacturerId = materialType.manufacturerId;
    materialTypeDto.hint = materialType.hint;

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

  @ApiProperty({ required: false })
  hint?: string;
}
