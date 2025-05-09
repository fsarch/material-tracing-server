import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PartService } from "../../../repositories/part/part.service.js";
import { PartPartCreateDto } from "../../../models/part-part.model.js";
import { PartPartService } from "../../../repositories/part-part/part-part.service.js";

@ApiTags('parts')
@Controller({
  path: 'parts/:partId/parts',
  version: '1',
})
@ApiBearerAuth()
export class PartsController {
  constructor(
    private readonly partService: PartService,
    private readonly partPartService: PartPartService,
  ) {
  }

  @Post('/:childPartId')
  public async SetPartAmount(
    @Param('partId') partId: string,
    @Param('childPartId') childPartId: string,
    @Body() body: PartPartCreateDto,
  ) {
    const part = await this.partService.GetById(partId);
    if (!part) {
      throw new NotFoundException();
    }

    const childPart = await this.partService.GetById(childPartId);
    if (!childPart) {
      throw new NotFoundException();
    }

    await this.partPartService.GetOrAdd(partId, childPart.id, body.amount);

    return {};
  }

  @Get()
  public async GetParts(
    @Param('partId') partId: string,
  ) {
    const parts = await this.partPartService.List(partId);

    return parts;
  }
}
