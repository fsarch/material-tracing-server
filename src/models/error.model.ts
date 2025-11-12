export interface ErrorMessage {
  code: string;
  parameters?: Record<string, any>;
}

export interface ApiErrorResponse {
  messages: ErrorMessage[];
}

export class ApiError {
  constructor(
    public readonly messages: ErrorMessage[],
  ) {}

  static alreadyConnected(type: 'part' | 'material', id: string): ApiError {
    return new ApiError([
      {
        code: 'ALREADY_CONNECTED',
        parameters: {
          $type: type,
          id: id,
        },
      },
    ]);
  }

  toResponse(): ApiErrorResponse {
    return {
      messages: this.messages,
    };
  }
}