import { Test, TestingModule } from '@nestjs/testing';
import { ShortCodeService } from './short-code.service';

describe('ShortCodeService', () => {
  let service: ShortCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShortCodeService],
    }).compile();

    service = module.get<ShortCodeService>(ShortCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
