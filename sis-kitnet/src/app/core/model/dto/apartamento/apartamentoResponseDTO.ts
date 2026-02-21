export interface PredioIdDTO {
  id: number;
}

export interface ApartamentoResponseDTO {
  id: number;
  descricao: string;
  numeroApartamento: string;
  medidor?: string | null;
  statusApartamento: string;
  predio: {
    id: number;
  };
}


