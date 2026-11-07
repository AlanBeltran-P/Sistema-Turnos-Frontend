export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface ProfesionalResponse {
  publicId: string;
  nombre: string;
  email: string;
  slug: string;
  telefono: string | null;
}

/** Datos públicos del profesional. Todavía no existe en el back. */
export interface ProfesionalPublicoResponse {
  nombre: string;
  slug: string;
}
