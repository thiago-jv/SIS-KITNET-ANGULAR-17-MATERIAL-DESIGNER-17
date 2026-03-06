import { Injectable, signal, inject } from '@angular/core';
import { environment } from '../../environments/environment.dev';

import {firstValueFrom, Observable} from 'rxjs';
import {ApartamentoResponseDTO} from "../core/model/dto/apartamento/apartamentoResponseDTO";
import {ApartamentoPostDTO} from "../core/model/dto/apartamento/apartamentoPostDTO";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ApartamentoFilterDTO} from "../core/model/dto/apartamento/apartamentoFilterDTO";

@Injectable({
  providedIn: 'root'
})
export class ApartamentoService {

  private http = inject(HttpClient);
  private apartamentoUrl: string = `${environment.apiUrl}/apartamentos`;

  apartamentoCriado = signal<ApartamentoResponseDTO | null>(null);

  async criarApartamento(apartamento: ApartamentoPostDTO) {
    const response = await firstValueFrom(
      this.http.post<ApartamentoResponseDTO>(this.apartamentoUrl, apartamento)
    );
    this.apartamentoCriado.set(response);
    return response;
  }

  async filtrar(filter: ApartamentoFilterDTO): Promise<{ apartamentos: ApartamentoResponseDTO[], total: number }> {
    let params = new HttpParams()
      .set('page', filter.pagina)
      .set('size', filter.itensPorPagina);

    if (filter.descricao) params = params.set('descricao', filter.descricao);
    if (filter.numeroApartamento) params = params.set('numeroApartamento', filter.numeroApartamento);
    if (filter.sortField && filter.sortDirection) {
      params = params.set('sort', `${filter.sortField},${filter.sortDirection}`);
    }

    const response: any = await firstValueFrom(
      this.http.get(`${this.apartamentoUrl}/filter`, { params })
    );

    return {
      apartamentos: Array.isArray(response?.content) ? response.content : [],
      total: response?.totalElements ?? 0
    };
  }

  buscarPorId(id: number): Observable<ApartamentoResponseDTO> {
    return this.http.get<ApartamentoResponseDTO>(`${this.apartamentoUrl}/${id}`);
  }

  async buscarTodosApartamentos(): Promise<ApartamentoResponseDTO[]> {
    const response = await firstValueFrom(
      this.http.get<ApartamentoResponseDTO[]>(`${this.apartamentoUrl}/todos`)
    );
    return response;
  }

  async atualizarApartamento(id: number, dados: ApartamentoPostDTO): Promise<ApartamentoResponseDTO> {
   return await firstValueFrom(
    this.http.put<ApartamentoResponseDTO>(`${this.apartamentoUrl}/${id}`, dados));
  }


  async excluirApartamento(id: number): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${this.apartamentoUrl}/${id}`)
    );
  }

}
