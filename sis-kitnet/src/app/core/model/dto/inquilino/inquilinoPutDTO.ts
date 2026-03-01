export interface InquilinoPutDTO {
  id: number;
  nome: string;
  nomeAbreviado: string;
  email: string;
  contato: string;
  status?: string;
  genero?: string;
  cpf: string;
}
