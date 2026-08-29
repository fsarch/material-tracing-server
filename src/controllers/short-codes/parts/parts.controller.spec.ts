import { Test, TestingModule } from '@nestjs/testing';
import { PartsController } from './parts.controller.js';
import { ShortCodeService } from '../../../repositories/short-code/short-code.service.js';
import { PartShortCodeService } from '../../../repositories/part-short-code/part-short-code.service.js';
import { PartService } from '../../../repositories/part/part.service.js';

describe('PartsController', () => {
  let controller: PartsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartsController],
      providers: [
        {
          provide: ShortCodeService,
          useValue: {},
        },
        {
          provide: PartShortCodeService,
          useValue: {},
        },
        {
          provide: PartService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<PartsController>(PartsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
