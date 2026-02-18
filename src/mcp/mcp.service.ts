import { Injectable } from '@nestjs/common';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { ToolRegistryService } from './core/tool-registry.service.js';

@Injectable()
export class McpService {
  private server: Server;
  private transport: StdioServerTransport;

  constructor(private readonly toolRegistry: ToolRegistryService) {}

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

    // Register request handlers
    this.registerHandlers();

    // Initialize transport
    this.transport = new StdioServerTransport();
    await this.server.connect(this.transport);
  }

  async stop() {
    if (this.server) {
      await this.server.close();
    }
  }

  private registerHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const registeredTools = this.toolRegistry.getTools();
      const tools = registeredTools.map((tool) => ({
        name: tool.metadata.name,
        description: tool.metadata.description,
        inputSchema: tool.metadata.inputSchema,
      }));

      return { tools };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

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
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }
}
