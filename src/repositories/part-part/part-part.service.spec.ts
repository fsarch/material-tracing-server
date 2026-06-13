import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PartChildren } from '../../database/entities/part_children.entity.js';
import { PartPartService } from './part-part.service.js';

describe('PartPartService', () => {
  let service: PartPartService;
  let repository: {
    findOneBy: jest.Mock;
    save: jest.Mock;
  };

  beforeEach(async () => {
    repository = {
      findOneBy: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartPartService,
        {
          provide: getRepositoryToken(PartChildren),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<PartPartService>(PartPartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set the amount of an existing child link', async () => {
    repository.findOneBy.mockResolvedValue({
      id: 'link-id',
      partId: 'parent-part-id',
      childPartId: 'child-part-id',
      amount: 3,
    });
    repository.save.mockImplementation(async (entity) => entity);

    const result = await service.SetAmount('parent-part-id', 'child-part-id', 12);

    expect(repository.findOneBy).toHaveBeenCalledWith({
      partId: 'parent-part-id',
      childPartId: 'child-part-id',
    });
    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 12 }),
    );
    expect(result).toEqual({ id: 'link-id' });
  });
});
