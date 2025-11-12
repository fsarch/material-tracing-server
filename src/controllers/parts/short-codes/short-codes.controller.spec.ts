import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PartShortCodesController } from './short-codes.controller.js';
import { ShortCodeService } from '../../../repositories/short-code/short-code.service.js';
import { PartShortCodeService } from '../../../repositories/part-short-code/part-short-code.service.js';
import { ApiError } from '../../../models/error.model.js';
import { ShortCodeType } from '../../../constants/short-code-type.enum.js';

describe('PartShortCodesController', () => {
  let controller: PartShortCodesController;
  let shortCodeService: jest.Mocked<ShortCodeService>;
  let partShortCodeService: jest.Mocked<PartShortCodeService>;

  const mockPartShortCode = {
    id: 'psc-1',
    partId: 'part-1',
    shortCodeId: 'short-1',
    creationTime: new Date(),
    deletionTime: null,
  };

  const mockShortCode = {
    id: 'short-1',
    code: 'XYZ789',
    shortCodeTypeId: null,
    creationTime: new Date(),
    deletionTime: null,
    hint: null,
  };

  beforeEach(async () => {
    const mockShortCodeService = {
      GetShortCodeByCode: jest.fn(),
      CheckShortCodeConnection: jest.fn(),
      UpdateShortCode: jest.fn(),
    };

    const mockPartShortCodeService = {
      ListByPartId: jest.fn(),
      Create: jest.fn(),
      DeleteById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartShortCodesController],
      providers: [
        { provide: ShortCodeService, useValue: mockShortCodeService },
        { provide: PartShortCodeService, useValue: mockPartShortCodeService },
      ],
    }).compile();

    controller = module.get<PartShortCodesController>(PartShortCodesController);
    shortCodeService = module.get(ShortCodeService);
    partShortCodeService = module.get(PartShortCodeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('MapMaterialShortCode', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully map a short code to a part when no conflicts exist', async () => {
      // Arrange
      partShortCodeService.ListByPartId.mockResolvedValue([]);
      shortCodeService.GetShortCodeByCode.mockResolvedValue(mockShortCode);
      shortCodeService.CheckShortCodeConnection.mockResolvedValue(null);
      shortCodeService.UpdateShortCode.mockResolvedValue(undefined);
      partShortCodeService.Create.mockResolvedValue({ id: 'new-psc-id' });

      // Act
      const result = await controller.MapMaterialShortCode('part-1', 'XYZ789');

      // Assert
      expect(result).toEqual({});
      expect(partShortCodeService.ListByPartId).toHaveBeenCalledWith('part-1');
      expect(shortCodeService.GetShortCodeByCode).toHaveBeenCalledWith('XYZ789');
      expect(shortCodeService.CheckShortCodeConnection).toHaveBeenCalledWith('short-1');
      expect(shortCodeService.UpdateShortCode).toHaveBeenCalledWith('short-1', {
        shortCodeTypeId: ShortCodeType.PART,
      });
      expect(partShortCodeService.Create).toHaveBeenCalledWith('part-1', 'short-1');
    });

    it('should throw ConflictException when short code is connected to a material', async () => {
      // Arrange
      partShortCodeService.ListByPartId.mockResolvedValue([]);
      shortCodeService.GetShortCodeByCode.mockResolvedValue(mockShortCode);
      shortCodeService.CheckShortCodeConnection.mockResolvedValue({
        type: 'material',
        id: 'connected-material-id',
      });

      // Act & Assert
      await expect(controller.MapMaterialShortCode('part-1', 'XYZ789'))
        .rejects.toThrow(ConflictException);

      // Verify the exception contains the proper error structure
      try {
        await controller.MapMaterialShortCode('part-1', 'XYZ789');
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.getResponse()).toEqual({
          messages: [{
            code: 'ALREADY_CONNECTED',
            parameters: {
              $type: 'material',
              id: 'connected-material-id',
            },
          }],
        });
      }

      expect(shortCodeService.CheckShortCodeConnection).toHaveBeenCalledWith('short-1');
      expect(shortCodeService.UpdateShortCode).not.toHaveBeenCalled();
      expect(partShortCodeService.Create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when short code is connected to another part', async () => {
      // Arrange
      partShortCodeService.ListByPartId.mockResolvedValue([]);
      shortCodeService.GetShortCodeByCode.mockResolvedValue(mockShortCode);
      shortCodeService.CheckShortCodeConnection.mockResolvedValue({
        type: 'part',
        id: 'other-part-id',
      });

      // Act & Assert
      await expect(controller.MapMaterialShortCode('part-1', 'XYZ789'))
        .rejects.toThrow(ConflictException);

      // Verify the exception contains the proper error structure
      try {
        await controller.MapMaterialShortCode('part-1', 'XYZ789');
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.getResponse()).toEqual({
          messages: [{
            code: 'ALREADY_CONNECTED',
            parameters: {
              $type: 'part',
              id: 'other-part-id',
            },
          }],
        });
      }

      expect(shortCodeService.CheckShortCodeConnection).toHaveBeenCalledWith('short-1');
      expect(shortCodeService.UpdateShortCode).not.toHaveBeenCalled();
      expect(partShortCodeService.Create).not.toHaveBeenCalled();
    });
  });
});
