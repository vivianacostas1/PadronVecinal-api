import { Request, Response } from 'express';
import { usuarioService } from '../services/usuario.service'; // Asegúrate de que coincida con el nombre de tu archivo de servicio
import jwt from 'jsonwebtoken';

export const usuariosController = {
  // GET /api/users
  async getAll(req: Request, res: Response): Promise<any> {
    try {
      const usuarios = await usuarioService.getAllUsers();
      return res.status(200).json({ status: 'success', data: usuarios });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      return res.status(500).json({ status: 'error', message: 'Error al obtener usuarios', error: message });
    }
  },

  // GET /api/users/:id
  async getById(req: Request, res: Response): Promise<any> {
    try {
      const id = parseInt(req.params.id);
      const usuario = await usuarioService.getUserById(id);

      if (!usuario) {
        return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
      }

      return res.status(200).json({ status: 'success', data: usuario });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      return res.status(500).json({ status: 'error', message: 'Error al obtener el usuario', error: message });
    }
  },

  // POST /api/users (Crear usuario)
  async create(req: Request, res: Response): Promise<any> {
    try {
      const nuevoUsuario = await usuarioService.createUser(req.body);
      // Ocultamos la contraseña en la respuesta por seguridad
      const { passwordHash, ...usuarioSinPassword } = nuevoUsuario;
      return res.status(201).json({ status: 'success', message: 'Usuario creado exitosamente 🚀', data: usuarioSinPassword });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      return res.status(500).json({ status: 'error', message: 'Error al crear el usuario', error: message });
    }
  },

  // POST /api/auth/login (Iniciar sesión)
  async login(req: Request, res: Response): Promise<any> {
    try {
      const { email, password } = req.body;
      const usuario = await usuarioService.loginUser(email, password);

      const secret = process.env.JWT_SECRET || 'secreto_por_defecto';
      const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

      // Generar el token JWT con los datos clave del usuario
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email, rol: usuario.rol },
        secret,
        { expiresIn: expiresIn as any }
      );

      return res.status(200).json({
        status: 'success',
        mensaje: 'Login exitoso',
        token,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
        },
      });
    } catch (error: any) {
      return res.status(401).json({ status: 'error', message: error.message || 'Credenciales inválidas' });
    }
  },

  // PUT /api/users/:id
  async update(req: Request, res: Response): Promise<any> {
    try {
      const id = parseInt(req.params.id);
      // Nota: Si actualizas la contraseña, recuerda hashearla también en tu servicio.
      const usuarioActualizado = await usuarioService.updateUser(id, req.body);
      const { passwordHash, ...usuarioSinPassword } = usuarioActualizado;
      return res.status(200).json({ status: 'success', message: 'Usuario actualizado correctamente', data: usuarioSinPassword });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      return res.status(500).json({ status: 'error', message: 'Error al actualizar el usuario', error: message });
    }
  },

  // DELETE /api/users/:id
  async remove(req: Request, res: Response): Promise<any> {
    try {
      const id = parseInt(req.params.id);
      await usuarioService.deleteUser(id);
      return res.status(200).json({ status: 'success', message: 'Usuario eliminado correctamente' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      return res.status(500).json({ status: 'error', message: 'Error al eliminar el usuario', error: message });
    }
  },
};
