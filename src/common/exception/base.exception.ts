import { ErrorStatusCode } from './error-status-code';

export interface ErrorResponseBody {
  statusCode: ErrorStatusCode;
  message: string;
  error: string;
}

export abstract class BaseException extends Error {
  protected constructor(
    public readonly statusCode: ErrorStatusCode,
    public readonly message: string,
  ) {
    super(message);
  }

  getResponseBody(): ErrorResponseBody {
    return {
      statusCode: this.statusCode,
      message: this.message,
      error: this.constructor.name,
    };
  }
}
