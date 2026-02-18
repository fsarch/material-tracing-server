/**
 * MCP Service Interface definitions
 */

export interface InitializeResponse {
  protocolVersion: string;
  capabilities: {
    tools: object;
    resources?: object;
  };
  serverInfo: {
    name: string;
    version: string;
  };
}

export interface ListToolsResponse {
  tools: Array<{
    name: string;
    description: string;
    inputSchema: unknown;
  }>;
}

export interface Resource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface ListResourcesResponse {
  resources: Resource[];
}

export interface ToolContent {
  type: string;
  text?: string;
  resource?: unknown;
}

export interface ToolResponse {
  content: ToolContent[];
  isError?: boolean;
}

