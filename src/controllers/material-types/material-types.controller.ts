import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { MaterialTypeCreateDto, MaterialTypeDto } from "../../models/material-type.model.js";
import { MaterialTypeService } from "../../repositories/material-type/material-type.service.js";
import { OnEvent } from "@nestjs/event-emitter";
import { EEvent } from "../../constants/event.enum.js";

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

  @Delete('/:materialTypeId')
  public async Delete(
    @Param('materialTypeId') materialTypeId: string,
  ): Promise<void> {
    await this.materialTypeService.DeleteById(materialTypeId);
  }

  @OnEvent(EEvent.DELETE_MANUFACTURER)
  public async DeleteByManufacturer(payload: { id: string, deletionTime: string }) {
    const materialTypes = await this.materialTypeService.ListByManufacturer(payload.id);

    for (let materialType of materialTypes) {
      await this.materialTypeService.DeleteById(materialType.id, payload.deletionTime);
    }
  }
}
