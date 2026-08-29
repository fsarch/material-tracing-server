import { type Mocked, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { PartsController } from './parts.controller.js';
import { PartService } from '../../repositories/part/part.service.js';
import { PartTypeService } from '../../repositories/part-type/part-type.service.js';
import { PartShortCodeService } from '../../repositories/part-short-code/part-short-code.service.js';
import { ShortCodeService } from '../../repositories/short-code/short-code.service.js';
import { MaterialService } from '../../repositories/material/material.service.js';
import { PartMaterialService } from '../../repositories/part-material/part-material.service.js';
import { PartPartService } from '../../repositories/part-part/part-part.service.js';
import { PartDto } from '../../models/part.model.js';

describe('PartsController', () => {
  let controller: PartsController;
  let partService: Mocked<PartService>;
  let partTypeService: Mocked<PartTypeService>;

  const mockParts = [
    {
      id: '1',
      name: 'Part 1',
      externalId: 'EXT1',
      partTypeId: 'type1',
      amount: 10,
      creationTime: new Date('2023-01-01'),
      deletionTime: null,
      checkoutTime: null,
      hint: 'Test part 1',
      archiveTime: null,
    },
    {
      id: '2',
      name: 'Part 2',
      externalId: 'EXT2',
      partTypeId: 'type1',
      amount: 20,
      creationTime: new Date('2023-01-02'),
      deletionTime: null,
      checkoutTime: null,
      hint: 'Test part 2',
      archiveTime: null,
    },
    {
      id: '3',
      name: 'Part 3',
      externalId: 'EXT3',
      partTypeId: 'type2',
      amount: 30,
      creationTime: new Date('2023-01-03'),
      deletionTime: null,
      checkoutTime: null,
      hint: 'Test part 3',
      archiveTime: null,
    },
  ];

  beforeEach(async () => {
    const mockPartService = {
      ListParts: vi.fn(),
      GetById: vi.fn(),
      CreatePart: vi.fn(),
      UpdatePart: vi.fn(),
      DeletePart: vi.fn(),
      GetAvailableAmount: vi.fn(),
      ListPartsByPartType: vi.fn(),
    };

    const mockPartTypeService = {
      GetPartType: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartsController],
      providers: [
        {
          provide: PartService,
          useValue: mockPartService,
        },
        {
          provide: PartTypeService,
          useValue: mockPartTypeService,
        },
        {
          provide: PartShortCodeService,
          useValue: {},
        },
        {
          provide: ShortCodeService,
          useValue: {},
        },
        {
          provide: MaterialService,
          useValue: {},
        },
        {
          provide: PartMaterialService,
          useValue: {},
        },
        {
          provide: PartPartService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<PartsController>(PartsController);
    partService = module.get(PartService);
    partTypeService = module.get(PartTypeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('List', () => {
    // List() first asks PartService.ListParts for the full matching set (to
    // compute pagination metadata), then again for just the requested page.
    it('should return all parts with default pagination (take: 25)', async () => {
      partService.ListParts.mockResolvedValueOnce(mockParts).mockResolvedValueOnce(
        mockParts,
      );

      const result = await controller.List();

      expect(partService.ListParts).toHaveBeenNthCalledWith(1, {
        isArchived: false,
        name: undefined,
        search: undefined,
        partTypeId: undefined,
      });
      expect(partService.ListParts).toHaveBeenNthCalledWith(2, {
        skip: undefined,
        take: 25,
        name: undefined,
        search: undefined,
        isArchived: false,
        partTypeId: undefined,
      });
      expect(result.data).toHaveLength(3);
      expect(result.metadata).toEqual({
        currentPage: 1,
        pageSize: 25,
        totalItems: 3,
        totalPages: 1,
      });
      expect(result.data[0]).toEqual(PartDto.FromDbo(mockParts[0]));
    });

    it('should return parts with custom take parameter', async () => {
      partService.ListParts
        .mockResolvedValueOnce(mockParts)
        .mockResolvedValueOnce([mockParts[0], mockParts[1]]);

      const result = await controller.List(undefined, 2);

      expect(partService.ListParts).toHaveBeenNthCalledWith(2, {
        skip: undefined,
        take: 2,
        name: undefined,
        search: undefined,
        isArchived: false,
        partTypeId: undefined,
      });
      expect(result.data).toHaveLength(2);
      expect(result.metadata.totalItems).toBe(3);
      expect(result.metadata.pageSize).toBe(2);
    });

    it('should return parts with skip parameter', async () => {
      partService.ListParts
        .mockResolvedValueOnce(mockParts)
        .mockResolvedValueOnce([mockParts[1], mockParts[2]]);

      const result = await controller.List(1, 25);

      expect(partService.ListParts).toHaveBeenNthCalledWith(2, {
        skip: 1,
        take: 25,
        name: undefined,
        search: undefined,
        isArchived: false,
        partTypeId: undefined,
      });
      expect(result.data).toHaveLength(2);
    });

    it('should return parts with both skip and take parameters', async () => {
      partService.ListParts
        .mockResolvedValueOnce(mockParts)
        .mockResolvedValueOnce([mockParts[1]]);

      const result = await controller.List(1, 1);

      expect(partService.ListParts).toHaveBeenNthCalledWith(2, {
        skip: 1,
        take: 1,
        name: undefined,
        search: undefined,
        isArchived: false,
        partTypeId: undefined,
      });
      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe('2');
      expect(result.metadata.currentPage).toBe(2);
    });

    it('should handle take=0 parameter', async () => {
      partService.ListParts.mockResolvedValueOnce(mockParts).mockResolvedValueOnce(
        [],
      );

      const result = await controller.List(undefined, 0);

      expect(partService.ListParts).toHaveBeenNthCalledWith(2, {
        skip: undefined,
        take: 0,
        name: undefined,
        search: undefined,
        isArchived: false,
        partTypeId: undefined,
      });
      expect(result.data).toHaveLength(0);
    });

    it('should filter parts by name when name parameter is provided', async () => {
      partService.ListParts
        .mockResolvedValueOnce([mockParts[0]])
        .mockResolvedValueOnce([mockParts[0]]);

      const result = await controller.List(undefined, undefined, 'Part 1');

      expect(partService.ListParts).toHaveBeenNthCalledWith(2, {
        skip: undefined,
        take: 25,
        name: 'Part 1',
        search: undefined,
        isArchived: false,
        partTypeId: undefined,
      });
      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('Part 1');
    });

    it('should filter parts by partial name match', async () => {
      partService.ListParts
        .mockResolvedValueOnce([mockParts[0], mockParts[1]])
        .mockResolvedValueOnce([mockParts[0], mockParts[1]]);

      const result = await controller.List(undefined, undefined, 'Part');

      expect(partService.ListParts).toHaveBeenNthCalledWith(2, {
        skip: undefined,
        take: 25,
        name: 'Part',
        search: undefined,
        isArchived: false,
        partTypeId: undefined,
      });
      expect(result.data).toHaveLength(2);
    });

    it('should combine name filtering with pagination', async () => {
      partService.ListParts
        .mockResolvedValueOnce([mockParts[0], mockParts[1]])
        .mockResolvedValueOnce([mockParts[1]]);

      const result = await controller.List(1, 1, 'Part');

      expect(partService.ListParts).toHaveBeenNthCalledWith(2, {
        skip: 1,
        take: 1,
        name: 'Part',
        search: undefined,
        isArchived: false,
        partTypeId: undefined,
      });
      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe('2');
    });

    it('should return empty array when no parts match the name filter', async () => {
      partService.ListParts.mockResolvedValueOnce([]).mockResolvedValueOnce([]);

      const result = await controller.List(
        undefined,
        undefined,
        'NonExistentPart',
      );

      expect(partService.ListParts).toHaveBeenNthCalledWith(2, {
        skip: undefined,
        take: 25,
        name: 'NonExistentPart',
        search: undefined,
        isArchived: false,
        partTypeId: undefined,
      });
      expect(result.data).toHaveLength(0);
    });

    it('should handle wildcard characters in name filter safely', async () => {
      partService.ListParts.mockResolvedValueOnce([]).mockResolvedValueOnce([]);

      // Test with wildcard characters that should be escaped
      const result = await controller.List(
        undefined,
        undefined,
        '%_wildcards%',
      );

      expect(partService.ListParts).toHaveBeenNthCalledWith(2, {
        skip: undefined,
        take: 25,
        name: '%_wildcards%',
        search: undefined,
        isArchived: false,
        partTypeId: undefined,
      });
      expect(result.data).toHaveLength(0);
    });
  });
});
