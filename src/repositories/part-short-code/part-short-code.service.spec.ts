import { Test, TestingModule } from '@nestjs/testing';
import { PartShortCodeService } from './part-short-code.service.js';

describe('PartShortCodeService', () => {
  let service: PartShortCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartShortCodeService],
    }).compile();

    service = module.get<PartShortCodeService>(PartShortCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
