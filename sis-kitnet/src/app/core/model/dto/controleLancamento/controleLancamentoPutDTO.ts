import { StatusDTO } from './statusDTO';
import { ValorRegraDTO } from './valorRegraDTO';
import { ValorId } from './valorId';
import { InquilinoId } from './inquilinoId';
import { ApartamentoId } from './apartamentoId';

export interface ControleLancamentoPutDTO {
  id: number;
  dataEntrada: string;
  dataPagamento?: string;
  observacao?: string;
  status?: StatusDTO;
  valores?: ValorRegraDTO;
  valor: ValorId;
  inquilino: InquilinoId;
  apartamento: ApartamentoId;
}
