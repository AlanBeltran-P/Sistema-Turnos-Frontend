// Todavía no existe en el back: hace falta una entidad Cliente.

export interface ClienteResponse {
  publicId: string;
  nombre: string;
  email: string;
  telefono: string;
}

export interface ClienteRegisterRequest {
  nombre: string;
  email: string;
  telefono: string;
  password: string;
}
