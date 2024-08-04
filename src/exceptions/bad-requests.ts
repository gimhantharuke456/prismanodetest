import { ErrorCodes, HttpException } from "./root";

export class BadRequestException extends HttpException {
  constructor(message: string, errorCode: ErrorCodes, errors: any) {
    super(400, message, errorCode, 400, null);
  }
}
