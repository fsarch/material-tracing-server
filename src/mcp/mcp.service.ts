import { Injectable, OnModuleInit } from '@nestjs/common';
import { ToolRegistryService } from './core/tool-registry.service.js';
import {
  InitializeResponse,
  ListToolsResponse,
  ListResourcesResponse,
  ToolResponse,
} from './mcp.interface.js';

@Injectable()
export class McpService implements OnModuleInit {
  private readonly SERVER_NAME = 'material-tracing-server';
  private readonly SERVER_VERSION = '1.0.0';
  private readonly PROTOCOL_VERSION = '2024-11-05';

  constructor(private readonly toolRegistry: ToolRegistryService) {}

  onModuleInit() {
    // Initialize MCP service when module is loaded
    // Tools are registered and ready to be used
  }

  /**
   * Initialize the MCP server
   * Returns server capabilities and information
   */
  async initialize(): Promise<InitializeResponse> {
    return {
      protocolVersion: this.PROTOCOL_VERSION,
      capabilities: {
        tools: {},
        resources: {},
      },
      serverInfo: {
        name: this.SERVER_NAME,
        version: this.SERVER_VERSION,
      },
    };
  }

  /**
   * List all available tools
   */
  async listTools(): Promise<ListToolsResponse> {
    const registeredTools = this.toolRegistry.getTools();
    const tools = registeredTools.map((tool) => ({
      name: tool.metadata.name,
      description: tool.metadata.description,
      inputSchema: tool.metadata.inputSchema,
    }));

    return { tools };
  }

  /**
   * List available resources (API endpoints)
   * This provides information about the exposed API resources
   */
  async listResources(): Promise<ListResourcesResponse> {
    return {
      resources: [
        {
          uri: '/.mcp/initialize',
          name: 'Initialize Server',
          description:
            'Initialize the MCP server and get server capabilities',
          mimeType: 'application/json',
        },
        {
          uri: '/.mcp/tools',
          name: 'List Tools',
          description: 'Get all available MCP tools',
          mimeType: 'application/json',
        },
        {
          uri: '/.mcp/tools/call',
          name: 'Call Tool',
          description: 'Execute a specific MCP tool',
          mimeType: 'application/json',
        },
        {
          uri: '/.mcp/resources',
          name: 'List Resources',
          description: 'Get available API resources',
          mimeType: 'application/json',
        },
        {
          uri: '/.mcp/health',
          name: 'Health Check',
          description: 'Get MCP service health status',
          mimeType: 'application/json',
        },
      ],
    };
  }

  /**
   * Call a registered tool by name with arguments
   */
  async callTool(name: string, args: unknown): Promise<ToolResponse> {
    try {
      const handler = this.toolRegistry.getToolHandler(name);

      if (!handler) {
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

      return await handler(args);
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
}
