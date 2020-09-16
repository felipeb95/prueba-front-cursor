export interface Person {
  id: number;
  activo: number;
  nombre: string;
  apellido: string;
  rut: string;
  telefono: number;
  direccion: {
    calle: string;
    comuna: {
      id: number;
      nombre: string;
    };
    numero: number;
  }
}
