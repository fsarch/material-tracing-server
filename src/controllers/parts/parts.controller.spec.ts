import { Test, TestingModule } from '@nestjs/testing';
import { PartsController } from './parts.controller.js';
import { PartService } from '../../repositories/part/part.service.js';
import { PartTypeService } from '../../repositories/part-type/part-type.service.js';
import { PartDto } from '../../models/part.model.js';

describe('PartsController', () => {
  let controller: PartsController;
  let partService: jest.Mocked<PartService>;
  let partTypeService: jest.Mocked<PartTypeService>;

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
    },
  ];

  beforeEach(async () => {
    const mockPartService = {
      ListParts: jest.fn(),
      GetById: jest.fn(),
      CreatePart: jest.fn(),
      UpdatePart: jest.fn(),
      DeletePart: jest.fn(),
      GetAvailableAmount: jest.fn(),
      ListPartsByPartType: jest.fn(),
    };

    const mockPartTypeService = {
      GetPartType: jest.fn(),
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
    it('should return all parts with default pagination (take: 25)', async () => {
      partService.ListParts.mockResolvedValue(mockParts);

      const result = await controller.List();

      expect(partService.ListParts).toHaveBeenCalledWith({
        skip: undefined,
        take: 25,
        name: undefined,
      });
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual(PartDto.FromDbo(mockParts[0]));
    });

    it('should return parts with custom take parameter', async () => {
      partService.ListParts.mockResolvedValue([mockParts[0], mockParts[1]]);

      const result = await controller.List(undefined, 2);

      expect(partService.ListParts).toHaveBeenCalledWith({
        skip: undefined,
        take: 2,
        name: undefined,
      });
      expect(result).toHaveLength(2);
    });

    it('should return parts with skip parameter', async () => {
      partService.ListParts.mockResolvedValue([mockParts[1], mockParts[2]]);

      const result = await controller.List(1, 25);

      expect(partService.ListParts).toHaveBeenCalledWith({
        skip: 1,
        take: 25,
        name: undefined,
      });
      expect(result).toHaveLength(2);
    });

    it('should return parts with both skip and take parameters', async () => {
      partService.ListParts.mockResolvedValue([mockParts[1]]);

      const result = await controller.List(1, 1);

      expect(partService.ListParts).toHaveBeenCalledWith({
        skip: 1,
        take: 1,
        name: undefined,
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });

    it('should handle take=0 parameter', async () => {
      partService.ListParts.mockResolvedValue([]);

      const result = await controller.List(undefined, 0);

      expect(partService.ListParts).toHaveBeenCalledWith({
        skip: undefined,
        take: 0,
        name: undefined,
      });
      expect(result).toHaveLength(0);
    });

    it('should filter parts by name when name parameter is provided', async () => {
      partService.ListParts.mockResolvedValue([mockParts[0]]);

      const result = await controller.List(undefined, undefined, 'Part 1');

      expect(partService.ListParts).toHaveBeenCalledWith({
        skip: undefined,
        take: 25,
        name: 'Part 1',
      });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Part 1');
    });

    it('should filter parts by partial name match', async () => {
      partService.ListParts.mockResolvedValue([mockParts[0], mockParts[1]]);

      const result = await controller.List(undefined, undefined, 'Part');

      expect(partService.ListParts).toHaveBeenCalledWith({
        skip: undefined,
        take: 25,
        name: 'Part',
      });
      expect(result).toHaveLength(2);
    });

    it('should combine name filtering with pagination', async () => {
      partService.ListParts.mockResolvedValue([mockParts[1]]);

      const result = await controller.List(1, 1, 'Part');

      expect(partService.ListParts).toHaveBeenCalledWith({
        skip: 1,
        take: 1,
        name: 'Part',
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });

    it('should return empty array when no parts match the name filter', async () => {
      partService.ListParts.mockResolvedValue([]);

      const result = await controller.List(undefined, undefined, 'NonExistentPart');

      expect(partService.ListParts).toHaveBeenCalledWith({
        skip: undefined,
        take: 25,
        name: 'NonExistentPart',
      });
      expect(result).toHaveLength(0);
    });
  });
});
