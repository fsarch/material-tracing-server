import { Test, TestingModule } from '@nestjs/testing';
import { MaterialsController } from './materials.controller.js';
import { MaterialService } from '../../repositories/material/material.service.js';
import { MaterialTypeService } from '../../repositories/material-type/material-type.service.js';

describe('MaterialsController', () => {
  let controller: MaterialsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaterialsController],
      providers: [
        {
          provide: MaterialService,
          useValue: {},
        },
        {
          provide: MaterialTypeService,
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
