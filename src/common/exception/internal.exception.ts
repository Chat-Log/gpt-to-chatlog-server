import { BaseException } from './base.exception';
import { ErrorStatusCode } from './error-status-code';

class InternalException extends BaseException {
  constructor(statusCode: ErrorStatusCode, message: string) {
    super(statusCode, message);
  }
}

export class UnknownException extends InternalException {
  constructor(message: string) {
    super(ErrorStatusCode.UNKNOWN_EXCEPTION, message);
  }
}
