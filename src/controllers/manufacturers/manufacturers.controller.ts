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
import { ManufacturerService } from '../../repositories/manufacturer/manufacturer.service.js';
import { PaginationResultDto } from '../../fsarch/pagination/pagination-result.dto.js';
import {
  ManufacturerCreateDto,
  ManufacturerDto,
  ManufacturerUpdateDto,
} from '../../models/manufacturer.model.js';

@ApiTags('manufacturers')
@Controller({
  path: 'manufacturers',
  version: '1',
})
@ApiBearerAuth()
export class ManufacturersController {
  constructor(private readonly manufacturerService: ManufacturerService) {}

  @Post()
  public async Create(@Body() manufacturerCreateDto: ManufacturerCreateDto) {
    const createdManufacturer =
      await this.manufacturerService.CreateManufacturer(manufacturerCreateDto);

    return {
      id: createdManufacturer.id,
    };
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
              items: { $ref: getSchemaPath(ManufacturerDto) },
            },
          },
        },
      ],
    },
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
    @Query('search') search?: string,
  ): Promise<PaginationResultDto<ManufacturerDto>> {
    const takeValue = take ?? 25;

    const all = await this.manufacturerService.ListManufacturers(search);

    const totalItems = all.length;
    const start = skip ?? 0;

    const data = all.slice(start, start + takeValue).map(ManufacturerDto.FromDbo);

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

  @Get('/:manufacturerId')
  public async Get(
    @Param('manufacturerId') manufacturerId: string,
  ): Promise<ManufacturerDto> {
    const manufacturer =
      await this.manufacturerService.GetManufacturerById(manufacturerId);

    return ManufacturerDto.FromDbo(manufacturer);
  }

  @Delete('/:manufacturerId')
  public async Delete(
    @Param('manufacturerId') manufacturerId: string,
  ): Promise<void> {
    await this.manufacturerService.DeleteManufacturer(manufacturerId);
  }

  @Patch('/:manufacturerId')
  public async Update(
    @Param('manufacturerId') manufacturerId: string,
    @Body() updateDto: ManufacturerUpdateDto,
  ): Promise<void> {
    await this.manufacturerService.UpdateManufacturer(
      manufacturerId,
      updateDto,
    );
  }
}
