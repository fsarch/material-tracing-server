import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ShortCodeType } from "../../../constants/short-code-type.enum.js";
import { ShortCodeService } from "../../../repositories/short-code/short-code.service.js";
import { PartShortCodeService } from "../../../repositories/part-short-code/part-short-code.service.js";
import { PartService } from "../../../repositories/part/part.service.js";
import { PartDto } from "../../../models/part.model.js";

@ApiTags('parts')
@Controller({
  path: 'short-codes/:shortCode/parts',
  version: '1',
})
@ApiBearerAuth()
export class PartsController {
  constructor(
    private readonly shortCodeService: ShortCodeService,
    private readonly partShortCodeService: PartShortCodeService,
    private readonly partService: PartService,
  ) {
  }

  @Get()
  public async Get(
    @Param('shortCode') code: string,
  ) {
    const shortCode = await this.shortCodeService.GetShortCodeByCode(code);
    if (shortCode.shortCodeTypeId !== ShortCodeType.PART) {
      throw new NotFoundException();
    }

    const partShortCodes = await this.partShortCodeService.ListByShortCodeId(shortCode.id);
    if (!partShortCodes.length) {
      throw new NotFoundException();
    }

    const parts = await Promise.all(partShortCodes.map(async (partShortCode) => {
      try {
        const material = await this.partService.GetById(partShortCode.partId);

        return material;
      } catch (err) {
        return null;
      }
    }));

    return parts.filter(m => m).map(PartDto.FromDbo);
  }
}
