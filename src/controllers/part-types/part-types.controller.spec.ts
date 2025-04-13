import { Test, TestingModule } from '@nestjs/testing';
import { PartTypesController } from './part-types.controller.js';

describe('PartTypesController', () => {
  let controller: PartTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartTypesController],
    }).compile();

    controller = module.get<PartTypesController>(PartTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
