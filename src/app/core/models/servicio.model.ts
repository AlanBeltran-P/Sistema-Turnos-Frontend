export interface ServicioResponse {
  publicId: string;
  nombre: string;
  duracionMin: number;
  precio: number;
  activo: boolean;
}

export interface ServicioRequest {
  nombre: string;
  duracionMin: number;
  precio: number;
}
