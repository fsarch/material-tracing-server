import { vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Manufacturer } from '../../database/entities/manufacturer.entity.js';
import { ManufacturerService } from './manufacturer.service.js';

describe('ManufacturerService', () => {
  let service: ManufacturerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ManufacturerService,
        {
          provide: getRepositoryToken(Manufacturer),
          useValue: {},
        },
        {
          provide: EventEmitter2,
          useValue: { emit: vi.fn() },
        },
      ],
    }).compile();

    service = module.get<ManufacturerService>(ManufacturerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
