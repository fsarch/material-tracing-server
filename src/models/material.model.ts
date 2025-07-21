import { ApiProperty } from "@nestjs/swagger";
import { Material } from "../database/entities/material.entity.js";
import { IsOptional } from "class-validator";

export class MaterialCreateDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  externalId: string;

  @ApiProperty()
  materialTypeId: string;

  @ApiProperty()
  imageRef: string;

  @ApiProperty({ required: false })
  @IsOptional()
  hint?: string;
}

export class MaterialUpdateDto {
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

export class MaterialDto {
  public static FromDbo(material: Material): MaterialDto {
    const materialDto = new MaterialDto();

    materialDto.id = material.id;
    materialDto.name = material.name;
    materialDto.externalId = material.externalId;
    materialDto.materialTypeId = material.materialTypeId;
    materialDto.imageRef = material.imageRef;
    materialDto.creationTime = material.creationTime;
    materialDto.checkoutTime = material.checkoutTime;
    materialDto.hint = material.hint;

    return materialDto;
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  externalId: string;

  @ApiProperty()
  materialTypeId: string;

  @ApiProperty()
  imageRef: string;

  @ApiProperty()
  creationTime: Date;

  @ApiProperty()
  checkoutTime?: Date;

  @ApiProperty({ required: false })
  hint?: string;
}
