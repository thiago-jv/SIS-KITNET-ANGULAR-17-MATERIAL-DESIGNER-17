export interface RelatorioGerencialFilterDTO {
  predioId?: number;
  apartamentoId?: number;
  inquilinoId?: number;
  dataInicio?: Date;
  dataFim?: Date;
  statusPagamento?: 'TODOS' | 'PAGO' | 'DEBITO';
}
