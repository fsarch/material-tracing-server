import { ApiProperty } from "@nestjs/swagger";
import { ShortCode } from "../database/entities/short_code.entity.js";

export class ShortCodeCreateDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  shortCodeTypeId: string;
}

export class ShortCodeDto {
  public static FromDbo(shortCode: ShortCode): ShortCodeDto {
    const shortCodeDto = new ShortCodeDto();

    shortCodeDto.id = shortCode.id;
    shortCodeDto.code = shortCode.code;
    shortCodeDto.shortCodeTypeId = shortCode.shortCodeTypeId;

    return shortCodeDto;
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  shortCodeTypeId: string;
}
