import { ConflictException, Controller, Delete, Get, NotFoundException, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ShortCodeService } from "../../../repositories/short-code/short-code.service.js";
import { ShortCodeType } from "../../../constants/short-code-type.enum.js";
import { PartShortCodeService } from "../../../repositories/part-short-code/part-short-code.service.js";
import { ApiError } from "../../../models/error.model.js";

@ApiTags('short-code')
@Controller({
  path: 'parts/:partId/short-codes',
  version: '1',
})
@ApiBearerAuth()
export class PartShortCodesController {
  constructor(
    private readonly shortCodeService: ShortCodeService,
    private readonly partShortCodeService: PartShortCodeService,
  ) {
  }

  @Get()
  public async ListShortCodes(
    @Param('partId') partId: string,
  ) {
    const materialShortCodes = await this.partShortCodeService.ListByPartId(partId);
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
    @Param('partId') partId: string,
    @Param('shortCode') code: string,
  ) {
    const materialShortCodes = await this.partShortCodeService.ListByPartId(partId);
    if (materialShortCodes.length) {
      throw new ConflictException();
    }

    const shortCode = await this.shortCodeService.GetShortCodeByCode(code);
    if (!shortCode) {
      throw new NotFoundException();
    }

    // Check if the short code is already connected to another resource
    const existingConnection = await this.shortCodeService.CheckShortCodeConnection(shortCode.id);
    if (existingConnection) {
      const error = ApiError.alreadyConnected(existingConnection.type, existingConnection.id);
      throw new ConflictException(error.toResponse());
    }

    await this.shortCodeService.UpdateShortCode(shortCode.id, {
      shortCodeTypeId: ShortCodeType.PART,
    });

    await this.partShortCodeService.Create(partId, shortCode.id);

    return {};
  }

  @Delete('/:shortCode')
  public async DeleteMaterialShortCode(
    @Param('partId') partId: string,
    @Param('shortCode') code: string,
  ) {
    const shortCode = await this.shortCodeService.GetShortCodeByCode(code);
    if (!shortCode) {
      throw new NotFoundException();
    }

    const materialShortCodes = await this.partShortCodeService.ListByPartId(partId);
    const foundShortCode = materialShortCodes.find(msc => msc.shortCodeId === shortCode.id && msc.partId === partId)
    if (!foundShortCode) {
      throw new ConflictException();
    }

    await this.partShortCodeService.DeleteById(foundShortCode.id);

    return {};
  }
}
