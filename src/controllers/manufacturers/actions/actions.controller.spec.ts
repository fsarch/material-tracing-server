import { vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { ActionsController } from './actions.controller.js';
import { ActionService } from '../../../repositories/actions/action.service.js';

describe('ActionsController', () => {
  let controller: ActionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActionsController],
      providers: [
        {
          provide: ActionService,
          useValue: {
            executeManufacturerAction: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ActionsController>(ActionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
