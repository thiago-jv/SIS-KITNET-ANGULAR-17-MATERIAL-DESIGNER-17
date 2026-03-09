export interface InquilinoPutDTO {
  id: number;
  nome: string;
  nomeAbreviado?: string | null;
  email?: string | null;
  contato?: string | null;
  status?: string;
  genero?: string;
  cpf?: string | null;
  rg?: string | null;
}
