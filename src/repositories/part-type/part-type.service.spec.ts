import { vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PartType } from '../../database/entities/part_type.entity.js';
import { PartTypeService } from './part-type.service.js';

describe('PartTypeService', () => {
  let service: PartTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartTypeService,
        {
          provide: getRepositoryToken(PartType),
          useValue: {},
        },
        {
          provide: EventEmitter2,
          useValue: { emit: vi.fn() },
        },
      ],
    }).compile();

    service = module.get<PartTypeService>(PartTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
