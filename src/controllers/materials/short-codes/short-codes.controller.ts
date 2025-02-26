import { ConflictException, Controller, Get, NotFoundException, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ShortCodeService } from "../../../repositories/short-code/short-code.service.js";
import { ShortCodeType } from "../../../constants/short-code-type.enum.js";
import { MaterialShortCodeService } from "../../../repositories/material-short-code/material-short-code.service.js";

@ApiTags('short-code')
@Controller({
  path: 'materials/:materialId/short-codes',
  version: '1',
})
@ApiBearerAuth()
export class ShortCodesController {
  constructor(
    private readonly shortCodeService: ShortCodeService,
    private readonly materialShortCodeService: MaterialShortCodeService,
  ) {
  }

  @Get()
  public async ListShortCodes(
    @Param('materialId') materialId: string,
  ) {
    const materialShortCodes = await this.materialShortCodeService.ListByMaterialId(materialId);
    if (!materialShortCodes.length) {
      return [];
    }

    return Promise.all(materialShortCodes.map(async (materialShortCode) => {
      const shortCode = await this.shortCodeService.GetShortCodeByCode(materialShortCode.shortCodeId);

      return shortCode;
    }));
  }

  @Put('/:shortCode')
  public async MapMaterialShortCode(
    @Param('materialId') materialId: string,
    @Param('shortCode') code: string,
  ) {
    const materialShortCodes = await this.materialShortCodeService.ListByMaterialId(materialId);
    if (materialShortCodes.length) {
      throw new ConflictException();
    }

    const shortCode = await this.shortCodeService.GetShortCodeByCode(code);
    if (!shortCode) {
      throw new NotFoundException();
    }

    await this.shortCodeService.UpdateShortCode(shortCode.id, {
      shortCodeTypeId: ShortCodeType.MATERIAL,
    });

    await this.materialShortCodeService.Create(materialId, shortCode.id);
  }
}
