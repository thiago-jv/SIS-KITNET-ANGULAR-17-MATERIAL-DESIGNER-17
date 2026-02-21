export interface ApartamentoFilterDTO {
  pagina: number;
  itensPorPagina: number;
  descricao?: string;
  numeroApartamento?: string;
  sortField?: string;
  sortDirection?: 'asc' | 'desc' | '';
}
