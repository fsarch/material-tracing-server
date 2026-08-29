import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MetaController } from './meta.controller.js';
import { ActionService } from '../../repositories/actions/action.service.js';

describe('MetaController', () => {
  let controller: MetaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetaController],
      providers: [
        {
          provide: ConfigService,
          useValue: {},
        },
        {
          provide: ActionService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<MetaController>(MetaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
