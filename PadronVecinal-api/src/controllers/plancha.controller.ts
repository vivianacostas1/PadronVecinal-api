import { Request, Response } from 'express';
import { planchaService } from '../services/plancha.service';

export const crearPlancha = async (req: Request, res: Response): Promise<void> => {
  try {
    const { color, nombreFrente, creadoPorId } = req.body;

    if (!color || !nombreFrente) {
      res.status(400).json({ error: 'Los campos color y nombreFrente son obligatorios.' });
      return;
    }

    const nuevaPlancha = await planchaService.createPlancha({
      color,
      nombreFrente,
      creadoPorId: creadoPorId ? Number(creadoPorId) : undefined,
    });

    res.status(201).json(nuevaPlancha);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al crear la plancha', detalle: error.message });
  }
};
export const listarPlanchas = async (_req: Request, res: Response): Promise<void> => {
  try {
    const planchas = await planchaService.getAllPlanchas();
    res.json(planchas);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al listar las planchas', detalle: error.message });
  }
};

export const obtenerPlanchaPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const plancha = await planchaService.getPlanchaById(Number(id));
    res.json(plancha);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const actualizarPlancha = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const planchaActualizada = await planchaService.updatePlancha(Number(id), req.body);
    res.json(planchaActualizada);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al actualizar la plancha', detalle: error.message });
  }
};

export const eliminarPlancha = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await planchaService.deletePlancha(Number(id));
    res.json({ mensaje: 'Plancha eliminada correctamente' });
  } catch (error: any) {
    res.status(500).json({ error: 'Error al eliminar la plancha (puede que tenga candidatos asociados)', detalle: error.message });
  }
};