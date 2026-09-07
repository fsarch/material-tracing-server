import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  PartTypeCreateDto,
  PartTypeDto,
  PartTypePatchDto,
} from '../../models/part-type.model.js';
import { PartTypeService } from '../../repositories/part-type/part-type.service.js';
import { ApiOkPaginatedResponse, PaginationResultDto } from '@fsarch/server/pagination';
import { UserData, User } from '@fsarch/server/auth';

@ApiTags('part-types')
@Controller({
  path: 'part-types',
  version: '1',
})
@ApiBearerAuth()
export class PartTypesController {
  constructor(private readonly partTypeService: PartTypeService) {}

  @Post()
  public async Create(
    @Body() partTypeCreateDto: PartTypeCreateDto,
    @UserData() user: User,
  ) {
    return await this.partTypeService.CreatePartType(partTypeCreateDto, {
      user,
    });
  }

  @Get()
  @ApiOkPaginatedResponse(PartTypeDto)
  @ApiQuery({
    name: 'isArchived',
    type: Boolean,
    required: false,
    description: 'Filter by archived status (default: false)',
  })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
    description: 'Search by name (case-insensitive) or externalId',
  })
  @ApiQuery({
    name: 'productId',
    type: String,
    required: false,
    description:
      'Filter by the linked product-server product ID (exact match)',
  })
  public async List(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('isArchived') isArchived?: boolean,
    @Query('search') search?: string,
    @Query('productId') productId?: string,
  ): Promise<PaginationResultDto<PartTypeDto>> {
    const takeValue = take ?? 25;

    const all = await this.partTypeService.ListPartTypes(
      isArchived ?? false,
      search,
      productId,
    );

    const totalItems = all.length;
    const start = skip ?? 0;

    const data = all.slice(start, start + takeValue).map(PartTypeDto.FromDbo);

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

  @Get('/:partTypeId')
  public async Get(
    @Param('partTypeId') partTypeId: string,
  ): Promise<PartTypeDto> {
    const partType = await this.partTypeService.GetPartType(partTypeId);
    if (!partType) {
      throw new NotFoundException();
    }

    return PartTypeDto.FromDbo(partType);
  }

  @Patch('/:partTypeId')
  public async Update(
    @Param('partTypeId') partTypeId: string,
    @Body() partTypePatchDto: PartTypePatchDto,
    @UserData() user: User,
  ) {
    const part = await this.partTypeService.GetPartType(partTypeId);

    if (!part) {
      throw new NotFoundException();
    }

    return await this.partTypeService.UpdatePartType(
      partTypeId,
      partTypePatchDto,
      { user },
    );
  }

  @Delete('/:partTypeId')
  public async Delete(@Param('partTypeId') partTypeId: string): Promise<void> {
    await this.partTypeService.Delete(partTypeId);
  }
}
