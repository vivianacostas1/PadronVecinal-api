export interface Plancha {
  id: number;
  color: string;
  nombreFrente: string;
  creadoPorId?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}