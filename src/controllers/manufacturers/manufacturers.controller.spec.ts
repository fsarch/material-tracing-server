import { Test, TestingModule } from '@nestjs/testing';
import { ManufacturersController } from './manufacturers.controller.js';
import { ManufacturerService } from '../../repositories/manufacturer/manufacturer.service.js';

describe('ManufacturersController', () => {
  let controller: ManufacturersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManufacturersController],
      providers: [
        {
          provide: ManufacturerService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ManufacturersController>(ManufacturersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
