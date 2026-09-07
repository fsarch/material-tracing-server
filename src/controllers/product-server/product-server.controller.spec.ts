import { vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductServerController } from './product-server.controller.js';
import { ProductServerService } from '../../repositories/product-server/product-server.service.js';

describe('ProductServerController', () => {
  let controller: ProductServerController;
  let productServerService: { listItems: ReturnType<typeof vi.fn> };

  const user = {
    getAccessToken: () => 'test-token',
  } as any;

  beforeEach(async () => {
    productServerService = {
      listItems: vi.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductServerController],
      providers: [
        {
          provide: ProductServerService,
          useValue: productServerService,
        },
      ],
    }).compile();

    controller = module.get<ProductServerController>(ProductServerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('ListItems', () => {
    it('returns the items wrapped in a data envelope', async () => {
      productServerService.listItems.mockResolvedValue([
        { id: 'item-1', name: 'Item 1' },
      ]);

      const result = await controller.ListItems(user);

      expect(result).toEqual({ data: [{ id: 'item-1', name: 'Item 1' }] });
      expect(productServerService.listItems).toHaveBeenCalledWith({ user });
    });

    it('returns an empty data envelope when product-server has no items configured', async () => {
      const result = await controller.ListItems(user);

      expect(result).toEqual({ data: [] });
    });
  });
});
