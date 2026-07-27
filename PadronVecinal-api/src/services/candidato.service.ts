import { PrismaClient } from '@prisma/client';
import { CreateCandidatoDTO, UpdateCandidatoDTO } from '../types/candidato.types';

const prisma = new PrismaClient();

export const candidatoService = {
  async createCandidato(data: CreateCandidatoDTO) {
    return await prisma.candidato.create({
      data,
      include: {
        plancha: true,
        cargo: true,
        vecino: true,
      },
    });
  },

  async getAllCandidatos() {
    return await prisma.candidato.findMany({
      include: {
        plancha: true,
        cargo: true,
        vecino: true,
      },
    });
  },

  async getCandidatoById(id: number) {
    const candidato = await prisma.candidato.findUnique({
      where: { id },
      include: {
        plancha: true,
        cargo: true,
        vecino: true,
      },
    });

    if (!candidato) {
      throw new Error('Candidato no encontrado');
    }
    return candidato;
  },

  async updateCandidato(id: number, data: UpdateCandidatoDTO) {
    await this.getCandidatoById(id);
    return await prisma.candidato.update({
      where: { id },
      data,
      include: {
        plancha: true,
        cargo: true,
        vecino: true,
      },
    });
  },

  async deleteCandidato(id: number) {
    await this.getCandidatoById(id);
    return await prisma.candidato.delete({
      where: { id },
    });
  },
};