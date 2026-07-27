import { Router } from 'express';
import {
  crearPlancha,
  listarPlanchas,
  obtenerPlanchaPorId,
  actualizarPlancha,
  eliminarPlancha,
} from '../controllers/plancha.controller';

const router = Router();

router.post('/', crearPlancha);
router.get('/', listarPlanchas);
router.get('/:id', obtenerPlanchaPorId);
router.put('/:id', actualizarPlancha);
router.delete('/:id', eliminarPlancha);

export default router;