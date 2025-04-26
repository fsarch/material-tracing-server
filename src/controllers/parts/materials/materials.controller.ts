import { ConflictException, Controller, Get, NotFoundException, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PartService } from "../../../repositories/part/part.service.js";
import { MaterialService } from "../../../repositories/material/material.service.js";
import { PartMaterialService } from "../../../repositories/part-material/part-material.service.js";

@ApiTags('parts')
@Controller({
  path: 'parts/:partId/materials',
  version: '1',
})
@ApiBearerAuth()
export class MaterialsController {
  constructor(
    private readonly partService: PartService,
    private readonly materialService: MaterialService,
    private readonly partMaterialService: PartMaterialService,
  ) {
  }

  @Put('/:materialId')
  public async SetMaterialToPart(
    @Param('partId') partId: string,
    @Param('materialId') materialId: string,
  ) {
    const part = await this.partService.GetById(partId);
    if (!part) {
      throw new ConflictException();
    }

    const material = await this.materialService.GetById(materialId);
    if (!material) {
      throw new NotFoundException();
    }

    await this.partMaterialService.CreateOrGet(partId, material.id);

    return {};
  }

  @Get()
  public async ListByPart(
    @Param('partId') partId: string,
  ) {
    return await this.partMaterialService.ListByPart(partId);
  }
}
