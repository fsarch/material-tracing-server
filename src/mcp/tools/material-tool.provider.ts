import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { MaterialService } from '../../repositories/material/material.service.js';

type ResourceStatus = 'all' | 'active' | 'archived' | 'checked-out';

@Injectable()

export class MaterialToolProvider {
  constructor(private readonly materialService: MaterialService) {}

  @Tool({
    name: 'search_materials',
    description: 'Search materials by name or external ID',
    parameters: z.object({
      search: z
        .string()
        .optional()
        .describe('Search term for material name or external ID'),
      status: z
        .enum(['all', 'active', 'archived', 'checked-out'])
        .optional()
        .describe('Filter by status: all, active, archived, or checked-out'),
    }),
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

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(checkedOutMaterials, null, 2),
          },
        ],
      };
    }

    if (status === 'all') {
      // Get both archived and non-archived materials
      const [activeMaterials, archivedMaterials] = await Promise.all([
        this.materialService.ListMaterials(false, args.search),
        this.materialService.ListMaterials(true, args.search),
      ]);

      const allMaterials = [...activeMaterials, ...archivedMaterials];

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(allMaterials, null, 2),
          },
        ],
      };
    }

    const materials = await this.materialService.ListMaterials(
      status === 'archived',
      args.search,
    );

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(materials, null, 2),
        },
      ],
    };
  }

  @Tool({
    name: 'get_material',
    description: 'Get a single material by ID',
    parameters: z.object({
      id: z.string().describe('Material ID'),
    }),
  })
  async getMaterial(args: { id: string }) {
    const material = await this.materialService.GetById(args.id);

    if (!material) {
      return {
        content: [
          {
            type: 'text' as const,
            text: 'Material not found',
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(material, null, 2),
        },
      ],
    };
  }
}
