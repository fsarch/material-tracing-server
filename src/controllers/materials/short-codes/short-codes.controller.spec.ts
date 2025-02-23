import { Test, TestingModule } from '@nestjs/testing';
import { ShortCodesController } from './short-codes.controller';

describe('ShortCodesController', () => {
  let controller: ShortCodesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortCodesController],
    }).compile();

    controller = module.get<ShortCodesController>(ShortCodesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
