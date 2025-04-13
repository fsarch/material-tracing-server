import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PartTypeCreateDto, PartTypeDto } from "../../models/part-type.model.js";
import { PartTypeService } from "../../repositories/part-type/part-type.service.js";

@ApiTags('part-types')
@Controller({
  path: 'part-types',
  version: '1',
})
@ApiBearerAuth()
export class PartTypesController {
  constructor(
    private readonly partTypeService: PartTypeService,
  ) {
  }

  @Post()
  public async Create(@Body() partTypeCreateDto: PartTypeCreateDto) {
    return await this.partTypeService.CreatePartType(partTypeCreateDto);
  }

  @Get()
  public async List(): Promise<Array<PartTypeDto>> {
    const partTypes = await this.partTypeService.ListPartTypes();

    return partTypes.map(PartTypeDto.FromDbo);
  }

  @Get('/:partTypeId')
  public async Get(
    @Param('partTypeId') partTypeId: string,
  ): Promise<PartTypeDto> {
    const partType = await this.partTypeService.GetPartType(partTypeId);

    return PartTypeDto.FromDbo(partType);
  }
}
