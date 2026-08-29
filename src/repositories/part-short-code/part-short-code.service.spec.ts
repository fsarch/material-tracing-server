import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PartShortCode } from '../../database/entities/part_short_code.entity.js';
import { PartShortCodeService } from './part-short-code.service.js';

describe('PartShortCodeService', () => {
  let service: PartShortCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartShortCodeService,
        {
          provide: getRepositoryToken(PartShortCode),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PartShortCodeService>(PartShortCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
