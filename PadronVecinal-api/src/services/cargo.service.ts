import { PrismaClient } from '@prisma/client';
import { CreateCargoDTO, UpdateCargoDTO } from '../types/cargo.types';

const prisma = new PrismaClient();

export const cargoService = {
  async createCargo(data: CreateCargoDTO) {
    return await prisma.cargo.create({ data });
  },

  async getAllCargos() {
    return await prisma.cargo.findMany({
      orderBy: { orden: 'asc' },
      include: { candidato: true },
    });
  },

  async getCargoById(id: number) {
    const cargo = await prisma.cargo.findUnique({
      where: { id },
      include: { candidato: true },
    });

    if (!cargo) {
      throw new Error('Cargo no encontrado');
    }
    return cargo;
  },

  async updateCargo(id: number, data: UpdateCargoDTO) {
    await this.getCargoById(id);
    return await prisma.cargo.update({
      where: { id },
      data,
    });
  },

  async deleteCargo(id: number) {
    await this.getCargoById(id);
    return await prisma.cargo.delete({
      where: { id },
    });
  },
};