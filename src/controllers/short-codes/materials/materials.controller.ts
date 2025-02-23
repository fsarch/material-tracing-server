import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ShortCodeService } from "../../../repositories/short-code/short-code.service.js";
import { MaterialShortCodeService } from "../../../repositories/material-short-code/material-short-code.service.js";
import { MaterialService } from "../../../repositories/material/material.service.js";
import { ShortCodeType } from "../../../constants/short-code-type.enum.js";
import { MaterialDto } from "../../../models/material.model.js";

@ApiTags('short-code')
@Controller({
  path: 'short-codes/:shortCode/materials',
  version: '1',
})
@ApiBearerAuth()
export class MaterialsController {
  constructor(
    private readonly shortCodeService: ShortCodeService,
    private readonly materialShortCodeService: MaterialShortCodeService,
    private readonly materialService: MaterialService,
  ) {
  }

  @Get()
  public async Get(
    @Param('shortCode') code: string,
  ) {
    const shortCode = await this.shortCodeService.GetShortCodeByCode(code);
    if (shortCode.shortCodeTypeId !== ShortCodeType.MATERIAL) {
      throw new NotFoundException();
    }

    const materialShortCodes = await this.materialShortCodeService.ListByShortCodeId(shortCode.id);
    if (!materialShortCodes.length) {
      throw new NotFoundException();
    }

    const materials = await Promise.all(materialShortCodes.map(async (materialShortCode) => {
       try {
         const material = await this.materialService.GetById(materialShortCode.materialId);

         return material;
       } catch (err) {
         return null;
       }
    }));

    return materials.filter(m => m).map(MaterialDto.FromDbo);
  }
}
