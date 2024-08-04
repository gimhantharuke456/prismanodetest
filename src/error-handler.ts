import { Request, Response, NextFunction } from "express";
import { ErrorCodes, HttpException } from "./exceptions/root";
import { InternalException } from "./exceptions/internal-exception";
export const errorHandler = (method: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("called");
      await method(req, res, next);
    } catch (error: any) {
      let exception: HttpException;
      if (error instanceof HttpException) {
        exception = error;
      } else {
        exception = new InternalException(
          "Internal Server Error",
          ErrorCodes.INTERNAL_EXCEPTION,
          error
        );
      }
      next(exception);
    }
  };
};
