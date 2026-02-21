import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { PartService } from '../../repositories/part/part.service.js';

type ResourceStatus = 'all' | 'active' | 'archived' | 'checked-out';

@Injectable()
export class PartToolProvider {
  constructor(private readonly partService: PartService) {}

  @Tool({
    name: 'search_parts',
    description: 'Search parts by name or external ID',
    parameters: z.object({
      search: z
        .string()
        .optional()
        .describe('Search term for part name or external ID'),
      status: z
        .enum(['all', 'active', 'archived', 'checked-out'])
        .optional()
        .describe('Filter by status: all, active, archived, or checked-out'),
    }),
  })
  async searchParts(args: { search?: string; status?: ResourceStatus }) {
    const status = args.status || 'active';

    if (status === 'checked-out') {
      // Get all parts and filter by checkout status
      const allParts = await this.partService.ListParts({
        isArchived: false,
        search: args.search,
      });
      const checkedOutParts = allParts.filter((p) => p.checkoutTime !== null);

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(checkedOutParts, null, 2),
          },
        ],
      };
    }

    if (status === 'all') {
      // Get both archived and non-archived parts
      const [activeParts, archivedParts] = await Promise.all([
        this.partService.ListParts({ isArchived: false, search: args.search }),
        this.partService.ListParts({ isArchived: true, search: args.search }),
      ]);

      const allParts = [...activeParts, ...archivedParts];

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(allParts, null, 2),
          },
        ],
      };
    }

    const parts = await this.partService.ListParts({
      isArchived: status === 'archived',
      search: args.search,
    });

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(parts, null, 2),
        },
      ],
    };
  }

  @Tool({
    name: 'get_part',
    description: 'Get a single part by ID',
    parameters: z.object({
      id: z.string().describe('Part ID'),
    }),
  })
  async getPart(args: { id: string }) {
    const part = await this.partService.GetById(args.id);

    if (!part) {
      return {
        content: [
          {
            type: 'text' as const,
            text: 'Part not found',
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(part, null, 2),
        },
      ],
    };
  }
}
