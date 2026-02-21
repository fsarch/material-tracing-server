import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { MaterialTypeService } from '../../repositories/material-type/material-type.service.js';

type ResourceStatus = 'all' | 'active' | 'archived';

@Injectable()
export class MaterialTypeToolProvider {
  constructor(private readonly materialTypeService: MaterialTypeService) {}

  @Tool({
    name: 'search_material_types',
    description: 'Search material types by name or external ID',
    parameters: z.object({
      search: z
        .string()
        .optional()
        .describe('Search term for material type name or external ID'),
      status: z
        .enum(['all', 'active', 'archived'])
        .optional()
        .describe('Filter by status: all, active, or archived'),
    }),
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

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(allMaterialTypes, null, 2),
          },
        ],
      };
    }

    const materialTypes = await this.materialTypeService.ListMaterialTypes(
      status === 'archived',
      args.search,
    );

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(materialTypes, null, 2),
        },
      ],
    };
  }

  @Tool({
    name: 'get_material_type',
    description: 'Get a single material type by ID',
    parameters: z.object({
      id: z.string().describe('Material type ID'),
    }),
  })
  async getMaterialType(args: { id: string }) {
    const materialType = await this.materialTypeService.GetMaterialType(
      args.id,
    );

    if (!materialType) {
      return {
        content: [
          {
            type: 'text' as const,
            text: 'Material type not found',
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(materialType, null, 2),
        },
      ],
    };
  }
}
