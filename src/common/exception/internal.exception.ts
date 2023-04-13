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

export class NullOrUndefinedParameterException extends InternalException {
  constructor(message: string) {
    super(ErrorStatusCode.NULL_OR_UNDEFINED_PARAMETER, message);
  }
}
