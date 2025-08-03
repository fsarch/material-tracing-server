import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiProperty, ApiQuery, ApiTags } from "@nestjs/swagger";
import { PartTypeService } from "../../repositories/part-type/part-type.service.js";
import { PartService } from "../../repositories/part/part.service.js";
import { PartCreateDto, PartDto, PartPatchDto } from "../../models/part.model.js";
import { OnEvent } from "@nestjs/event-emitter";
import { EEvent } from "../../constants/event.enum.js";

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
  @ApiQuery({
    name: 'skip',
    type: Number,
    required: false,
    description: 'Number of items to skip',
  })
  @ApiQuery({
    name: 'take',
    type: Number,
    required: false,
    description: 'Number of items to take (default: 25)',
  })
  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
    description: 'Filter parts by name (case-insensitive, partial matching)',
  })
  public async List(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('name') name?: string,
  ) {
    // Set default take value to 25 if not provided
    const takeValue = take ?? 25;

    const parts = await this.partService.ListParts({
      skip,
      take: takeValue,
      name,
    });

    return parts.map(PartDto.FromDbo);
  }

  @Get('/:partId')
  @ApiQuery({
    name: 'include',
    isArray: true,
    type: String,
    required: false,
  })
  public async Get(
    @Param('partId') partId: string,
    @Query('include') include: Array<string> = [],
  ) {
    const part = await this.partService.GetById(partId);
    if (!part) {
      throw new NotFoundException();
    }

    const dto = PartDto.FromDbo(part);

    if (include.includes('availableAmount')) {
      const availableAmount = await this.partService.GetAvailableAmount(partId);
      dto.availableAmount = availableAmount;
    }

    return dto;
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

  @Patch('/:partId')
  public async Update(
    @Param('partId') partId: string,
    @Body() partPatchDto: PartPatchDto,
  ) {
    const part = await this.partService.GetById(partId);

    if (!part) {
      throw new NotFoundException();
    }

    return await this.partService.UpdatePart(partId, partPatchDto);
  }

  @Delete('/:partId')
  public async Delete(
    @Param('partId') partId: string,
  ) {
    const part = await this.partService.GetById(partId);

    if (!part) {
      throw new NotFoundException();
    }

    return await this.partService.DeletePart(partId);
  }

  @OnEvent(EEvent.DELETE_PART_TYPE)
  public async DeletePartsByPartType(payload: { id: string, datetime: string }) {
    const parts = await this.partService.ListPartsByPartType(payload.id);
    for (let part of parts) {
      await this.partService.DeletePart(part.id);
    }
  }
}
