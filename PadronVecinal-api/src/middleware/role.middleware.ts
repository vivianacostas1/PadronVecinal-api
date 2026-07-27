import { Request, Response, NextFunction } from 'express';
import { RolUsuario } from '@prisma/client';

export const verificarRol = (rolesPermitidos: RolUsuario[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'No autorizado. Falta información del usuario.' });
      return;
    }

    const rolUsuario = req.user.rol;

    if (!rolesPermitidos.includes(rolUsuario)) {
      res.status(403).json({ error: 'No tienes permisos suficientes para realizar esta acción.' });
      return;
    }

    next();
  };
};