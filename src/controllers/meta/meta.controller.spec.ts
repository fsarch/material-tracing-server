import { vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MetaController } from './meta.controller.js';
import { ActionService } from '../../repositories/actions/action.service.js';
import { ProductServerService } from '../../repositories/product-server/product-server.service.js';

describe('MetaController', () => {
  let controller: MetaController;
  let productServerService: { getPublicConfig: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    productServerService = {
      getPublicConfig: vi.fn().mockReturnValue(null),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetaController],
      providers: [
        {
          provide: ConfigService,
          useValue: { get: vi.fn().mockReturnValue({}) },
        },
        {
          provide: ActionService,
          useValue: { getPublicCustomActionDefinition: vi.fn().mockResolvedValue([]) },
        },
        {
          provide: ProductServerService,
          useValue: productServerService,
        },
      ],
    }).compile();

    controller = module.get<MetaController>(MetaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GetUiMeta', () => {
    it('includes productServer: null when product-server is not configured', async () => {
      const result = await controller.GetUiMeta();

      expect(result.productServer).toBeNull();
    });

    it('includes the productServer config when product-server is configured', async () => {
      productServerService.getPublicConfig.mockReturnValue({
        url: 'http://product-server.local',
        catalogId: 'catalog-id',
      });

      const result = await controller.GetUiMeta();

      expect(result.productServer).toEqual({
        url: 'http://product-server.local',
        catalogId: 'catalog-id',
      });
    });
  });
});
