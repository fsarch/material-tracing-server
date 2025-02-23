import { Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ShortCodeService } from "../../repositories/short-code/short-code.service.js";
import { ShortCodeDto } from "../../models/short-code.model.js";

@ApiTags('short-code')
@Controller({
  path: 'short-codes',
  version: '1',
})
@ApiBearerAuth()
export class ShortCodesController {
  constructor(
    private readonly shortCodeService: ShortCodeService,
  ) {
  }

  @Post()
  public async CreateShortCode() {
    return this.shortCodeService.CreateShortCode();
  }

  @Get()
  public async ListShortCodes() {
    const shortCodes = await this.shortCodeService.ListShortCodes();

    return shortCodes.map(ShortCodeDto.FromDbo);
  }

  @Get(':code')
  public async GetShortCode(@Param('code') code: string) {
    const shortCode = await this.shortCodeService.GetShortCodeByCode(code);
    if (!shortCode) {
      throw new NotFoundException();
    }

    return ShortCodeDto.FromDbo(shortCode);
  }
}
