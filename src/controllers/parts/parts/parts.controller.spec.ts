import { Test, TestingModule } from '@nestjs/testing';
import { PartsController } from './parts.controller.js';
import { PartService } from '../../../repositories/part/part.service.js';
import { PartPartService } from '../../../repositories/part-part/part-part.service.js';

describe('PartsController', () => {
  let controller: PartsController;
  let partService: { GetById: jest.Mock };
  let partPartService: {
    DeleteByPartId: jest.Mock;
    GetById: jest.Mock;
    SetAmount: jest.Mock;
  };

  beforeEach(async () => {
    partPartService = {
      DeleteByPartId: jest.fn(),
      GetById: jest.fn(),
      SetAmount: jest.fn(),
    };
    partService = {
      GetById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartsController],
      providers: [
        {
          provide: PartService,
          useValue: partService,
        },
        {
          provide: PartPartService,
          useValue: partPartService,
        },
      ],
    }).compile();

    controller = module.get<PartsController>(PartsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delete child links for deleted parent part', async () => {
    await controller.DeletePartsByPart({
      id: 'parent-part-id',
      deletionTime: '2026-01-01T00:00:00.000Z',
    });

    expect(partPartService.DeleteByPartId).toHaveBeenCalledWith(
      'parent-part-id',
      '2026-01-01T00:00:00.000Z',
    );
    expect(partPartService.DeleteByPartId).toHaveBeenCalledTimes(1);
  });

  it('should patch an existing child link amount', async () => {
    const childLink = { id: 'link-id', amount: 3 };

    partService.GetById.mockResolvedValue({ id: 'parent-part-id' });
    (partPartService.GetById as jest.Mock).mockResolvedValue(childLink);
    (partPartService.SetAmount as jest.Mock).mockResolvedValue({
      id: 'link-id',
    });

    const result = await controller.UpdatePartAmount(
      'parent-part-id',
      'child-part-id',
      { amount: 12 },
    );

    expect(partPartService.SetAmount).toHaveBeenCalledWith(
      'parent-part-id',
      'child-part-id',
      12,
    );
    expect(result).toEqual({ id: 'link-id' });
  });

  it('should reject non-positive child amounts', async () => {
    await expect(
      controller.UpdatePartAmount('parent-part-id', 'child-part-id', {
        amount: 0,
      }),
    ).rejects.toThrow('Part amount must be greater than 0');
  });
});
