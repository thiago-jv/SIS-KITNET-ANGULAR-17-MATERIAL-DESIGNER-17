import { StatusDTO } from './statusDTO';
import { ValorRegraDTO } from './valorRegraDTO';
import { ValorId } from './valorId';
import { InquilinoId } from './inquilinoId';
import { ApartamentoId } from './apartamentoId';

export interface ControleLancamentoResponseDTO {
  id: number;
  dataLancamento: string;
  dataEntrada: string;
  dataPagamento?: string;
  observacao?: string;
  status?: StatusDTO;
  valores?: ValorRegraDTO;
  valor: ValorId;
  inquilino: InquilinoId;
  apartamento: ApartamentoId;
}
