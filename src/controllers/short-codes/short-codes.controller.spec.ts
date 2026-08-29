import { Test, TestingModule } from '@nestjs/testing';
import { ShortCodesController } from './short-codes.controller.js';
import { ShortCodeService } from '../../repositories/short-code/short-code.service.js';

describe('ShortCodesController', () => {
  let controller: ShortCodesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortCodesController],
      providers: [
        {
          provide: ShortCodeService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ShortCodesController>(ShortCodesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
