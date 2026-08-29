import { vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Material } from '../../database/entities/material.entity.js';
import { MaterialService } from './material.service.js';

describe('MaterialService', () => {
  let service: MaterialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaterialService,
        {
          provide: getRepositoryToken(Material),
          useValue: {},
        },
        {
          provide: EventEmitter2,
          useValue: { emit: vi.fn() },
        },
      ],
    }).compile();

    service = module.get<MaterialService>(MaterialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
