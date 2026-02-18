import { Injectable } from '@nestjs/common';
import { PartService } from '../../repositories/part/part.service.js';
import { BaseToolProvider } from '../core/base-tool-provider.js';
import { McpTool, McpToolProvider } from '../decorators/mcp-tool.decorator.js';

type ResourceStatus = 'all' | 'active' | 'archived' | 'checked-out';

@Injectable()
@McpToolProvider()
export class PartToolProvider extends BaseToolProvider {
  constructor(private readonly partService: PartService) {
    super();
  }

  @McpTool({
    name: 'search_parts',
    description: 'Search parts by name or external ID',
    inputSchema: {
      type: 'object',
      properties: {
        search: {
          type: 'string',
          description: 'Search term for part name or external ID',
        },
        status: {
          type: 'string',
          description:
            'Filter by status: all, active, archived, or checked-out',
          enum: ['all', 'active', 'archived', 'checked-out'],
        },
      },
    },
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

      return this.success(checkedOutParts);
    }

    if (status === 'all') {
      // Get both archived and non-archived parts
      const [activeParts, archivedParts] = await Promise.all([
        this.partService.ListParts({ isArchived: false, search: args.search }),
        this.partService.ListParts({ isArchived: true, search: args.search }),
      ]);

      const allParts = [...activeParts, ...archivedParts];

      return this.success(allParts);
    }

    const parts = await this.partService.ListParts({
      isArchived: status === 'archived',
      search: args.search,
    });

    return this.success(parts);
  }

  @McpTool({
    name: 'get_part',
    description: 'Get a single part by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Part ID',
        },
      },
      required: ['id'],
    },
  })
  async getPart(args: { id: string }) {
    const part = await this.partService.GetById(args.id);

    if (!part) {
      return this.error('Part not found');
    }

    return this.success(part);
  }
}
