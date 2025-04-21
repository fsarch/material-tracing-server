import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PartTypeService } from "../../repositories/part-type/part-type.service.js";
import { PartService } from "../../repositories/part/part.service.js";
import { PartCreateDto, PartDto } from "../../models/part.model.js";

@ApiTags('parts')
@Controller({
  path: 'parts',
  version: '1',
})
@ApiBearerAuth()
export class PartsController {
  constructor(
    private readonly partTypeService: PartTypeService,
    private readonly partService: PartService,
  ) {
  }

  @Get()
  public async List() {
    const parts = await this.partService.ListParts();

    return parts.map(PartDto.FromDbo);
  }

  @Get('/:partId')
  public async Get(@Param('partId') partId: string) {
    const part = await this.partService.GetById(partId);
    if (!part) {
      throw new NotFoundException();
    }

    return PartDto.FromDbo(part);
  }

  @Post()
  public async Create(@Body() partCreateDto: PartCreateDto) {
    const partType = await this.partTypeService.GetPartType(
      partCreateDto.partTypeId,
    );

    if (!partType) {
      throw new NotFoundException();
    }

    return await this.partService.CreatePart({
      ...partCreateDto,
      name: partCreateDto.name
        || `${partType.name} (${new Intl.DateTimeFormat('de', { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Berlin", }).format(new Date())})`,
    });
  }
}
