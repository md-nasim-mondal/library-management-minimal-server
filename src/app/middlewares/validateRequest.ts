import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

const validateRequest = (schema: ZodObject<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          error: {
            name: 'ZodValidationError',
            errors: errorMessages,
          },
        });
      }
      next(error);
    }
  };
};

export default validateRequest;