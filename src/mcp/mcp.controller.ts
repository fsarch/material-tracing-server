import { Controller, Get, Post, Body } from '@nestjs/common';
import { McpService } from './mcp.service.js';
import {
  InitializeResponse,
  ListToolsResponse,
  ListResourcesResponse,
  ToolResponse,
} from './mcp.interface.js';

@Controller('.mcp')
export class McpController {
  constructor(private readonly mcpService: McpService) {}

  /**
   * POST /.mcp/initialize
   * Initialize the MCP server and get server capabilities
   */
  @Post('initialize')
  async initialize(): Promise<InitializeResponse> {
    return this.mcpService.initialize();
  }

  /**
   * GET /.mcp/tools
   * List all available MCP tools
   */
  @Get('tools')
  async listTools(): Promise<ListToolsResponse> {
    return this.mcpService.listTools();
  }

  /**
   * GET /.mcp/resources
   * List all available API resources
   */
  @Get('resources')
  async listResources(): Promise<ListResourcesResponse> {
    return this.mcpService.listResources();
  }

  /**
   * POST /.mcp/tools/call
   * Call a specific tool
   */
  @Post('tools/call')
  async callTool(
    @Body() request: { name: string; arguments?: unknown },
  ): Promise<ToolResponse> {
    return this.mcpService.callTool(request.name, request.arguments || {});
  }

  /**
   * GET /.mcp/health
   * Health check endpoint
   */
  @Get('health')
  async health(): Promise<{ status: string; service: string }> {
    return { status: 'ok', service: 'mcp-server' };
  }
}

