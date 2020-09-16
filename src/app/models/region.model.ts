export interface Region {
  id: number;
  nombre: string;
  comunas: Comuna[];
  checked?: boolean;
}

interface Comuna {
  id: number;
  nombre: string;
}
