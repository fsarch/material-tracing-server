import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PartTypeCreateDto, PartTypeDto, PartTypePatchDto } from "../../models/part-type.model.js";
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
    if (!partType) {
      throw new NotFoundException();
    }

    return PartTypeDto.FromDbo(partType);
  }

  @Patch('/:partTypeId')
  public async Update(
    @Param('partTypeId') partTypeId: string,
    @Body() partTypePatchDto: PartTypePatchDto,
  ) {
    const part = await this.partTypeService.GetPartType(partTypeId);

    if (!part) {
      throw new NotFoundException();
    }

    return await this.partTypeService.UpdatePartType(partTypeId, partTypePatchDto);
  }

  @Delete('/:partTypeId')
  public async Delete(
    @Param('partTypeId') partTypeId: string,
  ): Promise<void> {
    await this.partTypeService.Delete(partTypeId);
  }
}
