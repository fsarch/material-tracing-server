import { Injectable } from '@nestjs/common';
import { MaterialService } from '../../repositories/material/material.service.js';
import { BaseToolProvider } from '../core/base-tool-provider.js';
import { McpTool, McpToolProvider } from '../decorators/mcp-tool.decorator.js';

type ResourceStatus = 'all' | 'active' | 'archived' | 'checked-out';

@Injectable()
@McpToolProvider()
export class MaterialToolProvider extends BaseToolProvider {
  constructor(private readonly materialService: MaterialService) {
    super();
  }

  @McpTool({
    name: 'search_materials',
    description: 'Search materials by name or external ID',
    inputSchema: {
      type: 'object',
      properties: {
        search: {
          type: 'string',
          description: 'Search term for material name or external ID',
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
  async searchMaterials(args: { search?: string; status?: ResourceStatus }) {
    const status = args.status || 'active';

    if (status === 'checked-out') {
      // Get all materials and filter by checkout status
      const allMaterials = await this.materialService.ListMaterials(
        false,
        args.search,
      );
      const checkedOutMaterials = allMaterials.filter(
        (m) => m.checkoutTime !== null,
      );

      return this.success(checkedOutMaterials);
    }

    if (status === 'all') {
      // Get both archived and non-archived materials
      const [activeMaterials, archivedMaterials] = await Promise.all([
        this.materialService.ListMaterials(false, args.search),
        this.materialService.ListMaterials(true, args.search),
      ]);

      const allMaterials = [...activeMaterials, ...archivedMaterials];

      return this.success(allMaterials);
    }

    const materials = await this.materialService.ListMaterials(
      status === 'archived',
      args.search,
    );

    return this.success(materials);
  }

  @McpTool({
    name: 'get_material',
    description: 'Get a single material by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Material ID',
        },
      },
      required: ['id'],
    },
  })
  async getMaterial(args: { id: string }) {
    const material = await this.materialService.GetById(args.id);

    if (!material) {
      return this.error('Material not found');
    }

    return this.success(material);
  }
}
