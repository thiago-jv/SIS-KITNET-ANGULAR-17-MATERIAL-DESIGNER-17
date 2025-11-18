export interface ApartamentoFilterDTO {
  pagina: number;
  itensPorPagina: number;
  descricao?: string;
  numero?: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc' | '';
}
