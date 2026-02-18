import { Injectable } from '@nestjs/common';
import { MaterialTypeService } from '../../repositories/material-type/material-type.service.js';
import { BaseToolProvider } from '../core/base-tool-provider.js';
import { McpTool, McpToolProvider } from '../decorators/mcp-tool.decorator.js';

type ResourceStatus = 'all' | 'active' | 'archived';

@Injectable()
@McpToolProvider()
export class MaterialTypeToolProvider extends BaseToolProvider {
  constructor(private readonly materialTypeService: MaterialTypeService) {
    super();
  }

  @McpTool({
    name: 'search_material_types',
    description: 'Search material types by name or external ID',
    inputSchema: {
      type: 'object',
      properties: {
        search: {
          type: 'string',
          description: 'Search term for material type name or external ID',
        },
        status: {
          type: 'string',
          description: 'Filter by status: all, active, or archived',
          enum: ['all', 'active', 'archived'],
        },
      },
    },
  })
  async searchMaterialTypes(args: {
    search?: string;
    status?: ResourceStatus;
  }) {
    const status = args.status || 'active';

    if (status === 'all') {
      // Get both archived and non-archived material types
      const [activeMaterialTypes, archivedMaterialTypes] = await Promise.all([
        this.materialTypeService.ListMaterialTypes(false, args.search),
        this.materialTypeService.ListMaterialTypes(true, args.search),
      ]);

      const allMaterialTypes = [
        ...activeMaterialTypes,
        ...archivedMaterialTypes,
      ];

      return this.success(allMaterialTypes);
    }

    const materialTypes = await this.materialTypeService.ListMaterialTypes(
      status === 'archived',
      args.search,
    );

    return this.success(materialTypes);
  }

  @McpTool({
    name: 'get_material_type',
    description: 'Get a single material type by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Material type ID',
        },
      },
      required: ['id'],
    },
  })
  async getMaterialType(args: { id: string }) {
    const materialType = await this.materialTypeService.GetMaterialType(
      args.id,
    );

    if (!materialType) {
      return this.error('Material type not found');
    }

    return this.success(materialType);
  }
}
