import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { ShortCodeService } from '../../repositories/short-code/short-code.service.js';

@Injectable()

export class ShortCodeToolProvider {
  constructor(private readonly shortCodeService: ShortCodeService) {}

  @Tool({
    name: 'search_short_codes',
    description: 'Search short codes by code',
    parameters: z.object({
      search: z.string().optional().describe('Search term for short code'),
    }),
  })
  async searchShortCodes(args: { search?: string }) {
    const shortCodes = await this.shortCodeService.ListShortCodes({
      search: args.search,
    });

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(shortCodes, null, 2),
        },
      ],
    };
  }

  @Tool({
    name: 'get_short_code',
    description: 'Get a single short code by ID',
    parameters: z.object({
      id: z.string().describe('Short code ID'),
    }),
  })
  async getShortCode(args: { id: string }) {
    const shortCode = await this.shortCodeService.GetShortCode(args.id);

    if (!shortCode) {
      return {
        content: [
          {
            type: 'text' as const,
            text: 'Short code not found',
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(shortCode, null, 2),
        },
      ],
    };
  }
}
