import { ApiProperty } from '@nestjs/swagger';

export class PartPartCreateDto {
  @ApiProperty()
  amount: number;
}

export class PartPartLinkDto {
  @ApiProperty()
  id: string;
}

export class PartPartDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  amount: number;
}

