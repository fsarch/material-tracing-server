import { Injectable } from '@nestjs/common';
import { PartTypeService } from '../../repositories/part-type/part-type.service.js';
import { BaseToolProvider } from '../core/base-tool-provider.js';
import { McpTool, McpToolProvider } from '../decorators/mcp-tool.decorator.js';

type ResourceStatus = 'all' | 'active' | 'archived';

@Injectable()
@McpToolProvider()
export class PartTypeToolProvider extends BaseToolProvider {
  constructor(private readonly partTypeService: PartTypeService) {
    super();
  }

  @McpTool({
    name: 'search_part_types',
    description: 'Search part types by name or external ID',
    inputSchema: {
      type: 'object',
      properties: {
        search: {
          type: 'string',
          description: 'Search term for part type name or external ID',
        },
        status: {
          type: 'string',
          description: 'Filter by status: all, active, or archived',
          enum: ['all', 'active', 'archived'],
        },
      },
    },
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

      return this.success(allPartTypes);
    }

    const partTypes = await this.partTypeService.ListPartTypes(
      status === 'archived',
      args.search,
    );

    return this.success(partTypes);
  }

  @McpTool({
    name: 'get_part_type',
    description: 'Get a single part type by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Part type ID',
        },
      },
      required: ['id'],
    },
  })
  async getPartType(args: { id: string }) {
    const partType = await this.partTypeService.GetPartType(args.id);

    if (!partType) {
      return this.error('Part type not found');
    }

    return this.success(partType);
  }
}
