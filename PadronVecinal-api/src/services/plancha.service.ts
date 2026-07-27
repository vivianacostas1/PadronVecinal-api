import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreatePlanchaDTO {
  color: string;
  nombreFrente: string;
  creadoPorId?: number;
}

export const planchaService = {
  async createPlancha(data: CreatePlanchaDTO) {
    const { creadoPorId, ...rest } = data;

    return await prisma.plancha.create({
      data: {
        ...rest,
        // Si viene creadoPorId, lo conectamos con la relación de Prisma de forma segura
        ...(creadoPorId && {
          creadoPor: {
            connect: { id: creadoPorId },
          },
        }),
      },
    });
  },

  async getAllPlanchas() {
    return await prisma.plancha.findMany({
      include: { 
        candidato: {
          include: {
            cargo: true,   // <-- Incluye los datos del cargo (nombre)
            vecino: true   // <-- Incluye los datos del vecino (nombre, apellidos, carnet)
          }
        },
        creadoPor: true,
        resultado: true
      },
    });
  },

  async getPlanchaById(id: number) {
    const plancha = await prisma.plancha.findUnique({
      where: { id },
      include: { 
        candidato: {
          include: {
            cargo: true,   // <-- Incluye los datos del cargo
            vecino: true   // <-- Incluye los datos del vecino
          }
        },
        creadoPor: true,
        resultado: true
      },
    });

    if (!plancha) {
      throw new Error('Plancha no encontrada');
    }
    return plancha;
  },

  async updatePlancha(id: number, data: any) {
    await this.getPlanchaById(id);
    
    // Filtramos para sacar usuarioId, creadoPorId o cualquier campo de relación del rest
    const { creadoPorId, usuarioId, ...rest } = data;

    return await prisma.plancha.update({
      where: { id },
      data: {
        ...rest, // Solo contendrá campos escalares limpios como nombreFrente y color
        ...(creadoPorId && {
          creadoPor: {
            connect: { id: creadoPorId },
          },
        }),
      },
    });
  },

  async deletePlancha(id: number) {
    await this.getPlanchaById(id);

    return await prisma.plancha.delete({
      where: { id },
    });
  },
};