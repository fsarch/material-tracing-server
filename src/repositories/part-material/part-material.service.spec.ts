import { Test, TestingModule } from '@nestjs/testing';
import { PartMaterialService } from './part-material.service.js';

describe('PartMaterialService', () => {
  let service: PartMaterialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartMaterialService],
    }).compile();

    service = module.get<PartMaterialService>(PartMaterialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
