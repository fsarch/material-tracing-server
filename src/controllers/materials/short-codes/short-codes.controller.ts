import { ConflictException, Controller, Delete, Get, NotFoundException, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ShortCodeService } from "../../../repositories/short-code/short-code.service.js";
import { ShortCodeType } from "../../../constants/short-code-type.enum.js";
import { MaterialShortCodeService } from "../../../repositories/material-short-code/material-short-code.service.js";
import { OnEvent } from "@nestjs/event-emitter";
import { EEvent } from "../../../constants/event.enum.js";

@ApiTags('short-code')
@Controller({
  path: 'materials/:materialId/short-codes',
  version: '1',
})
@ApiBearerAuth()
export class MaterialShortCodesController {
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
      const shortCode = await this.shortCodeService.GetShortCode(materialShortCode.shortCodeId);

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

    return {};
  }

  @Delete('/:shortCode')
  public async DeleteMaterialShortCode(
    @Param('materialId') materialId: string,
    @Param('shortCode') code: string,
  ) {
    const shortCode = await this.shortCodeService.GetShortCodeByCode(code);
    if (!shortCode) {
      throw new NotFoundException();
    }

    const materialShortCodes = await this.materialShortCodeService.ListByMaterialId(materialId);
    const foundShortCode = materialShortCodes.find(msc => msc.shortCodeId === shortCode.id && msc.materialId === materialId)
    if (!foundShortCode) {
      throw new ConflictException();
    }

    await this.materialShortCodeService.DeleteById(foundShortCode.id);
    await this.shortCodeService.UpdateShortCode(shortCode.id, {
      shortCodeTypeId: null,
    });

    return {};
  }

  @OnEvent(EEvent.DELETE_MATERIAL)
  @OnEvent(EEvent.CHECKOUT_MATERIAL)
  public async DeleteByMaterial(payload: { id: string }) {
    const materialShortCodes = await this.materialShortCodeService.ListByMaterialId(payload.id);

    for (let materialShortCode of materialShortCodes) {
      const shortCode = await this.shortCodeService.GetShortCode(materialShortCode.shortCodeId);

      await this.DeleteMaterialShortCode(payload.id, shortCode.code);
    }
  }
}
