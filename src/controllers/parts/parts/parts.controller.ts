import { Body, Controller, Delete, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PartService } from "../../../repositories/part/part.service.js";
import { PartPartCreateDto } from "../../../models/part-part.model.js";
import { PartPartService } from "../../../repositories/part-part/part-part.service.js";
import { OnEvent } from "@nestjs/event-emitter";
import { EEvent } from "../../../constants/event.enum.js";

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

  @Delete('/:childPartId')
  public async Delete(
    @Param('partId') partId: string,
    @Param('childPartId') childPartId: string,
  ) {
    const childPart = await this.partPartService.GetById(partId, childPartId);

    if (!childPart) {
      throw new NotFoundException();
    }

    return await this.partPartService.DeleteById(childPart.id);
  }

  @OnEvent(EEvent.DELETE_PART)
  public async DeletePartsByPart(payload: { id: string, deletionTime: string }) {
    const parts = await this.partPartService.List(payload.id);
    for (let part of parts) {
      await this.partPartService.DeleteByPartId(part.id, payload.deletionTime);
    }
  }
}
