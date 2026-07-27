import { Request, Response } from 'express';
import { candidatoService } from '../services/candidato.service';

export const crearCandidato = async (req: Request, res: Response): Promise<void> => {
  try {
    const { planchaId, cargoId, vecinoId } = req.body;

    if (!planchaId || !cargoId || !vecinoId) {
      res.status(400).json({ error: 'Los campos planchaId, cargoId y vecinoId son obligatorios.' });
      return;
    }

    const nuevoCandidato = await candidatoService.createCandidato({
      planchaId: Number(planchaId),
      cargoId: Number(cargoId),
      vecinoId: Number(vecinoId),
    });

    res.status(201).json(nuevoCandidato);
  } catch (error: any) {
    // Manejo si intenta asignar el mismo cargo dos veces a la misma plancha
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Este cargo ya está ocupado en esta plancha.' });
      return;
    }
    res.status(500).json({ error: 'Error al registrar el candidato', detalle: error.message });
  }
};

export const listarCandidatos = async (_req: Request, res: Response): Promise<void> => {
  try {
    const candidatos = await candidatoService.getAllCandidatos();
    res.status(200).json(candidatos);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al listar los candidatos', detalle: error.message });
  }
};

export const obtenerCandidatoPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const candidato = await candidatoService.getCandidatoById(id);
    res.status(200).json(candidato);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const actualizarCandidato = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { planchaId, cargoId, vecinoId } = req.body;

    const candidatoActualizado = await candidatoService.updateCandidato(id, {
      ...(planchaId && { planchaId: Number(planchaId) }),
      ...(cargoId && { cargoId: Number(cargoId) }),
      ...(vecinoId && { vecinoId: Number(vecinoId) }),
    });

    res.status(200).json(candidatoActualizado);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const eliminarCandidato = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    await candidatoService.deleteCandidato(id);
    res.status(200).json({ mensaje: 'Candidato eliminado correctamente' });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};