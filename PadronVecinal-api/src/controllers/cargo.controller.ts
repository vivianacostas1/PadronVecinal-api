import { Request, Response } from 'express';
import { cargoService } from '../services/cargo.service';

export const crearCargo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, orden } = req.body;

    if (!nombre) {
      res.status(400).json({ error: 'El campo nombre es obligatorio.' });
      return;
    }

    const nuevoCargo = await cargoService.createCargo({ nombre, orden });
    res.status(201).json(nuevoCargo);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al crear el cargo', detalle: error.message });
  }
};

export const listarCargos = async (_req: Request, res: Response): Promise<void> => {
  try {
    const cargos = await cargoService.getAllCargos();
    res.status(200).json(cargos);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al listar los cargos', detalle: error.message });
  }
};

export const obtenerCargoPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const cargo = await cargoService.getCargoById(id);
    res.status(200).json(cargo);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const actualizarCargo = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { nombre, orden } = req.body;

    const cargoActualizado = await cargoService.updateCargo(id, { nombre, orden });
    res.status(200).json(cargoActualizado);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const eliminarCargo = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    await cargoService.deleteCargo(id);
    res.status(200).json({ mensaje: 'Cargo eliminado correctamente' });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};