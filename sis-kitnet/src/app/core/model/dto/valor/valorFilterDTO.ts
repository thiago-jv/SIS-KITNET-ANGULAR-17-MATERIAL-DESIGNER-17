export interface ValorFilterDTO {
  pagina: number;
  itensPorPagina: number;
  valor?: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc' | '';
}
