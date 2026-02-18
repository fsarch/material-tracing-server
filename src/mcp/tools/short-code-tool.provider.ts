import { Injectable } from '@nestjs/common';
import { ShortCodeService } from '../../repositories/short-code/short-code.service.js';
import { BaseToolProvider } from '../core/base-tool-provider.js';
import { McpTool, McpToolProvider } from '../decorators/mcp-tool.decorator.js';

@Injectable()
@McpToolProvider()
export class ShortCodeToolProvider extends BaseToolProvider {
  constructor(private readonly shortCodeService: ShortCodeService) {
    super();
  }

  @McpTool({
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
  })
  async searchShortCodes(args: { search?: string }) {
    const shortCodes = await this.shortCodeService.ListShortCodes({
      search: args.search,
    });

    return this.success(shortCodes);
  }

  @McpTool({
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
  })
  async getShortCode(args: { id: string }) {
    const shortCode = await this.shortCodeService.GetShortCode(args.id);

    if (!shortCode) {
      return this.error('Short code not found');
    }

    return this.success(shortCode);
  }
}
