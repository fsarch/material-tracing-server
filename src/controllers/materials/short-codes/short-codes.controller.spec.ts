import { Test, TestingModule } from '@nestjs/testing';
import { MaterialShortCodesController } from './short-codes.controller.js';

describe('ShortCodesController', () => {
  let controller: MaterialShortCodesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaterialShortCodesController],
    }).compile();

    controller = module.get<MaterialShortCodesController>(MaterialShortCodesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
