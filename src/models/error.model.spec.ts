import { ApiError } from './error.model.js';

describe('ApiError', () => {
  describe('alreadyConnected', () => {
    it('should create an error for a material connection', () => {
      // Act
      const error = ApiError.alreadyConnected('material', 'material-id-123');

      // Assert
      expect(error.messages).toHaveLength(1);
      expect(error.messages[0]).toEqual({
        code: 'ALREADY_CONNECTED',
        parameters: {
          $type: 'material',
          id: 'material-id-123',
        },
      });
    });

    it('should create an error for a part connection', () => {
      // Act
      const error = ApiError.alreadyConnected('part', 'part-id-456');

      // Assert
      expect(error.messages).toHaveLength(1);
      expect(error.messages[0]).toEqual({
        code: 'ALREADY_CONNECTED',
        parameters: {
          $type: 'part',
          id: 'part-id-456',
        },
      });
    });

    it('should convert to the correct response format', () => {
      // Arrange
      const error = ApiError.alreadyConnected('material', 'test-id');

      // Act
      const response = error.toResponse();

      // Assert
      expect(response).toEqual({
        messages: [{
          code: 'ALREADY_CONNECTED',
          parameters: {
            $type: 'material',
            id: 'test-id',
          },
        }],
      });
    });
  });

  describe('general functionality', () => {
    it('should support multiple error messages', () => {
      // Arrange
      const messages = [
        { code: 'ERROR_1', parameters: { key: 'value1' } },
        { code: 'ERROR_2', parameters: { key: 'value2' } },
      ];

      // Act
      const error = new ApiError(messages);
      const response = error.toResponse();

      // Assert
      expect(response.messages).toHaveLength(2);
      expect(response.messages).toEqual(messages);
    });

    it('should support errors without parameters', () => {
      // Arrange
      const messages = [{ code: 'SIMPLE_ERROR' }];

      // Act
      const error = new ApiError(messages);
      const response = error.toResponse();

      // Assert
      expect(response.messages).toHaveLength(1);
      expect(response.messages[0]).toEqual({ code: 'SIMPLE_ERROR' });
    });
  });
});