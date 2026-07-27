import { Request, Response } from 'express';
import { resultadoService } from '../services/resultado.service';

export const crearResultado = async (req: Request, res: Response): Promise<void> => {
  try {
    const { planchaId, cantidadVotos, registradoPorId } = req.body;

    if (!planchaId || cantidadVotos === undefined || !registradoPorId) {
      res.status(400).json({ error: 'Los campos planchaId, cantidadVotos y registradoPorId son obligatorios.' });
      return;
    }

    const nuevoResultado = await resultadoService.createResultado({
      planchaId: Number(planchaId),
      cantidadVotos: Number(cantidadVotos),
      registradoPorId: Number(registradoPorId),
    });

    res.status(201).json(nuevoResultado);
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Ya existe un registro de votos para esta plancha (es único).' });
      return;
    }
    res.status(500).json({ error: 'Error al registrar el resultado', detalle: error.message });
  }
};

export const listarResultados = async (_req: Request, res: Response): Promise<void> => {
  try {
    const resultados = await resultadoService.getAllResultados();
    res.status(200).json(resultados);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al listar los resultados', detalle: error.message });
  }
};

export const obtenerResultadoPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const resultado = await resultadoService.getResultadoById(id);
    res.status(200).json(resultado);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const actualizarResultado = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { cantidadVotos } = req.body;

    const resultadoActualizado = await resultadoService.updateResultado(id, {
      ...(cantidadVotos !== undefined && { cantidadVotos: Number(cantidadVotos) }),
    });

    res.status(200).json(resultadoActualizado);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const eliminarResultado = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    await resultadoService.deleteResultado(id);
    res.status(200).json({ mensaje: 'Resultado eliminado correctamente' });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};