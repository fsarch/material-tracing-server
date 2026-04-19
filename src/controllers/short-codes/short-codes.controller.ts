import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Patch,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ShortCodeService } from '../../repositories/short-code/short-code.service.js';
import {
  ShortCodeDto,
  ShortCodeUpdateDto,
} from '../../models/short-code.model.js';
import { PaginationResultDto } from '../../fsarch/pagination/pagination-result.dto.js';
import { ShortCodeType } from '../../constants/short-code-type.enum.js';

@ApiTags('short-code')
@Controller({
  path: 'short-codes',
  version: '1',
})
@ApiBearerAuth()
export class ShortCodesController {
  constructor(private readonly shortCodeService: ShortCodeService) {}

  @Post()
  public async CreateShortCode() {
    return this.shortCodeService.CreateShortCode();
  }

  @Get()
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginationResultDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(ShortCodeDto) },
            },
          },
        },
      ],
    },
  })
  @ApiQuery({
    name: 'shortCodeTypeId',
    required: false,
    enum: ShortCodeType,
    enumName: 'ShortCodeType',
  })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
    description: 'Search by code (case-insensitive)',
  })
  public async ListShortCodes(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('shortCodeTypeId') shortCodeTypeId?: ShortCodeType,
    @Query('search') search?: string,
  ): Promise<PaginationResultDto<ShortCodeDto>> {
    const takeValue = take ?? 25;

    const all = await this.shortCodeService.ListShortCodes({
      shortCodeTypeId,
      search,
    });

    const totalItems = all.length;
    const start = skip ?? 0;

    const data = all.slice(start, start + takeValue).map(ShortCodeDto.FromDbo);

    const metadata = {
      currentPage: Math.floor(start / takeValue) + 1,
      pageSize: takeValue,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / takeValue)),
    };

    return {
      data,
      metadata,
    };
  }

  @Get(':code')
  public async GetShortCode(@Param('code') code: string) {
    const shortCode = await this.shortCodeService.GetShortCodeByCode(code);
    if (!shortCode) {
      throw new NotFoundException();
    }

    return ShortCodeDto.FromDbo(shortCode);
  }

  @Patch(':code')
  public async UpdateShortCode(
    @Param('code') code: string,
    @Body() updateDto: ShortCodeUpdateDto,
  ) {
    const shortCode = await this.shortCodeService.GetShortCodeByCode(code);
    if (!shortCode) {
      throw new NotFoundException();
    }

    await this.shortCodeService.UpdateShortCodeHint(shortCode.id, updateDto);
  }
}
