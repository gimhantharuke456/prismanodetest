//message, status code , error codes, error

export class HttpException extends Error {
  status: number;
  message: string;
  errorCode: ErrorCodes;
  statusCode: number;
  errors: any;
  constructor(
    status: number,
    message: string,
    errorCode: ErrorCodes,
    statusCode: number,
    errors: any
  ) {
    super(message);
    this.status = status;
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export enum ErrorCodes {
  USER_NOT_FOUND = 1001,
  USER_ALREADY_EXISTS = 1002,
  INCORRECT_PASSWORD = 1003,
  BAD_REQUEST = 1004,
  INTERNAL_EXCEPTION = 1005,
}
