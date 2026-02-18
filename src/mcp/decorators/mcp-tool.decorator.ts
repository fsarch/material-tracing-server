import { SetMetadata } from '@nestjs/common';

export const MCP_TOOL_METADATA = 'mcp:tool';
export const MCP_TOOL_PROVIDER_METADATA = 'mcp:tool-provider';

export interface McpToolMetadata {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

/**
 * Decorator to mark a method as an MCP tool
 * @param metadata Tool metadata including name, description, and input schema
 */
export const McpTool = (metadata: McpToolMetadata): MethodDecorator => {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    SetMetadata(MCP_TOOL_METADATA, metadata)(target, propertyKey, descriptor);
    return descriptor;
  };
};

/**
 * Decorator to mark a class as an MCP tool provider
 */
export const McpToolProvider = (): ClassDecorator => {
  return (target: any) => {
    SetMetadata(MCP_TOOL_PROVIDER_METADATA, true)(target);
    return target;
  };
};
