import { Router } from 'express';
import { usuariosController } from '../controllers/usuario.controller';

import { verificarToken } from '../middleware/auth.middleware';
import { verificarRol } from '../middleware/role.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { registerSchema, loginSchema } from '../schemas/auth.schemas';
import { RolUsuario } from '@prisma/client';

const router = Router();

// --- RUTAS PÚBLICAS DE AUTENTICACIÓN ---
// (Aquí solo dejamos el login, el registro general ahora pasa a ser protegido por administración)
router.post('/login', validateBody(loginSchema), usuariosController.login);

// --- RUTAS PROTEGIDAS DE USUARIOS ---
// Listar todos (Administradores u operadores)
router.get('/', verificarToken, verificarRol([RolUsuario.administrador, RolUsuario.operador_consultas]), usuariosController.getAll);

// Obtener por ID (Autenticado)
router.get('/:id', verificarToken, usuariosController.getById);

// Crear usuario directamente (Únicamente administradores con token y validación)
router.post('/', verificarToken, verificarRol([RolUsuario.administrador]), validateBody(registerSchema), usuariosController.create);

// Actualizar usuario (Solo administradores)
router.put('/:id', verificarToken, verificarRol([RolUsuario.administrador]), usuariosController.update);

// Eliminar usuario (Solo administradores)
router.delete('/:id', verificarToken, verificarRol([RolUsuario.administrador]), usuariosController.remove);

export default router;