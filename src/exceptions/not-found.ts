import { ErrorCodes, HttpException } from "./root";

export class NotFoundException extends HttpException {
  constructor(message: string, errorCode: ErrorCodes, errors: any) {
    super(404, message, errorCode, 404, errors);
  }
}
