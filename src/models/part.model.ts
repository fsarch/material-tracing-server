import { ApiProperty } from "@nestjs/swagger";
import { Part } from "../database/entities/part.entity.js";
import { IsOptional } from "class-validator";

export class PartCreateDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  externalId: string;

  @ApiProperty()
  partTypeId: string;

  @ApiProperty()
  amount: number;

  @ApiProperty({ required: false })
  @IsOptional()
  hint?: string;
}

export class PartPatchDto {
  @ApiProperty()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsOptional()
  externalId?: string;

  @ApiProperty()
  @IsOptional()
  amount?: number;

  @ApiProperty()
  @IsOptional()
  checkoutTime?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  hint?: string;
}

export class PartDto {
  public static FromDbo(part: Part): PartDto {
    const partDto = new PartDto();

    partDto.id = part.id;
    partDto.name = part.name;
    partDto.externalId = part.externalId;
    partDto.partTypeId = part.partTypeId;
    partDto.amount = part.amount;
    partDto.creationTime = part.creationTime.toISOString();
    partDto.checkoutTime = part.checkoutTime;
    partDto.hint = part.hint;

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

  @ApiProperty()
  amount: number;

  @ApiProperty({
    required: false,
  })
  availableAmount?: number;

  @ApiProperty()
  creationTime: string;

  @ApiProperty()
  checkoutTime?: Date;

  @ApiProperty({ required: false })
  hint?: string;
}
