import { PrismaClient, TipoResidencia, RolUsuario } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateVecinoDTO {
  usuarioId: number;
  nombre: string;
  primerApellido: string;
  segundoApellido?: string;
  numeroCarnet: string;
  direccion: string;
  manzano: string;
  numeroFolio: string;
  tipoResidencia: TipoResidencia;
}

interface CreateVecinoWithAuthDTO extends CreateVecinoDTO {
  solicitanteId: number;
  solicitanteRol: RolUsuario;
}

export const vecinoService = {
  async createVecino(data: CreateVecinoWithAuthDTO) {
    // 1. REGLA DE ROLES: Validar permisos según el rol del solicitante
    if (data.solicitanteRol === 'vecino') {
      if (data.usuarioId !== data.solicitanteId) {
        throw new Error('No tienes permisos para registrar un vecino a nombre de otro usuario.');
      }

      const vecinoExistente = await prisma.vecino.findFirst({
        where: { usuarioId: data.solicitanteId },
      });

      if (vecinoExistente) {
        throw new Error('Ya cuentas con un registro de vecino creado.');
      }
    }

    // 2. Verificar si ya existe un vecino con ese carnet
    const existente = await prisma.vecino.findFirst({
      where: {
        OR: [
          { numeroCarnet: data.numeroCarnet },
        ],
      },
    });

    if (existente) {
      throw new Error('El vecino ya está registrado (Carnet duplicado).');
    }

    // 3. Creación directa
    return await prisma.vecino.create({
      data: {
        nombre: data.nombre,
        primerApellido: data.primerApellido,
        segundoApellido: data.segundoApellido || null,
        numeroCarnet: data.numeroCarnet,
        direccion: data.direccion,
        manzano: data.manzano,
        numeroFolio: data.numeroFolio,
        tipoResidencia: data.tipoResidencia,
        usuario: {
          connect: { id: Number(data.usuarioId) }
        }
      },
    });
  },

  // NUEVO MÉTODO: Importación masiva segura para Excel (omite o actualiza duplicados)
  async importarMasivoVecinos(listaVecinos: CreateVecinoWithAuthDTO[]) {
    const resultados = {
      creados: 0,
      actualizados: 0,
      errores: 0,
      detalles: [] as any[]
    };

    for (const data of listaVecinos) {
      try {
        // Validamos si ya existe por número de carnet
        const existente = await prisma.vecino.findFirst({
          where: { numeroCarnet: data.numeroCarnet }
        });

        if (existente) {
          // Si ya existe, podemos actualizarlo con los datos nuevos del Excel
          await prisma.vecino.update({
            where: { id: existente.id },
            data: {
              nombre: data.nombre,
              primerApellido: data.primerApellido,
              segundoApellido: data.segundoApellido || null,
              direccion: data.direccion,
              manzano: data.manzano,
              numeroFolio: data.numeroFolio,
              tipoResidencia: data.tipoResidencia,
            }
          });
          resultados.actualizados++;
        } else {
          // Si no existe, lo creamos
          await prisma.vecino.create({
            data: {
              nombre: data.nombre,
              primerApellido: data.primerApellido,
              segundoApellido: data.segundoApellido || null,
              numeroCarnet: data.numeroCarnet,
              direccion: data.direccion,
              manzano: data.manzano,
              numeroFolio: data.numeroFolio,
              tipoResidencia: data.tipoResidencia,
              usuario: {
                connect: { id: Number(data.usuarioId) }
              }
            },
          });
          resultados.creados++;
        }
      } catch (err: any) {
        resultados.errores++;
        resultados.detalles.push({ carnet: data.numeroCarnet, error: err.message });
      }
    }

    return resultados;
  },

  async getAllVecinos() {
    return await prisma.vecino.findMany({
      include: { usuario: true },
    });
  },

  async getVecinoById(id: number) {
    const vecino = await prisma.vecino.findUnique({
      where: { id },
      include: { usuario: true },
    });

    if (!vecino) {
      throw new Error('Vecino no encontrado');
    }
    return vecino;
  },

  async updateVecino(id: number, data: Partial<CreateVecinoDTO>) {
    await this.getVecinoById(id); // Valida que exista

    return await prisma.vecino.update({
      where: { id },
      data,
    });
  },

  async deleteVecino(id: number) {
    await this.getVecinoById(id); // Valida que exista

    return await prisma.vecino.delete({
      where: { id },
    });
  },
};