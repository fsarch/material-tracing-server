import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MaterialShortCode } from '../../database/entities/material_short_code.entity.js';
import { MaterialShortCodeService } from './material-short-code.service.js';

describe('MaterialShortCodeService', () => {
  let service: MaterialShortCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaterialShortCodeService,
        {
          provide: getRepositoryToken(MaterialShortCode),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<MaterialShortCodeService>(MaterialShortCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
