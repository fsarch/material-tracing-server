import { ApiProperty } from "@nestjs/swagger";
import { PartType } from "../database/entities/part_type.entity.js";
import { IsOptional } from "class-validator";

export class PartTypeCreateDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  externalId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  hint?: string;
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

  @ApiProperty({ required: false })
  @IsOptional()
  hint?: string;
}

export class PartTypeDto {
  public static FromDbo(partType: PartType): PartTypeDto {
    const partTypeDto = new PartTypeDto();

    partTypeDto.id = partType.id;
    partTypeDto.name = partType.name;
    partTypeDto.externalId = partType.externalId;
    partTypeDto.hint = partType.hint;

    return partTypeDto;
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
