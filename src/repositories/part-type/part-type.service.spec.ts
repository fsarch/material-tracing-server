import { Test, TestingModule } from '@nestjs/testing';
import { PartTypeService } from './part-type.service.js';

describe('PartTypeService', () => {
  let service: PartTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartTypeService],
    }).compile();

    service = module.get<PartTypeService>(PartTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
