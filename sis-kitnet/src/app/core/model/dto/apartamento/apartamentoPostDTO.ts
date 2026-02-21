export interface PredioIdDTO {
  id: number;
}

export interface ApartamentoPostDTO {
  numeroApartamento: string;
  descricao: string;
  medidor?: string;
  statusApartamento?: string;
  predio: PredioIdDTO;
}
