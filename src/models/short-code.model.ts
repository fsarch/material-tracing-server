import { ApiProperty } from "@nestjs/swagger";
import { ShortCode } from "../database/entities/short_code.entity.js";
import { IsOptional } from "class-validator";

export class ShortCodeCreateDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  shortCodeTypeId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  hint?: string;
}

export class ShortCodeUpdateDto {
  @ApiProperty({ required: false })
  @IsOptional()
  hint?: string;
}

export class ShortCodeDto {
  public static FromDbo(shortCode: ShortCode): ShortCodeDto {
    const shortCodeDto = new ShortCodeDto();

    shortCodeDto.id = shortCode.id;
    shortCodeDto.code = shortCode.code;
    shortCodeDto.shortCodeTypeId = shortCode.shortCodeTypeId;
    shortCodeDto.creationTime = shortCode.creationTime.toISOString();
    shortCodeDto.hint = shortCode.hint;

    return shortCodeDto;
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  shortCodeTypeId: string;

  @ApiProperty()
  creationTime: string;

  @ApiProperty({ required: false })
  hint?: string;
}
