import { PrismaClient, RolUsuario } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const usuarioService = {
  // 1. Crear usuario con contraseña hasheada
 async createUser(data: { email: string; password: string; nombre: string; rol?: RolUsuario }) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    return await prisma.usuario.create({
      data: {
        nombre: data.nombre,
        email: data.email,
        passwordHash: hashedPassword,
        ...(data.rol ? { rol: data.rol } : {}),
      } as any, // Forzamos el tipado para evitar discrepancias estrictas de Prisma
    });
  },

  // 2. Listar todos los usuarios
  async getAllUsers() {
    return await prisma.usuario.findMany({
      select: {
        id: true,
        email: true,
        nombre: true,
        rol: true,
        creadoEn: true,
        // Omitimos el campo passwordHash por seguridad
      },
    });
  },

  // 3. Buscar usuario por ID
  async getUserById(id: number) {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nombre: true,
        rol: true,
        creadoEn: true,
      },
    });

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    return usuario;
  },

  // 4. Validar credenciales para el Login comparando con bcrypt
  async loginUser(email: string, passwordPlain: string) {
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      throw new Error('Credenciales inválidas');
    }

    // Comparamos usando el campo correcto passwordHash de tu base de datos
    const isPasswordValid = await bcrypt.compare(passwordPlain, usuario.passwordHash);

    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    return usuario;
  },

  // 5. Actualizar usuario (con opción de actualizar y hashear contraseña si se envía)
  async updateUser(id: number, data: { email?: string; password?: string; nombre?: string; rol?: RolUsuario }) {
    await this.getUserById(id); // Verifica que exista antes de actualizar

    let updateData: any = { ...data };

    if (data.password) {
      const saltRounds = 10;
      updateData.passwordHash = await bcrypt.hash(data.password, saltRounds);
      delete updateData.password; // Quitamos el password plano
    }

    return await prisma.usuario.update({
      where: { id },
      data: updateData,
    });
  },

  // 6. Eliminar usuario
  async deleteUser(id: number) {
    await this.getUserById(id);
    return await prisma.usuario.delete({
      where: { id },
    });
  },
};