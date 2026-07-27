export interface CreateCargoDTO {
  nombre: string;
  orden?: number;
}

export interface UpdateCargoDTO {
  nombre?: string;
  orden?: number;
}