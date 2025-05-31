import { ApiProperty } from "@nestjs/swagger";
import { PartType } from "../database/entities/part_type.entity.js";

export class PartTypeCreateDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  externalId: string;
}

export class PartTypePatchDto {
  @ApiProperty({
    required: false,
  })
  name?: string;

  @ApiProperty({
    required: false,
  })
  externalId?: string;
}

export class PartTypeDto {
  public static FromDbo(partType: PartType): PartTypeDto {
    const partTypeDto = new PartTypeDto();

    partTypeDto.id = partType.id;
    partTypeDto.name = partType.name;
    partTypeDto.externalId = partType.externalId;

    return partTypeDto;
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  externalId: string;
}
