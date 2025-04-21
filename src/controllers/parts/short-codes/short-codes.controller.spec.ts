import { Test, TestingModule } from '@nestjs/testing';
import { PartShortCodesController } from './short-codes.controller.js';

describe('ShortCodesController', () => {
  let controller: PartShortCodesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartShortCodesController],
    }).compile();

    controller = module.get<PartShortCodesController>(PartShortCodesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
