import { Test, TestingModule } from '@nestjs/testing';
import { PartPartService } from './part-part.service.js';

describe('PartPartService', () => {
  let service: PartPartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartPartService],
    }).compile();

    service = module.get<PartPartService>(PartPartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
