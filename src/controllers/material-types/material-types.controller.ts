import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import {
  MaterialTypeCreateDto,
  MaterialTypeDto,
  MaterialTypeUpdateDto,
} from '../../models/material-type.model.js';
import { MaterialTypeService } from '../../repositories/material-type/material-type.service.js';
import { PaginationResultDto } from '../../fsarch/pagination/pagination-result.dto.js';
import { OnEvent } from '@nestjs/event-emitter';
import { EEvent } from '../../constants/event.enum.js';

@ApiTags('material-type')
@Controller({
  path: 'material-types',
  version: '1',
})
@ApiBearerAuth()
export class MaterialTypesController {
  constructor(private readonly materialTypeService: MaterialTypeService) {}

  @Post()
  public async Create(@Body() materialTypeCreateDto: MaterialTypeCreateDto) {
    return await this.materialTypeService.CreateMaterialType(
      materialTypeCreateDto,
    );
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
              items: { $ref: getSchemaPath(MaterialTypeDto) },
            },
          },
        },
      ],
    },
  })
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
  public async List(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('isArchived') isArchived?: boolean,
    @Query('search') search?: string,
  ): Promise<PaginationResultDto<MaterialTypeDto>> {
    const takeValue = take ?? 25;

    const all = await this.materialTypeService.ListMaterialTypes(
      isArchived ?? false,
      search,
    );

    const totalItems = all.length;
    const start = skip ?? 0;

    const data = all.slice(start, start + takeValue).map(MaterialTypeDto.FromDbo);

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

  @Get('/:materialTypeId')
  public async Get(
    @Param('materialTypeId') materialTypeId: string,
  ): Promise<MaterialTypeDto> {
    const materialType =
      await this.materialTypeService.GetMaterialType(materialTypeId);

    return MaterialTypeDto.FromDbo(materialType);
  }

  @Delete('/:materialTypeId')
  public async Delete(
    @Param('materialTypeId') materialTypeId: string,
  ): Promise<void> {
    await this.materialTypeService.DeleteById(materialTypeId);
  }

  @Patch('/:materialTypeId')
  public async Update(
    @Param('materialTypeId') materialTypeId: string,
    @Body() updateDto: MaterialTypeUpdateDto,
  ): Promise<void> {
    await this.materialTypeService.UpdateMaterialType(
      materialTypeId,
      updateDto,
    );
  }

  @OnEvent(EEvent.DELETE_MANUFACTURER)
  public async DeleteByManufacturer(payload: {
    id: string;
    deletionTime: string;
  }) {
    const materialTypes = await this.materialTypeService.ListByManufacturer(
      payload.id,
    );

    for (let materialType of materialTypes) {
      await this.materialTypeService.DeleteById(
        materialType.id,
        payload.deletionTime,
      );
    }
  }
}
