import {
  Body,
  Controller,
  Delete,
  Get,
  BadRequestException,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PartService } from '../../../repositories/part/part.service.js';
import {
  PartPartCreateDto,
  PartPartDto,
  PartPartLinkDto,
  PartPartPatchDto,
} from '../../../models/part-part.model.js';
import { PartPartService } from '../../../repositories/part-part/part-part.service.js';
import { OnEvent } from '@nestjs/event-emitter';
import { EEvent } from '../../../constants/event.enum.js';

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
  ) {}

  @Post('/:childPartId')
  @ApiParam({ name: 'partId', type: String })
  @ApiParam({ name: 'childPartId', type: String })
  @ApiBody({ type: PartPartCreateDto })
  @ApiCreatedResponse({ type: PartPartLinkDto })
  @ApiNotFoundResponse({ description: 'Parent part or child part not found' })
  public async SetPartAmount(
    @Param('partId') partId: string,
    @Param('childPartId') childPartId: string,
    @Body() body: PartPartCreateDto,
  ): Promise<PartPartLinkDto> {
    const part = await this.partService.GetById(partId);
    if (!part) {
      throw new NotFoundException();
    }

    const childPart = await this.partService.GetById(childPartId);
    if (!childPart) {
      throw new NotFoundException();
    }

    return await this.partPartService.GetOrAdd(partId, childPart.id, body.amount);
  }

  @Patch('/:childPartId')
  @ApiParam({ name: 'partId', type: String })
  @ApiParam({ name: 'childPartId', type: String })
  @ApiBody({ type: PartPartPatchDto })
  @ApiOkResponse({ type: PartPartLinkDto })
  @ApiNotFoundResponse({ description: 'Parent part or child part not found' })
  public async UpdatePartAmount(
    @Param('partId') partId: string,
    @Param('childPartId') childPartId: string,
    @Body() body: PartPartPatchDto,
  ): Promise<PartPartLinkDto> {
    if (body.amount <= 0) {
      throw new BadRequestException('Part amount must be greater than 0');
    }

    const part = await this.partService.GetById(partId);
    if (!part) {
      throw new NotFoundException();
    }

    const childPart = await this.partPartService.GetById(partId, childPartId);
    if (!childPart) {
      throw new NotFoundException();
    }

    const updatedPartChild = await this.partPartService.SetAmount(
      partId,
      childPartId,
      body.amount,
    );

    if (!updatedPartChild) {
      throw new NotFoundException();
    }

    return updatedPartChild;
  }

  @Get()
  @ApiParam({ name: 'partId', type: String })
  @ApiOkResponse({ type: PartPartDto, isArray: true })
  public async GetParts(@Param('partId') partId: string): Promise<Array<PartPartDto>> {
    return await this.partPartService.List(partId);
  }

  @Delete('/:childPartId')
  @ApiParam({ name: 'partId', type: String })
  @ApiParam({ name: 'childPartId', type: String })
  @ApiNoContentResponse({ description: 'Child part link deleted' })
  @ApiNotFoundResponse({ description: 'Child part link not found' })
  public async Delete(
    @Param('partId') partId: string,
    @Param('childPartId') childPartId: string,
  ): Promise<void> {
    const childPart = await this.partPartService.GetById(partId, childPartId);

    if (!childPart) {
      throw new NotFoundException();
    }

    await this.partPartService.DeleteById(childPart.id);
  }

  @OnEvent(EEvent.DELETE_PART)
  public async DeletePartsByPart(payload: {
    id: string;
    deletionTime: string;
  }) {
    await this.partPartService.DeleteByPartId(payload.id, payload.deletionTime);
  }
}
