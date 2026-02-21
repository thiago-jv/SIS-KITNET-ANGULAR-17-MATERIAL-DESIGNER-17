export interface PredioFilterDTO {
  pagina: number;
  itensPorPagina: number;
  descricao?: string;
  numero?: string;
  sortField?: string;
  sortDirection?: 'asc' | 'desc' | '';
}