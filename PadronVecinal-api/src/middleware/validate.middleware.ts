import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';

export const validateBody = (schema: ZodTypeAny) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    req.body = await schema.parseAsync(req.body);
    next();
  } catch (error: any) {
    res.status(400).json({
      error: 'Error de validación en los datos enviados',
      detalles: error.errors,
    });
  }
};