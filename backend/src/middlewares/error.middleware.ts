import type { ErrorRequestHandler } from 'express';
import type { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';

const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || error instanceof mongoose.Error ? 400 : 500;
    const message = error.message || 'Something went wrong';

    error = new ApiError(statusCode, message, error?.errors?.errors || [], err.stack);
  }

  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === 'DEVELOPMENT' ? { stack: error.stack } : {}),
  };

  res.status(error.statusCode).json(response);
};

export { errorHandler };
