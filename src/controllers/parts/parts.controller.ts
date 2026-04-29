import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PartTypeService } from '../../repositories/part-type/part-type.service.js';
import { PartService } from '../../repositories/part/part.service.js';
import { PartShortCodeService } from '../../repositories/part-short-code/part-short-code.service.js';
import { ShortCodeService } from '../../repositories/short-code/short-code.service.js';
import {
  PartCreateDto,
  PartDto,
  PartPatchDto,
} from '../../models/part.model.js';
import { PaginationResultDto } from '../../fsarch/pagination/pagination-result.dto.js';
import { OnEvent } from '@nestjs/event-emitter';
import { EEvent } from '../../constants/event.enum.js';

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
    private readonly partShortCodeService: PartShortCodeService,
    private readonly shortCodeService: ShortCodeService,
  ) {}

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
    description:
      'Filter parts by name (case-insensitive, partial matching). Note: search parameter takes precedence if both are provided.',
  })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
    description: 'Search by name (case-insensitive), externalId, or partTypeId',
  })
  @ApiQuery({
    name: 'isArchived',
    type: Boolean,
    required: false,
    description: 'Filter by archived status (default: false)',
  })
  @ApiQuery({
    name: 'partTypeId',
    type: String,
    required: false,
    description: 'Filter parts by partTypeId (UUID). If provided, only parts with this partTypeId are returned.',
  })
  @ApiQuery({
    name: 'embed',
    isArray: true,
    type: String,
    required: false,
    description: "Embed related resources. Supported values: 'availableAmount', 'shortCodes'",
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginationResultDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(PartDto) },
            },
          },
        },
      ],
    },
  })
  public async List(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('name') name?: string,
    @Query('search') search?: string,
    @Query('isArchived') isArchived?: boolean,
    @Query('partTypeId') partTypeId?: string,
    @Query('embed') embed: Array<string> = [],
  ): Promise<PaginationResultDto<PartDto>> {
    // Set default take value to 25 if not provided
    const takeValue = take ?? 25;

    // Get total matching parts (without pagination)
    const allParts = await this.partService.ListParts({
      isArchived: isArchived ?? false,
      name,
      search,
      partTypeId,
    });

    const totalItems = allParts.length;

    // Get paged parts
    const parts = await this.partService.ListParts({
      skip,
      take: takeValue,
      name,
      search,
      isArchived: isArchived ?? false,
      partTypeId,
    });

    const data = parts.map(PartDto.FromDbo);

    const start = skip ?? 0;
    const metadata = {
      currentPage: Math.floor(start / takeValue) + 1,
      pageSize: takeValue,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / takeValue)),
    };

    // If client requested embedding of shortCodes, fetch and attach them
    if (embed.includes('shortCodes')) {
      // For performance, do operations in parallel per part
      await Promise.all(
        data.map(async (dto) => {
          const partShortCodes = await this.partShortCodeService.ListByPartId(
            dto.id,
          );

          if (!partShortCodes || partShortCodes.length === 0) {
            dto.shortCodes = [];
            return;
          }

          const shortCodePromises = partShortCodes.map((psc) =>
            this.shortCodeService.GetShortCode(psc.shortCodeId),
          );

          const shortCodes = (await Promise.all(shortCodePromises)).filter(
            (s) => s !== null,
          );

          // Convert to DTOs using ShortCodeDto
          dto.shortCodes = shortCodes.map((s) =>
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            require('../../models/short-code.model.js').ShortCodeDto.FromDbo(s),
          );
        }),
      );
    }

    return {
      data,
      metadata,
    };
  }

  @Get('/:partId')
  @ApiQuery({
    name: 'embed',
    isArray: true,
    type: String,
    required: false,
  })
  public async Get(
    @Param('partId') partId: string,
    @Query('embed') embed: Array<string> = [],
  ) {
    const part = await this.partService.GetById(partId);
    if (!part) {
      throw new NotFoundException();
    }

    const dto = PartDto.FromDbo(part);

    if (embed.includes('availableAmount')) {
      dto.availableAmount = await this.partService.GetAvailableAmount(partId);
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
      name:
        partCreateDto.name ||
        `${partType.name} (${new Intl.DateTimeFormat('de', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Berlin' }).format(new Date())})`,
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
  public async Delete(@Param('partId') partId: string) {
    const part = await this.partService.GetById(partId);

    if (!part) {
      throw new NotFoundException();
    }

    return await this.partService.DeletePart(partId);
  }

  @OnEvent(EEvent.DELETE_PART_TYPE)
  public async DeletePartsByPartType(payload: {
    id: string;
    datetime: string;
  }) {
    const parts = await this.partService.ListPartsByPartType(payload.id);
    for (let part of parts) {
      await this.partService.DeletePart(part.id);
    }
  }
}
