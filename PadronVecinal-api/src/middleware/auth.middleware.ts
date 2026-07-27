import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: number;
  email: string;
  rol: any;
}

export const verificarToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token o el formato es incorrecto.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET || 'secreto_por_defecto';
    const decoded = jwt.verify(token, secret) as JwtPayload;
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token inválido o expirado.' });
  }
};