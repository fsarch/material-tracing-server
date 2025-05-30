import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ManufacturerService } from "../../repositories/manufacturer/manufacturer.service.js";
import { ManufacturerCreateDto, ManufacturerDto } from "../../models/manufacturer.model.js";

@ApiTags('manufacturers')
@Controller({
  path: 'manufacturers',
  version: '1',
})
@ApiBearerAuth()
export class ManufacturersController {
  constructor(
    private readonly manufacturerService: ManufacturerService,
  ) {}

  @Post()
  public async Create(@Body() manufacturerCreateDto: ManufacturerCreateDto) {
    const createdManufacturer = await this.manufacturerService.CreateManufacturer(manufacturerCreateDto)

    return {
      id: createdManufacturer.id,
    };
  }

  @Get()
  public async List(): Promise<Array<ManufacturerDto>> {
    const manufacturers = await this.manufacturerService.ListManufacturers();

    return manufacturers.map(ManufacturerDto.FromDbo);
  }

  @Get('/:manufacturerId')
  public async Get(
    @Param('manufacturerId') manufacturerId: string,
  ): Promise<ManufacturerDto> {
    const manufacturer = await this.manufacturerService.GetManufacturerById(manufacturerId);

    return ManufacturerDto.FromDbo(manufacturer);
  }

  @Delete('/:manufacturerId')
  public async Delete(
    @Param('manufacturerId') manufacturerId: string,
  ): Promise<void> {
    await this.manufacturerService.DeleteManufacturer(manufacturerId);
  }
}
