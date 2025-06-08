import { ApiProperty } from "@nestjs/swagger";
import { Material } from "../database/entities/material.entity.js";

export class MaterialCreateDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  externalId: string;

  @ApiProperty()
  materialTypeId: string;

  @ApiProperty()
  imageRef: string;
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
}
