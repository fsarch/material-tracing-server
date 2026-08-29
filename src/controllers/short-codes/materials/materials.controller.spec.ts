import { Test, TestingModule } from '@nestjs/testing';
import { MaterialsController } from './materials.controller.js';
import { ShortCodeService } from '../../../repositories/short-code/short-code.service.js';
import { MaterialShortCodeService } from '../../../repositories/material-short-code/material-short-code.service.js';
import { MaterialService } from '../../../repositories/material/material.service.js';

describe('MaterialsController', () => {
  let controller: MaterialsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaterialsController],
      providers: [
        {
          provide: ShortCodeService,
          useValue: {},
        },
        {
          provide: MaterialShortCodeService,
          useValue: {},
        },
        {
          provide: MaterialService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<MaterialsController>(MaterialsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
