import { Request, Response, NextFunction } from "express";
import { HttpException } from "../exceptions/root";

export const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";
  const errorCode = error.errorCode || 0;
  const statusCode = error.statusCode || 500;
  const errors = error.errors || null;

  res.status(status).json({
    message,
    errorCode,
    errors,
    statusCode,
  });
};
