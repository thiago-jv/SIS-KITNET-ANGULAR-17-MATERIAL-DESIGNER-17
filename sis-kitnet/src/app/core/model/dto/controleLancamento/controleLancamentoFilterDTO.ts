export interface ControleLancamentoFilterDTO {
  pagina: number;
  itensPorPagina: number;
  dataEntrada?: string;
  dataPagamento?: string;
  dataPagamentoDe?: string;
  dataPagamentoAte?: string;
  inquilinoId?: number;
  apartamentoId?: number;
  predioId?: number;
  valorId?: number;
  statusApartamePagamento?: string;
  sortField?: string;
  sortDirection?: 'asc' | 'desc' | '';
}
