export interface MovimentoFinanceiroPostDTO {
  tipo: 'SAIDA';
  categoria: 'MANUTENCAO' | 'MATERIAL' | 'SERVICO' | 'REPASSE_PROPRIETARIO' | 'OUTROS';
  descricao: string;
  valor: number;
  data: string;
  apartamentoId?: number;
  inquilinoId?: number;
  lancamentoId?: number;
}
