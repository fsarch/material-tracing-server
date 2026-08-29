import { vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MaterialType } from '../../database/entities/material_type.entity.js';
import { MaterialTypeService } from './material-type.service.js';

describe('MaterialTypeService', () => {
  let service: MaterialTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaterialTypeService,
        {
          provide: getRepositoryToken(MaterialType),
          useValue: {},
        },
        {
          provide: EventEmitter2,
          useValue: { emit: vi.fn() },
        },
      ],
    }).compile();

    service = module.get<MaterialTypeService>(MaterialTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
