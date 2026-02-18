import { Test, TestingModule } from '@nestjs/testing';
import { McpController } from './mcp.controller.js';
import { McpService } from './mcp.service.js';

describe('McpController', () => {
  let controller: McpController;
  let service: McpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [McpController],
      providers: [
        {
          provide: McpService,
          useValue: {
            initialize: jest.fn(),
            listTools: jest.fn(),
            listResources: jest.fn(),
            callTool: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<McpController>(McpController);
    service = module.get<McpService>(McpService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('initialize', () => {
    it('should return server capabilities', async () => {
      const mockCapabilities = {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {},
          resources: {},
        },
        serverInfo: {
          name: 'material-tracing-server',
          version: '1.0.0',
        },
      };
      jest.spyOn(service, 'initialize').mockResolvedValue(mockCapabilities);

      const result = await controller.initialize();

      expect(result).toEqual(mockCapabilities);
      expect(service.initialize).toHaveBeenCalled();
    });
  });

  describe('listTools', () => {
    it('should return a list of tools', async () => {
      const mockTools = {
        tools: [
          {
            name: 'test-tool',
            description: 'Test tool',
            inputSchema: {},
          },
        ],
      };
      jest.spyOn(service, 'listTools').mockResolvedValue(mockTools);

      const result = await controller.listTools();

      expect(result).toEqual(mockTools);
      expect(service.listTools).toHaveBeenCalled();
    });
  });

  describe('listResources', () => {
    it('should return a list of resources', async () => {
      const mockResources = {
        resources: [
          {
            uri: '/.mcp/initialize',
            name: 'Initialize Server',
            description:
              'Initialize the MCP server and get server capabilities',
            mimeType: 'application/json',
          },
        ],
      };
      jest.spyOn(service, 'listResources').mockResolvedValue(mockResources);

      const result = await controller.listResources();

      expect(result).toEqual(mockResources);
      expect(service.listResources).toHaveBeenCalled();
    });
  });

  describe('callTool', () => {
    it('should call a tool with arguments', async () => {
      const mockResponse = {
        content: [
          {
            type: 'text',
            text: 'Tool executed successfully',
          },
        ],
      };
      jest.spyOn(service, 'callTool').mockResolvedValue(mockResponse);

      const result = await controller.callTool({
        name: 'test-tool',
        arguments: { arg1: 'value1' },
      });

      expect(result).toEqual(mockResponse);
      expect(service.callTool).toHaveBeenCalledWith(
        'test-tool',
        { arg1: 'value1' },
      );
    });

    it('should call a tool without arguments', async () => {
      const mockResponse = {
        content: [
          {
            type: 'text',
            text: 'Tool executed successfully',
          },
        ],
      };
      jest.spyOn(service, 'callTool').mockResolvedValue(mockResponse);

      const result = await controller.callTool({
        name: 'test-tool',
      });

      expect(result).toEqual(mockResponse);
      expect(service.callTool).toHaveBeenCalledWith('test-tool', {});
    });
  });

  describe('health', () => {
    it('should return health status', async () => {
      const result = await controller.health();

      expect(result).toEqual({ status: 'ok', service: 'mcp-server' });
    });
  });
});

