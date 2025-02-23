import { Test, TestingModule } from '@nestjs/testing';
import { MaterialTypesController } from './material-types.controller.js';

describe('MaterialTypesController', () => {
  let controller: MaterialTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaterialTypesController],
    }).compile();

    controller = module.get<MaterialTypesController>(MaterialTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
