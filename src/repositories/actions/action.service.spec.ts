import { vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { ActionService } from './action.service.js';

describe('ActionService', () => {
  let service: ActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActionService,
        {
          provide: 'CUSTOM_ACTIONS_SERVER_CONFIG',
          useValue: {
            get: vi.fn().mockReturnValue([]),
          },
        },
      ],
    }).compile();

    service = module.get<ActionService>(ActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
