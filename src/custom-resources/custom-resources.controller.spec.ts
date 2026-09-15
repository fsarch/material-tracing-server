import { vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomResourcesController } from './custom-resources.controller.js';
import { CustomResourcesService } from './custom-resources.service.js';

describe('CustomResourcesController', () => {
  let controller: CustomResourcesController;
  let customResourcesService: { getAll: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    customResourcesService = {
      getAll: vi.fn().mockReturnValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomResourcesController],
      providers: [
        { provide: CustomResourcesService, useValue: customResourcesService },
      ],
    }).compile();

    controller = module.get<CustomResourcesController>(
      CustomResourcesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('List', () => {
    it('wraps the service result in a data property', async () => {
      const resources = [{ id: 'part_attachment' }];
      customResourcesService.getAll.mockReturnValue(resources);

      const result = await controller.List();

      expect(result).toEqual({ data: resources });
    });
  });
});
