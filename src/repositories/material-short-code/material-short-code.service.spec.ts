import { Test, TestingModule } from '@nestjs/testing';
import { MaterialShortCodeService } from './material-short-code.service.js';

describe('MaterialShortCodeService', () => {
  let service: MaterialShortCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaterialShortCodeService],
    }).compile();

    service = module.get<MaterialShortCodeService>(MaterialShortCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
