import { BaseException } from './base.exception';
import { ErrorStatusCode } from './error-status-code';

class DataAccessAccessException extends BaseException {
  constructor(statusCode: ErrorStatusCode, message: string) {
    super(statusCode, message);
  }
}

export class DataConflictException extends DataAccessAccessException {
  constructor(message: string) {
    super(ErrorStatusCode.DATA_CONFLICT, message);
  }
}

export class DataSaveFailedException extends DataAccessAccessException {
  constructor(message: string) {
    super(ErrorStatusCode.DATA_SAVE_FAILED, message);
  }
}

export class ForeignKeyConstraintFailedException extends DataAccessAccessException {
  constructor(message: string) {
    super(ErrorStatusCode.FOREIGN_KEY_CONSTRAINT_FAILED, message);
  }
}

export class DataRemoveFailedException extends DataAccessAccessException {
  constructor(message: string) {
    super(ErrorStatusCode.DATA_REMOVE_FAILED, message);
  }
}

export class DataNotFoundException extends DataAccessAccessException {
  constructor(message: string) {
    super(ErrorStatusCode.DATA_NOT_FOUND, message);
  }
}

export class UserNotFoundException extends DataAccessAccessException {
  constructor(message: string) {
    super(ErrorStatusCode.USER_NOT_FOUND, message);
  }
}
