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
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ManufacturerService } from '../../repositories/manufacturer/manufacturer.service.js';
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
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
    description: 'Search by name (case-insensitive) or externalId',
  })
  public async List(
    @Query('search') search?: string,
  ): Promise<Array<ManufacturerDto>> {
    const manufacturers =
      await this.manufacturerService.ListManufacturers(search);

    return manufacturers.map(ManufacturerDto.FromDbo);
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
