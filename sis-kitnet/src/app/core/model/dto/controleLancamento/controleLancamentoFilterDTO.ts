export interface ControleLancamentoFilterDTO {
  pagina: number;
  itensPorPagina: number;
  dataEntrada?: string;
  dataPagamento?: string;
  dataPagamentoDe?: string;
  dataPagamentoAte?: string;
  inquilinoId?: number;
  apartamentoId?: number;
  valorId?: number;
  entragaContaLuz?: string;
  statusApartamePagamento?: string;
  statusApartamePagamentoLuz?: string;
  statusProximoPagamento?: string;
  sortField?: string;
  sortDirection?: 'asc' | 'desc' | '';
}
