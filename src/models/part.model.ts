import { ApiProperty } from "@nestjs/swagger";
import { Part } from "../database/entities/part.entity.js";

export class PartCreateDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  externalId: string;

  @ApiProperty()
  partTypeId: string;
}

export class PartDto {
  public static FromDbo(part: Part): PartDto {
    const partDto = new PartDto();

    partDto.id = part.id;
    partDto.name = part.name;
    partDto.externalId = part.externalId;
    partDto.partTypeId = part.partTypeId;

    return partDto;
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  externalId: string;

  @ApiProperty()
  partTypeId: string;
}
