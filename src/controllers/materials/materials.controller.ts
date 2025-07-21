import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { MaterialService } from "../../repositories/material/material.service.js";
import { MaterialCreateDto, MaterialDto, MaterialUpdateDto } from "../../models/material.model.js";
import { MaterialTypeService } from "../../repositories/material-type/material-type.service.js";
import { OnEvent } from "@nestjs/event-emitter";
import { EEvent } from "../../constants/event.enum.js";

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

  @Delete('/:materialId')
  public async Delete(@Param('materialId') materialId: string) {
    await this.materialService.DeleteById(materialId);
  }

  @Post('/:materialId/_actions/checkout')
  public async Checkout(@Param('materialId') materialId: string) {
    await this.materialService.CheckoutMaterial(materialId);
  }

  @Patch('/:materialId')
  public async Update(@Param('materialId') materialId: string, @Body() updateDto: MaterialUpdateDto) {
    await this.materialService.UpdateMaterial(materialId, updateDto);
  }

  @OnEvent(EEvent.DELETE_MATERIAL_TYPE)
  public async DeleteByManufacturer(payload: { id: string, deletionTime: string }) {
    const materials = await this.materialService.ListByMaterialType(payload.id);

    for (let material of materials) {
      await this.materialService.DeleteById(material.id, payload.deletionTime);
    }
  }
}
