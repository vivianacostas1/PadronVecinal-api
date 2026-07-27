import { Router } from 'express';
import {
  crearCargo,
  listarCargos,
  obtenerCargoPorId,
  actualizarCargo,
  eliminarCargo,
} from '../controllers/cargo.controller';

const router = Router();

router.post('/', crearCargo);
router.get('/', listarCargos);
router.get('/:id', obtenerCargoPorId);
router.put('/:id', actualizarCargo);
router.delete('/:id', eliminarCargo);

export default router;