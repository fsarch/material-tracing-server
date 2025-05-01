import { ApiProperty } from "@nestjs/swagger";

export class PartPartCreateDto {
  @ApiProperty()
  amount: number;
}
