import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { MaterialService } from "../../repositories/material/material.service.js";
import { MaterialCreateDto, MaterialDto } from "../../models/material.model.js";
import { MaterialTypeService } from "../../repositories/material-type/material-type.service.js";

@ApiTags('material')
@Controller({
  path: 'materials',
  version: '1',
})
@ApiBearerAuth()
export class MaterialsController {
  constructor(
    private readonly materialService: MaterialService,
    private readonly materialTypeService: MaterialTypeService,
  ) {}

  @Get()
  public async List() {
    const materials = await this.materialService.ListMaterials();

    return materials.map(MaterialDto.FromDbo);
  }

  @Get('/:materialId')
  public async Get(@Param('materialId') materialId: string) {
    const material = await this.materialService.GetById(materialId);

    return MaterialDto.FromDbo(material);
  }

  @Post()
  public async Create(@Body() materialCreateDto: MaterialCreateDto) {
    const materialType = await this.materialTypeService.GetMaterialType(
      materialCreateDto.materialTypeId,
    );

    if (!materialType) {
      throw new NotFoundException();
    }

    return await this.materialService.CreateMaterial({
      ...materialCreateDto,
      name: materialCreateDto.name
        || `${materialType.name} (${new Intl.DateTimeFormat('de', { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Berlin", }).format(new Date())})`,
    });
  }
}
