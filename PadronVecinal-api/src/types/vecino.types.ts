import { TipoResidencia } from '@prisma/client';

export interface CreateVecinoDTO {
  usuarioId: number;
  nombre: string;
  primerApellido: string;
  segundoApellido?: string;
  numeroCarnet: string;
  direccion: string;
  manzano: string;
  numeroFolio: string;
  tipoResidencia: TipoResidencia;
}

export interface UpdateVecinoDTO extends Partial<CreateVecinoDTO> {}