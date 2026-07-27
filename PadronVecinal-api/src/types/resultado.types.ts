export interface CreateResultadoDTO {
  planchaId: number;
  cantidadVotos: number;
  registradoPorId: number;
}

export interface UpdateResultadoDTO {
  cantidadVotos?: number;
}