export interface Planta {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  temporada: string; // "sol", "sombra", "resolana"
}
