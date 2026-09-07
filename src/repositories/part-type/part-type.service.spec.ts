import { vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PartType } from '../../database/entities/part_type.entity.js';
import { PartTypeService } from './part-type.service.js';
import { ProductServerService } from '../product-server/product-server.service.js';

describe('PartTypeService', () => {
  let service: PartTypeService;
  let productServerService: { validateProductExists: ReturnType<typeof vi.fn> };
  let repository: { create: ReturnType<typeof vi.fn>; save: ReturnType<typeof vi.fn>; findOne: ReturnType<typeof vi.fn> };

  const user = { getAccessToken: () => 'test-token' } as any;

  beforeEach(async () => {
    productServerService = {
      validateProductExists: vi.fn().mockResolvedValue(true),
    };
    repository = {
      create: vi.fn((entity) => entity),
      save: vi.fn((entity) => Promise.resolve({ id: 'part-type-id', ...entity })),
      findOne: vi.fn().mockResolvedValue({ id: 'part-type-id' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartTypeService,
        {
          provide: getRepositoryToken(PartType),
          useValue: repository,
        },
        {
          provide: EventEmitter2,
          useValue: { emit: vi.fn() },
        },
        {
          provide: ProductServerService,
          useValue: productServerService,
        },
      ],
    }).compile();

    service = module.get<PartTypeService>(PartTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('CreatePartType', () => {
    it('creates the part type when no productId is given', async () => {
      await service.CreatePartType(
        { name: 'Name', externalId: 'ext' } as any,
        { user },
      );

      expect(productServerService.validateProductExists).not.toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });

    it('validates the productId against product-server before creating', async () => {
      await service.CreatePartType(
        { name: 'Name', externalId: 'ext', productId: 'product-id' } as any,
        { user },
      );

      expect(productServerService.validateProductExists).toHaveBeenCalledWith(
        'product-id',
        { user },
      );
      expect(repository.save).toHaveBeenCalled();
    });

    it('rejects an unknown productId', async () => {
      productServerService.validateProductExists.mockResolvedValue(false);

      await expect(
        service.CreatePartType(
          { name: 'Name', externalId: 'ext', productId: 'unknown' } as any,
          { user },
        ),
      ).rejects.toThrow('Unknown product ID');

      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('UpdatePartType', () => {
    it('rejects an unknown productId', async () => {
      productServerService.validateProductExists.mockResolvedValue(false);

      await expect(
        service.UpdatePartType(
          'part-type-id',
          { productId: 'unknown' } as any,
          { user },
        ),
      ).rejects.toThrow('Unknown product ID');

      expect(repository.save).not.toHaveBeenCalled();
    });
  });
});
