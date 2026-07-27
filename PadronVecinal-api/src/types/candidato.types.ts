export interface CreateCandidatoDTO {
  planchaId: number;
  cargoId: number;
  vecinoId: number;
}

export interface UpdateCandidatoDTO {
  planchaId?: number;
  cargoId?: number;
  vecinoId?: number;
}