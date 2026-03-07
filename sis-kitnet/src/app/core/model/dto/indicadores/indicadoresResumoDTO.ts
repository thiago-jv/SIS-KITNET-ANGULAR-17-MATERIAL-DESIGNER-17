export interface IndicadoresResumoDTO {
  // Apartamentos
  totalApartamentos: number;
  totalApartamentosAlugados: number;
  totalApartamentosVagos: number;
  
  // Financeiro
  receitaPrevista: number;
  totalRecebido: number;
  totalDebito: number;
  totalEmAberto: number;
  
  // Taxas (%)
  taxaOcupacao: number;
  taxaInadimplencia: number;
  taxaPagamento: number;
  
  // Controle
  totalPagamentos: number;
  pagamentosVencidos: number;
}
