import { Injectable } from '@nestjs/common';
import { ManufacturerService } from '../../repositories/manufacturer/manufacturer.service.js';
import { BaseToolProvider } from '../core/base-tool-provider.js';
import { McpTool, McpToolProvider } from '../decorators/mcp-tool.decorator.js';

@Injectable()
@McpToolProvider()
export class ManufacturerToolProvider extends BaseToolProvider {
  constructor(private readonly manufacturerService: ManufacturerService) {
    super();
  }

  @McpTool({
    name: 'search_manufacturers',
    description: 'Search manufacturers by name or external ID',
    inputSchema: {
      type: 'object',
      properties: {
        search: {
          type: 'string',
          description: 'Search term for manufacturer name or external ID',
        },
      },
    },
  })
  async searchManufacturers(args: { search?: string }) {
    const manufacturers = await this.manufacturerService.ListManufacturers(
      args.search,
    );
    return this.success(manufacturers);
  }

  @McpTool({
    name: 'get_manufacturer',
    description: 'Get a single manufacturer by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Manufacturer ID',
        },
      },
      required: ['id'],
    },
  })
  async getManufacturer(args: { id: string }) {
    const manufacturer = await this.manufacturerService.GetManufacturerById(
      args.id,
    );

    if (!manufacturer) {
      return this.error('Manufacturer not found');
    }

    return this.success(manufacturer);
  }
}
