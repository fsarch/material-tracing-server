import { Test, TestingModule } from '@nestjs/testing';
import { MaterialTypesController } from './material-types.controller.js';
import { MaterialTypeService } from '../../repositories/material-type/material-type.service.js';

describe('MaterialTypesController', () => {
  let controller: MaterialTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaterialTypesController],
      providers: [
        {
          provide: MaterialTypeService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<MaterialTypesController>(MaterialTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
