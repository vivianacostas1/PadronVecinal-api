import { PrismaClient } from '@prisma/client';
import { CreateResultadoDTO, UpdateResultadoDTO } from '../types/resultado.types';

const prisma = new PrismaClient();

export const resultadoService = {
  async createResultado(data: CreateResultadoDTO) {
    return await prisma.resultadoVotacion.create({
      data,
      include: {
        plancha: true,
        registradoPor: true,
      },
    });
  },

  async getAllResultados() {
    return await prisma.resultadoVotacion.findMany({
      orderBy: { cantidadVotos: 'desc' },
      include: {
        plancha: true,
        registradoPor: true,
      },
    });
  },

  async getResultadoById(id: number) {
    const resultado = await prisma.resultadoVotacion.findUnique({
      where: { id },
      include: {
        plancha: true,
        registradoPor: true,
      },
    });

    if (!resultado) {
      throw new Error('Resultado de votación no encontrado');
    }
    return resultado;
  },

  async updateResultado(id: number, data: UpdateResultadoDTO) {
    await this.getResultadoById(id);
    return await prisma.resultadoVotacion.update({
      where: { id },
      data,
      include: {
        plancha: true,
        registradoPor: true,
      },
    });
  },

  async deleteResultado(id: number) {
    await this.getResultadoById(id);
    return await prisma.resultadoVotacion.delete({
      where: { id },
    });
  },
};