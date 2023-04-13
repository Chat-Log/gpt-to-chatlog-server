export enum ErrorStatusCode {
  //auth
  AUTHORIZATION_FAILED = '4101',
  TOKEN_EXPIRED = '4102',
  TOKEN_INVALID = '4103',
  NO_TOKEN = '4104',

  //data-access
  DATA_CONFLICT = '4901',
  DATA_SAVE_FAILED = '4502',
  FOREIGN_KEY_CONSTRAINT_FAILED = '4503',
  DATA_REMOVE_FAILED = '4505',
  DATA_NOT_FOUND = '4401',
  USER_NOT_FOUND = '4402',
  TRANSACTION_FAILED = '4504',

  //bad-request
  INVALID_INPUT = '4001',

  //internal
  UNKNOWN_EXCEPTION = '4501',
  NULL_OR_UNDEFINED_PARAMETER = '4506',
}
