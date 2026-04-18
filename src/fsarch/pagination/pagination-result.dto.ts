import { PaginationResult, PaginationResultMetadata } from './pagination-result.type.js';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationResultMetaDto implements PaginationResultMetadata {
  @ApiProperty({
    description: 'Current page (1-based)',
    example: 1,
  })
  currentPage: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 25,
  })
  pageSize: number;

  @ApiProperty({
    description: 'Total number of items available',
    example: 123,
  })
  totalItems: number;

  @ApiProperty({
    description: 'Total pages available for the current pageSize',
    example: 5,
  })
  totalPages: number;
}

export class PaginationResultDto<T> implements PaginationResult<T> {
  @ApiProperty({
    description: 'Page data array',
    isArray: true,
    type: Object,
  })
  data: Array<T>;

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationResultMetaDto,
  })
  metadata: PaginationResultMetaDto;
}
