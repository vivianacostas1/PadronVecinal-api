import { RolUsuario } from '@prisma/client';

// Datos requeridos para crear un usuario
export interface CreateUserDTO {
  nombre: string;
  email: string;
  passwordHash: string;
  rol: RolUsuario;
  creadoPorId?: number;
}

// Datos opcionales para actualizar un usuario
export interface UpdateUserDTO {
  nombre?: string;
  email?: string;
  passwordHash?: string;
  rol?: RolUsuario;
  activo?: boolean;
}