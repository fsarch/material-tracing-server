import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ShortCode } from '../../database/entities/short_code.entity.js';
import { MaterialShortCode } from '../../database/entities/material_short_code.entity.js';
import { PartShortCode } from '../../database/entities/part_short_code.entity.js';
import { ShortCodeService } from './short-code.service.js';

describe('ShortCodeService', () => {
  let service: ShortCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShortCodeService,
        {
          provide: getRepositoryToken(ShortCode),
          useValue: {},
        },
        {
          provide: getRepositoryToken(MaterialShortCode),
          useValue: {},
        },
        {
          provide: getRepositoryToken(PartShortCode),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ShortCodeService>(ShortCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
