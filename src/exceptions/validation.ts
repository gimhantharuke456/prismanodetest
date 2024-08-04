import { ErrorCodes, HttpException } from "./root";

export class UnProcessableEntity extends HttpException {
  constructor(message: string, errorCode: ErrorCodes, errors: any) {
    super(422, message, errorCode, 422, errors);
  }
}
