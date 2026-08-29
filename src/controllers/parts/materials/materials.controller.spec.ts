import { Test, TestingModule } from '@nestjs/testing';
import { MaterialsController } from './materials.controller.js';
import { PartService } from '../../../repositories/part/part.service.js';
import { MaterialService } from '../../../repositories/material/material.service.js';
import { PartMaterialService } from '../../../repositories/part-material/part-material.service.js';

describe('MaterialsController', () => {
  let controller: MaterialsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaterialsController],
      providers: [
        {
          provide: PartService,
          useValue: {},
        },
        {
          provide: MaterialService,
          useValue: {},
        },
        {
          provide: PartMaterialService,
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
