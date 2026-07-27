import { Router } from 'express';
import {
  crearCandidato,
  listarCandidatos,
  obtenerCandidatoPorId,
  actualizarCandidato,
  eliminarCandidato,
} from '../controllers/candidato.controller';

const router = Router();

router.post('/', crearCandidato);
router.get('/', listarCandidatos);
router.get('/:id', obtenerCandidatoPorId);
router.put('/:id', actualizarCandidato);
router.delete('/:id', eliminarCandidato);

export default router;