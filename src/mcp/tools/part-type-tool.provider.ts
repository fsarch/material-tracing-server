import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { PartTypeService } from '../../repositories/part-type/part-type.service.js';

type ResourceStatus = 'all' | 'active' | 'archived';

@Injectable()
export class PartTypeToolProvider {
  constructor(private readonly partTypeService: PartTypeService) {}

  @Tool({
    name: 'search_part_types',
    description: 'Search part types by name or external ID',
    parameters: z.object({
      search: z
        .string()
        .optional()
        .describe('Search term for part type name or external ID'),
      status: z
        .enum(['all', 'active', 'archived'])
        .optional()
        .describe('Filter by status: all, active, or archived'),
    }),
  })
  async searchPartTypes(args: { search?: string; status?: ResourceStatus }) {
    const status = args.status || 'active';

    if (status === 'all') {
      // Get both archived and non-archived part types
      const [activePartTypes, archivedPartTypes] = await Promise.all([
        this.partTypeService.ListPartTypes(false, args.search),
        this.partTypeService.ListPartTypes(true, args.search),
      ]);

      const allPartTypes = [...activePartTypes, ...archivedPartTypes];

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(allPartTypes, null, 2),
          },
        ],
      };
    }

    const partTypes = await this.partTypeService.ListPartTypes(
      status === 'archived',
      args.search,
    );

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(partTypes, null, 2),
        },
      ],
    };
  }

  @Tool({
    name: 'get_part_type',
    description: 'Get a single part type by ID',
    parameters: z.object({
      id: z.string().describe('Part type ID'),
    }),
  })
  async getPartType(args: { id: string }) {
    const partType = await this.partTypeService.GetPartType(args.id);

    if (!partType) {
      return {
        content: [
          {
            type: 'text' as const,
            text: 'Part type not found',
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(partType, null, 2),
        },
      ],
    };
  }
}
