import { ApiProperty } from '@nestjs/swagger';
import { PartType } from '../database/entities/part_type.entity.js';
import { IsOptional } from 'class-validator';

export class PartTypeCreateDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  externalId: string;

  @ApiProperty({
    required: false,
    description: 'ID of the linked product in product-server',
  })
  @IsOptional()
  productId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  hint?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  archiveTime?: Date;
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

  @ApiProperty({
    required: false,
    description: 'ID of the linked product in product-server',
  })
  @IsOptional()
  productId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  hint?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  archiveTime?: Date;
}

export class PartTypeDto {
  public static FromDbo(partType: PartType): PartTypeDto {
    const partTypeDto = new PartTypeDto();

    partTypeDto.id = partType.id;
    partTypeDto.name = partType.name;
    partTypeDto.externalId = partType.externalId;
    partTypeDto.productId = partType.productId;
    partTypeDto.hint = partType.hint;
    partTypeDto.archiveTime = partType.archiveTime;

    return partTypeDto;
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  externalId: string;

  @ApiProperty({ required: false })
  productId?: string | null;

  @ApiProperty({ required: false })
  hint?: string;

  @ApiProperty({ required: false })
  archiveTime?: Date;
}
