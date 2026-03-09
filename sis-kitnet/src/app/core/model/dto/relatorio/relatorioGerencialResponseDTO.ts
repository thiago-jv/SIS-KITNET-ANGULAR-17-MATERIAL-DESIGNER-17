export interface LancamentoRelatorioDTO {
  id: number;
  descricao: string;
  dataVencimento: string;
  valor: number;
  statusPagamento: string;
  apartamento: {
    id: number;
    numeroApartamento: string;
    predio: {
      id: number;
      descricao: string;
    };
  };
  inquilino: {
    id: number;
    nome: string;
  };
}

export interface ApartamentoDisponivelDTO {
  id: number;
  numeroApartamento: string;
  predio: {
    id: number;
    descricao: string;
  };
}

export interface DebitoDTO {
  id: number;
  descricao: string;
  dataVencimento: string;
  valor: number;
  diasAtraso: number;
  apartamento: {
    id: number;
    numeroApartamento: string;
  };
  inquilino: {
    id: number;
    nome: string;
  };
}

export interface RelatorioGerencialResponseDTO {
  periodo: {
    dataInicio: string;
    dataFim: string;
  };
  metricas: {
    receitaTotal: number;
    despesaTotal: number;
    saldoLiquido: number;
    taxaOcupacao: number;
    totalLancamentos: number;
    lancamentosPagos: number;
    lancamentosDebito: number;
  };
  lancamentos: LancamentoRelatorioDTO[];
  apartamentosDisponiveis: ApartamentoDisponivelDTO[];
  debitos: DebitoDTO[];
}
