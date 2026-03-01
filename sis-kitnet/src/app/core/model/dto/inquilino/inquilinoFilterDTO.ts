export interface InquilinoFilterDTO {
  pagina: number;
  itensPorPagina: number;
  nome?: string;
  cpf?: string;
  status?: string;
  sortField?: string;
  sortDirection?: 'asc' | 'desc' | '';
}
