import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModulesContainer, Reflector } from '@nestjs/core';
import {
  MCP_TOOL_METADATA,
  MCP_TOOL_PROVIDER_METADATA,
  McpToolMetadata,
} from '../decorators/mcp-tool.decorator.js';

export interface RegisteredTool {
  metadata: McpToolMetadata;
  handler: (args: any) => Promise<any>;
}

@Injectable()
export class ToolRegistryService implements OnModuleInit {
  private tools: Map<string, RegisteredTool> = new Map();

  constructor(
    private readonly modulesContainer: ModulesContainer,
    private readonly reflector: Reflector,
  ) {}

  async onModuleInit() {
    this.discoverTools();
  }

  /**
   * Discovers all tool providers and registers their tools
   */
  private discoverTools() {
    const providers = this.getProviders();

    for (const wrapper of providers) {
      const { instance } = wrapper as any;
      if (!instance || typeof instance === 'string') {
        continue;
      }

      const isToolProvider = this.reflector.get(
        MCP_TOOL_PROVIDER_METADATA,
        instance.constructor,
      );

      if (!isToolProvider) {
        continue;
      }

      this.registerToolsFromProvider(instance);
    }
  }

  /**
   * Registers all tools from a provider instance
   */
  private registerToolsFromProvider(provider: any) {
    const prototype = Object.getPrototypeOf(provider);
    const methodNames = Object.getOwnPropertyNames(prototype).filter(
      (name) => name !== 'constructor' && typeof provider[name] === 'function',
    );

    for (const methodName of methodNames) {
      const metadata = this.reflector.get<McpToolMetadata>(
        MCP_TOOL_METADATA,
        provider[methodName],
      );

      if (metadata) {
        this.tools.set(metadata.name, {
          metadata,
          handler: provider[methodName].bind(provider),
        });
      }
    }
  }

  /**
   * Gets all providers from all modules
   */
  private getProviders(): any[] {
    const modules = [...this.modulesContainer.values()];
    const providers: any[] = [];

    for (const module of modules) {
      const moduleProviders = [...module.providers.values()];
      providers.push(...moduleProviders);
    }

    return providers;
  }

  /**
   * Gets all registered tools
   */
  getTools(): RegisteredTool[] {
    return Array.from(this.tools.values());
  }

  /**
   * Gets a tool handler by name
   */
  getToolHandler(name: string): ((args: any) => Promise<any>) | undefined {
    return this.tools.get(name)?.handler;
  }

  /**
   * Gets tool metadata by name
   */
  getToolMetadata(name: string): McpToolMetadata | undefined {
    return this.tools.get(name)?.metadata;
  }
}
