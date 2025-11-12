import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { MaterialShortCodesController } from './short-codes.controller.js';
import { ShortCodeService } from '../../../repositories/short-code/short-code.service.js';
import { MaterialShortCodeService } from '../../../repositories/material-short-code/material-short-code.service.js';
import { ApiError } from '../../../models/error.model.js';
import { ShortCodeType } from '../../../constants/short-code-type.enum.js';

describe('MaterialShortCodesController', () => {
  let controller: MaterialShortCodesController;
  let shortCodeService: jest.Mocked<ShortCodeService>;
  let materialShortCodeService: jest.Mocked<MaterialShortCodeService>;

  const mockMaterialShortCode = {
    id: 'msc-1',
    materialId: 'material-1',
    shortCodeId: 'short-1',
    creationTime: new Date(),
    deletionTime: null,
  };

  const mockShortCode = {
    id: 'short-1',
    code: 'ABC123',
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

    const mockMaterialShortCodeService = {
      ListByMaterialId: jest.fn(),
      Create: jest.fn(),
      DeleteById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaterialShortCodesController],
      providers: [
        { provide: ShortCodeService, useValue: mockShortCodeService },
        { provide: MaterialShortCodeService, useValue: mockMaterialShortCodeService },
      ],
    }).compile();

    controller = module.get<MaterialShortCodesController>(MaterialShortCodesController);
    shortCodeService = module.get(ShortCodeService);
    materialShortCodeService = module.get(MaterialShortCodeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('MapMaterialShortCode', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully map a short code to a material when no conflicts exist', async () => {
      // Arrange
      materialShortCodeService.ListByMaterialId.mockResolvedValue([]);
      shortCodeService.GetShortCodeByCode.mockResolvedValue(mockShortCode);
      shortCodeService.CheckShortCodeConnection.mockResolvedValue(null);
      shortCodeService.UpdateShortCode.mockResolvedValue(undefined);
      materialShortCodeService.Create.mockResolvedValue({ id: 'new-msc-id' });

      // Act
      const result = await controller.MapMaterialShortCode('material-1', 'ABC123');

      // Assert
      expect(result).toEqual({});
      expect(materialShortCodeService.ListByMaterialId).toHaveBeenCalledWith('material-1');
      expect(shortCodeService.GetShortCodeByCode).toHaveBeenCalledWith('ABC123');
      expect(shortCodeService.CheckShortCodeConnection).toHaveBeenCalledWith('short-1');
      expect(shortCodeService.UpdateShortCode).toHaveBeenCalledWith('short-1', {
        shortCodeTypeId: ShortCodeType.MATERIAL,
      });
      expect(materialShortCodeService.Create).toHaveBeenCalledWith('material-1', 'short-1');
    });

    it('should throw ConflictException when material already has short codes', async () => {
      // Arrange
      materialShortCodeService.ListByMaterialId.mockResolvedValue([mockMaterialShortCode]);

      // Act & Assert
      await expect(controller.MapMaterialShortCode('material-1', 'ABC123'))
        .rejects.toThrow(ConflictException);

      expect(materialShortCodeService.ListByMaterialId).toHaveBeenCalledWith('material-1');
      expect(shortCodeService.GetShortCodeByCode).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when short code does not exist', async () => {
      // Arrange
      materialShortCodeService.ListByMaterialId.mockResolvedValue([]);
      shortCodeService.GetShortCodeByCode.mockResolvedValue(null);

      // Act & Assert
      await expect(controller.MapMaterialShortCode('material-1', 'NONEXISTENT'))
        .rejects.toThrow(NotFoundException);

      expect(shortCodeService.GetShortCodeByCode).toHaveBeenCalledWith('NONEXISTENT');
      expect(shortCodeService.CheckShortCodeConnection).not.toHaveBeenCalled();
    });

    it('should throw ConflictException with proper error structure when short code is connected to another material', async () => {
      // Arrange
      materialShortCodeService.ListByMaterialId.mockResolvedValue([]);
      shortCodeService.GetShortCodeByCode.mockResolvedValue(mockShortCode);
      shortCodeService.CheckShortCodeConnection.mockResolvedValue({
        type: 'material',
        id: 'other-material-id',
      });

      // Act & Assert
      await expect(controller.MapMaterialShortCode('material-1', 'ABC123'))
        .rejects.toThrow(ConflictException);

      // Verify the exception contains the proper error structure
      try {
        await controller.MapMaterialShortCode('material-1', 'ABC123');
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.getResponse()).toEqual({
          messages: [{
            code: 'ALREADY_CONNECTED',
            parameters: {
              $type: 'material',
              id: 'other-material-id',
            },
          }],
        });
      }

      expect(shortCodeService.CheckShortCodeConnection).toHaveBeenCalledWith('short-1');
      expect(shortCodeService.UpdateShortCode).not.toHaveBeenCalled();
      expect(materialShortCodeService.Create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException with proper error structure when short code is connected to a part', async () => {
      // Arrange
      materialShortCodeService.ListByMaterialId.mockResolvedValue([]);
      shortCodeService.GetShortCodeByCode.mockResolvedValue(mockShortCode);
      shortCodeService.CheckShortCodeConnection.mockResolvedValue({
        type: 'part',
        id: 'connected-part-id',
      });

      // Act & Assert
      await expect(controller.MapMaterialShortCode('material-1', 'ABC123'))
        .rejects.toThrow(ConflictException);

      // Verify the exception contains the proper error structure
      try {
        await controller.MapMaterialShortCode('material-1', 'ABC123');
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.getResponse()).toEqual({
          messages: [{
            code: 'ALREADY_CONNECTED',
            parameters: {
              $type: 'part',
              id: 'connected-part-id',
            },
          }],
        });
      }

      expect(shortCodeService.CheckShortCodeConnection).toHaveBeenCalledWith('short-1');
      expect(shortCodeService.UpdateShortCode).not.toHaveBeenCalled();
      expect(materialShortCodeService.Create).not.toHaveBeenCalled();
    });
  });
});
