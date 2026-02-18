import { Injectable } from '@nestjs/common';

export interface McpToolResponse {
  content: Array<{
    type: 'text';
    text: string;
  }>;
  isError?: boolean;
}

/**
 * Base class for MCP tool providers
 */
@Injectable()
export abstract class BaseToolProvider {
  /**
   * Helper method to create a successful response
   */
  protected success(data: any): McpToolResponse {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  /**
   * Helper method to create an error response
   */
  protected error(message: string): McpToolResponse {
    return {
      content: [
        {
          type: 'text',
          text: message,
        },
      ],
      isError: true,
    };
  }
}
