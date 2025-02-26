import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { MaterialTypeCreateDto, MaterialTypeDto } from "../../models/material-type.model.js";
import { MaterialTypeService } from "../../repositories/material-type/material-type.service.js";

@ApiTags('material-type')
@Controller({
  path: 'material-types',
  version: '1',
})
@ApiBearerAuth()
export class MaterialTypesController {
  constructor(
    private readonly materialTypeService: MaterialTypeService,
  ) {}

  @Post()
  public async Create(@Body() materialTypeCreateDto: MaterialTypeCreateDto) {
    return await this.materialTypeService.CreateMaterialType(materialTypeCreateDto);
  }

  @Get()
  public async List(): Promise<Array<MaterialTypeDto>> {
    const materialTypes = await this.materialTypeService.ListMaterialTypes();

    return materialTypes.map(MaterialTypeDto.FromDbo);
  }

  @Get('/:materialTypeId')
  public async Get(
    @Param('materialTypeId') materialTypeId: string,
  ): Promise<MaterialTypeDto> {
    const materialType = await this.materialTypeService.GetMaterialType(materialTypeId);

    return MaterialTypeDto.FromDbo(materialType);
  }
}
