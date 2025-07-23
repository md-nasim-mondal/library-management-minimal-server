import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';

interface CustomError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

const globalErrorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong!';
  let errorResponse: any = {
    message: err.message,
    name: err.name,
  };

  // Handle Mongoose Validation Error
  if (err instanceof MongooseError.ValidationError) {
    statusCode = 400;
    message = 'Validation failed';
    errorResponse = {
      name: 'ValidationError',
      errors: {},
    };

    Object.keys(err.errors).forEach((key) => {
      const error = err.errors[key];
      errorResponse.errors[key] = {
        message: error.message,
        name: error.name,
        properties: {
          message: error.message,
          type: error.kind,
          ...(error.kind === 'min' && { min: (error as any).properties?.min }),
          ...(error.kind === 'max' && { max: (error as any).properties?.max }),
        },
        kind: error.kind,
        path: error.path,
        value: (error as any).value,
      };
    });
  }

  // Handle Mongoose Cast Error (Invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
    errorResponse = {
      name: 'CastError',
      message: `Invalid ${(err as any).path}: ${(err as any).value}`,
    };
  }

  // Handle Mongoose Duplicate Key Error
  if ((err as any).code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value';
    const field = Object.keys((err as any).keyValue)[0];
    errorResponse = {
      name: 'MongoServerError',
      message: `${field} already exists`,
      code: 11000,
    };
  }

  res.status(statusCode).json({
    message,
    success: false,
    error: errorResponse,
  });
};

export default globalErrorHandler;