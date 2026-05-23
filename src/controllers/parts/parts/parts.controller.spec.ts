import { Test, TestingModule } from '@nestjs/testing';
import { PartsController } from './parts.controller.js';
import { PartService } from '../../../repositories/part/part.service.js';
import { PartPartService } from '../../../repositories/part-part/part-part.service.js';

describe('PartsController', () => {
  let controller: PartsController;
  let partPartService: { DeleteByPartId: jest.Mock };

  beforeEach(async () => {
    partPartService = {
      DeleteByPartId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartsController],
      providers: [
        {
          provide: PartService,
          useValue: {
            GetById: jest.fn(),
          },
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
});
