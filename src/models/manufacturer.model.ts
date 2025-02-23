import { ApiProperty } from "@nestjs/swagger";
import { Manufacturer } from "../database/entities/manufacturer.entity.js";

export class ManufacturerCreateDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  externalId: string;
}

export class ManufacturerDto {
  public static FromDbo(catalog: Manufacturer): ManufacturerDto {
    const manufacturerDto = new ManufacturerDto();

    manufacturerDto.id = catalog.id;
    manufacturerDto.name = catalog.name;
    manufacturerDto.externalId = catalog.externalId;

    return manufacturerDto;
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  externalId: string;
}
