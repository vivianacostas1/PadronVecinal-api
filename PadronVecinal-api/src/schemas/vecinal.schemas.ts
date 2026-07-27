import { z } from 'zod';

export const createResultadoVotacionSchema = z.object({
  planchaId: z.number().int().positive('El ID de la plancha debe ser válido'),
  cantidadVotos: z.number().int().min(0, 'La cantidad de votos no puede ser negativa'),
  registradoPorId: z.number().int().positive('El ID del usuario registrador debe ser válido'),
});