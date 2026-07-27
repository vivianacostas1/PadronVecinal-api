import { Router } from 'express';
import { vecinoController } from '../controllers/vecino.controller';

const router = Router();

// Rutas individuales existentes
router.post('/', vecinoController.crear);
router.get('/', vecinoController.listar);
router.get('/:id', vecinoController.obtenerPorId);
router.put('/:id', vecinoController.actualizar);
router.delete('/:id', vecinoController.eliminar);

// NUEVA RUTA: Importación masiva desde Excel
// Asegúrate de crear también la función 'importarMasivo' (o el nombre que elijas) en tu vecinoController
router.post('/masivo', vecinoController.importarMasivo);

export default router;