import { Request, Response } from 'express';
import { vecinoService } from '../services/vecino.service';
import { TipoResidencia } from '@prisma/client';

export const vecinoController = {
  async crear(req: Request, res: Response) {
    try {
      const usuarioLogueado = (req as any).user || { id: 1, rol: 'administrador' };
      if (!usuarioLogueado) {
        return res.status(401).json({
          status: 'error',
          message: 'No autorizado. Falta información de sesión.',
        });
      }

      const {
        usuarioId,
        nombre,
        primerApellido,
        segundoApellido,
        numeroCarnet,
        direccion,
        manzano,
        numeroFolio,
        tipoResidencia,
      } = req.body;

      const nuevoVecino = await vecinoService.createVecino({
        usuarioId: Number(usuarioId),
        nombre,
        primerApellido,
        segundoApellido,
        numeroCarnet,
        direccion,
        manzano,
        numeroFolio,
        tipoResidencia: tipoResidencia as TipoResidencia,
        solicitanteId: usuarioLogueado.id,
        solicitanteRol: usuarioLogueado.rol,
      });

      return res.status(201).json({
        status: 'success',
        message: 'Vecino registrado exitosamente 🏠',
        data: nuevoVecino,
      });
    } catch (error: any) {
      return res.status(400).json({
        status: 'error',
        message: error.message || 'Error al registrar el vecino',
      });
    }
  },

  async listar(req: Request, res: Response) {
    try {
      const vecinos = await vecinoService.getAllVecinos();
      return res.status(200).json({
        status: 'success',
        data: vecinos,
      });
    } catch (error: any) {
      return res.status(500).json({
        status: 'error',
        message: 'Error al obtener el listado de vecinos',
      });
    }
  },

  async obtenerPorId(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const vecino = await vecinoService.getVecinoById(id);
      return res.status(200).json({
        status: 'success',
        data: vecino,
      });
    } catch (error: any) {
      return res.status(404).json({
        status: 'error',
        message: error.message || 'Vecino no encontrado',
      });
    }
  },

  async actualizar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const vecinoActualizado = await vecinoService.updateVecino(id, req.body);
      return res.status(200).json({
        status: 'success',
        message: 'Vecino actualizado exitosamente 📝',
        data: vecinoActualizado,
      });
    } catch (error: any) {
      return res.status(400).json({
        status: 'error',
        message: error.message || 'Error al actualizar el vecino',
      });
    }
  },

  async eliminar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await vecinoService.deleteVecino(id);
      return res.status(200).json({
        status: 'success',
        message: 'Vecino eliminado exitosamente 🗑️',
      });
    } catch (error: any) {
      return res.status(404).json({
        status: 'error',
        message: error.message || 'Error al eliminar el vecino',
      });
    }
  },

  // NUEVA FUNCIÓN: Importación masiva desde Excel
  async importarMasivo(req: Request, res: Response) {
    try {
      const usuarioLogueado = (req as any).user || { id: 1, rol: 'administrador' };
      if (!usuarioLogueado) {
        return res.status(401).json({
          status: 'error',
          message: 'No autorizado. Falta información de sesión.',
        });
      }

      const { vecinos } = req.body;

      if (!Array.isArray(vecinos) || vecinos.length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'No se enviaron registros válidos para importar.',
        });
      }

      const resultados = [];

      // Iteramos y usamos tu servicio existente para asegurar que pase por las mismas validaciones
      for (const v of vecinos) {
        const nuevoVecino = await vecinoService.createVecino({
          usuarioId: Number(v.usuarioId || usuarioLogueado.id),
          nombre: v.nombre,
          primerApellido: v.primerApellido,
          segundoApellido: v.segundoApellido || null,
          numeroCarnet: String(v.numeroCarnet),
          direccion: v.direccion,
          manzano: String(v.manzano),
          numeroFolio: String(v.numeroFolio),
          tipoResidencia: (v.tipoResidencia || 'dueno') as TipoResidencia,
          solicitanteId: usuarioLogueado.id,
          solicitanteRol: usuarioLogueado.rol,
        });
        resultados.push(nuevoVecino);
      }

      return res.status(201).json({
        status: 'success',
        message: `Se importaron ${resultados.length} vecinos exitosamente 📊`,
        data: resultados,
      });
    } catch (error: any) {
      return res.status(400).json({
        status: 'error',
        message: error.message || 'Error al procesar la importación masiva',
      });
    }
  },
};