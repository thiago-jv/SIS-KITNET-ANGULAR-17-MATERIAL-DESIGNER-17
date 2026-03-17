import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { MovimentoFinanceiroPostDTO } from '../core/model/dto/movimento-financeiro/movimentoFinanceiroPostDTO';
import { MovimentoFinanceiroResponseDTO } from '../core/model/dto/movimento-financeiro/movimentoFinanceiroResponseDTO';
  
@Injectable({ providedIn: 'root' })
export class MovimentoFinanceiroService {

  private apiUrl = `${environment.apiUrl}/v1/financeiro/movimentos`;

  constructor(private http: HttpClient) {}

  criarMovimento(dto: MovimentoFinanceiroPostDTO): Observable<MovimentoFinanceiroResponseDTO> {
    return this.http.post<MovimentoFinanceiroResponseDTO>(this.apiUrl, dto);
  }

  listarTodos(): Observable<MovimentoFinanceiroResponseDTO[]> {
    return this.http.get<MovimentoFinanceiroResponseDTO[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<MovimentoFinanceiroResponseDTO> {
    return this.http.get<MovimentoFinanceiroResponseDTO>(`${this.apiUrl}/${id}`);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  filtrarPorData(
    dataInicio?: string,
    dataFim?: string,
    page: number = 0,
    size: number = 10
  ): Observable<any> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (dataInicio) params = params.set('dataInicio', dataInicio);
    if (dataFim) params = params.set('dataFim', dataFim);
    return this.http.get<any>(`${this.apiUrl}/filter`, { params });
  }

  atualizarMovimento(id: number, dto: MovimentoFinanceiroPostDTO): Observable<MovimentoFinanceiroResponseDTO> {
    return this.http.put<MovimentoFinanceiroResponseDTO>(`${this.apiUrl}/${id}`, dto);
  }
  
}
