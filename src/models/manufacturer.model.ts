import { ApiProperty } from "@nestjs/swagger";
import { Manufacturer } from "../database/entities/manufacturer.entity.js";
import { IsOptional } from "class-validator";

export class ManufacturerCreateDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  externalId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  hint?: string;
}

export class ManufacturerDto {
  public static FromDbo(catalog: Manufacturer): ManufacturerDto {
    const manufacturerDto = new ManufacturerDto();

    manufacturerDto.id = catalog.id;
    manufacturerDto.name = catalog.name;
    manufacturerDto.externalId = catalog.externalId;
    manufacturerDto.hint = catalog.hint;

    return manufacturerDto;
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  externalId: string;

  @ApiProperty({ required: false })
  hint?: string;
}
