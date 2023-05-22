import { BaseException } from './base.exception';
import { ErrorStatusCode } from './error-status-code';

class BadRequestException extends BaseException {
  constructor(statusCode: ErrorStatusCode, message: string) {
    super(statusCode, message);
  }
}

export class InvalidInputException extends BadRequestException {
  constructor(message: string) {
    super(ErrorStatusCode.INVALID_INPUT, message);
  }
}

export class InvalidGptKeyException extends BadRequestException {
  constructor(message: string = 'user dose not have key or invalid gpt key') {
    super(ErrorStatusCode.INVALID_GPT_KEY, message);
  }
}
