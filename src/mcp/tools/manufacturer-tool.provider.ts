import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { ManufacturerService } from '../../repositories/manufacturer/manufacturer.service.js';

@Injectable()

export class ManufacturerToolProvider {
  constructor(private readonly manufacturerService: ManufacturerService) {}

  @Tool({
    name: 'search_manufacturers',
    description: 'Search manufacturers by name or external ID',
    parameters: z.object({
      search: z
        .string()
        .optional()
        .describe('Search term for manufacturer name or external ID'),
    }),
  })
  async searchManufacturers(args: { search?: string }) {
    const manufacturers = await this.manufacturerService.ListManufacturers(
      args.search,
    );
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(manufacturers, null, 2),
        },
      ],
    };
  }

  @Tool({
    name: 'get_manufacturer',
    description: 'Get a single manufacturer by ID',
    parameters: z.object({
      id: z.string().describe('Manufacturer ID'),
    }),
  })
  async getManufacturer(args: { id: string }) {
    const manufacturer = await this.manufacturerService.GetManufacturerById(
      args.id,
    );

    if (!manufacturer) {
      return {
        content: [
          {
            type: 'text' as const,
            text: 'Manufacturer not found',
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(manufacturer, null, 2),
        },
      ],
    };
  }
}
