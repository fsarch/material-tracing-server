import { Injectable } from '@nestjs/common';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { ManufacturerService } from '../repositories/manufacturer/manufacturer.service.js';
import { MaterialService } from '../repositories/material/material.service.js';
import { MaterialTypeService } from '../repositories/material-type/material-type.service.js';
import { PartService } from '../repositories/part/part.service.js';
import { PartTypeService } from '../repositories/part-type/part-type.service.js';
import { ShortCodeService } from '../repositories/short-code/short-code.service.js';

type ResourceStatus = 'all' | 'active' | 'archived' | 'checked-out';

@Injectable()
export class McpService {
  private server: Server;
  private transport: StdioServerTransport;

  constructor(
    private readonly manufacturerService: ManufacturerService,
    private readonly materialService: MaterialService,
    private readonly materialTypeService: MaterialTypeService,
    private readonly partService: PartService,
    private readonly partTypeService: PartTypeService,
    private readonly shortCodeService: ShortCodeService,
  ) {}

  async start() {
    // Initialize MCP server
    this.server = new Server(
      {
        name: 'material-tracing-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      },
    );

    // Register tools
    this.registerTools();

    // Initialize transport
    this.transport = new StdioServerTransport();
    await this.server.connect(this.transport);
  }

  async stop() {
    if (this.server) {
      await this.server.close();
    }
  }

  private registerTools() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools: Tool[] = [
        // Manufacturers
        {
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
        },
        {
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
        },
        // Materials
        {
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
        },
        {
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
        },
        // Material Types
        {
          name: 'search_material_types',
          description: 'Search material types by name or external ID',
          inputSchema: {
            type: 'object',
            properties: {
              search: {
                type: 'string',
                description:
                  'Search term for material type name or external ID',
              },
              status: {
                type: 'string',
                description: 'Filter by status: all, active, or archived',
                enum: ['all', 'active', 'archived'],
              },
            },
          },
        },
        {
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
        },
        // Parts
        {
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
        },
        {
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
        },
        // Part Types
        {
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
        },
        {
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
        },
        // Short Codes
        {
          name: 'search_short_codes',
          description: 'Search short codes by code',
          inputSchema: {
            type: 'object',
            properties: {
              search: {
                type: 'string',
                description: 'Search term for short code',
              },
            },
          },
        },
        {
          name: 'get_short_code',
          description: 'Get a single short code by ID',
          inputSchema: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description: 'Short code ID',
              },
            },
            required: ['id'],
          },
        },
      ];

      return { tools };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          // Manufacturers
          case 'search_manufacturers':
            return await this.searchManufacturers(args as any);
          case 'get_manufacturer':
            return await this.getManufacturer(args as any);

          // Materials
          case 'search_materials':
            return await this.searchMaterials(args as any);
          case 'get_material':
            return await this.getMaterial(args as any);

          // Material Types
          case 'search_material_types':
            return await this.searchMaterialTypes(args as any);
          case 'get_material_type':
            return await this.getMaterialType(args as any);

          // Parts
          case 'search_parts':
            return await this.searchParts(args as any);
          case 'get_part':
            return await this.getPart(args as any);

          // Part Types
          case 'search_part_types':
            return await this.searchPartTypes(args as any);
          case 'get_part_type':
            return await this.getPartType(args as any);

          // Short Codes
          case 'search_short_codes':
            return await this.searchShortCodes(args as any);
          case 'get_short_code':
            return await this.getShortCode(args as any);

          default:
            return {
              content: [
                {
                  type: 'text',
                  text: `Unknown tool: ${name}`,
                },
              ],
              isError: true,
            };
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  // Manufacturers
  private async searchManufacturers(args: { search?: string }) {
    const manufacturers = await this.manufacturerService.ListManufacturers(
      args.search,
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(manufacturers, null, 2),
        },
      ],
    };
  }

  private async getManufacturer(args: { id: string }) {
    const manufacturer = await this.manufacturerService.GetManufacturerById(
      args.id,
    );

    if (!manufacturer) {
      return {
        content: [
          {
            type: 'text',
            text: 'Manufacturer not found',
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(manufacturer, null, 2),
        },
      ],
    };
  }

  // Materials
  private async searchMaterials(args: {
    search?: string;
    status?: ResourceStatus;
  }) {
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
            type: 'text',
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
            type: 'text',
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
          type: 'text',
          text: JSON.stringify(materials, null, 2),
        },
      ],
    };
  }

  private async getMaterial(args: { id: string }) {
    const material = await this.materialService.GetById(args.id);

    if (!material) {
      return {
        content: [
          {
            type: 'text',
            text: 'Material not found',
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(material, null, 2),
        },
      ],
    };
  }

  // Material Types
  private async searchMaterialTypes(args: {
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
            type: 'text',
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
          type: 'text',
          text: JSON.stringify(materialTypes, null, 2),
        },
      ],
    };
  }

  private async getMaterialType(args: { id: string }) {
    const materialType = await this.materialTypeService.GetMaterialType(
      args.id,
    );

    if (!materialType) {
      return {
        content: [
          {
            type: 'text',
            text: 'Material type not found',
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(materialType, null, 2),
        },
      ],
    };
  }

  // Parts
  private async searchParts(args: {
    search?: string;
    status?: ResourceStatus;
  }) {
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
            type: 'text',
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
            type: 'text',
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
          type: 'text',
          text: JSON.stringify(parts, null, 2),
        },
      ],
    };
  }

  private async getPart(args: { id: string }) {
    const part = await this.partService.GetById(args.id);

    if (!part) {
      return {
        content: [
          {
            type: 'text',
            text: 'Part not found',
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(part, null, 2),
        },
      ],
    };
  }

  // Part Types
  private async searchPartTypes(args: {
    search?: string;
    status?: ResourceStatus;
  }) {
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
            type: 'text',
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
          type: 'text',
          text: JSON.stringify(partTypes, null, 2),
        },
      ],
    };
  }

  private async getPartType(args: { id: string }) {
    const partType = await this.partTypeService.GetPartType(args.id);

    if (!partType) {
      return {
        content: [
          {
            type: 'text',
            text: 'Part type not found',
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(partType, null, 2),
        },
      ],
    };
  }

  // Short Codes
  private async searchShortCodes(args: { search?: string }) {
    const shortCodes = await this.shortCodeService.ListShortCodes({
      search: args.search,
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(shortCodes, null, 2),
        },
      ],
    };
  }

  private async getShortCode(args: { id: string }) {
    const shortCode = await this.shortCodeService.GetShortCode(args.id);

    if (!shortCode) {
      return {
        content: [
          {
            type: 'text',
            text: 'Short code not found',
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(shortCode, null, 2),
        },
      ],
    };
  }
}
