import { BaseException } from './base.exception';
import { ErrorStatusCode } from './error-status-code';

class AuthExceptionException extends BaseException {
  constructor(statusCode: ErrorStatusCode, message: string) {
    super(statusCode, message);
  }
}

export class AuthorizationFailedException extends AuthExceptionException {
  constructor(message: string) {
    super(ErrorStatusCode.AUTHORIZATION_FAILED, message);
  }
}

export class TokenExpiredException extends AuthExceptionException {
  constructor(message: string) {
    super(ErrorStatusCode.TOKEN_EXPIRED, message);
  }
}
