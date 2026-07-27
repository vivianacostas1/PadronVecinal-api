import { Router } from 'express';
import {
  crearResultado,
  listarResultados,
  obtenerResultadoPorId,
  actualizarResultado,
  eliminarResultado,
} from '../controllers/resultado.controller';

const router = Router();

router.post('/', crearResultado);
router.get('/', listarResultados);
router.get('/:id', obtenerResultadoPorId);
router.put('/:id', actualizarResultado);
router.delete('/:id', eliminarResultado);

export default router;