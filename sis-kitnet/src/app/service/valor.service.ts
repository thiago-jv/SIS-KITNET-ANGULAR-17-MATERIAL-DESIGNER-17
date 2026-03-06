import { Injectable, signal, inject } from '@angular/core';
import { environment } from '../../environments/environment.dev';

import {firstValueFrom, Observable} from 'rxjs';
import {HttpClient, HttpParams} from "@angular/common/http";
import { ValorResponseDTO } from '../core/model/dto/valor/valorResponseDTO';
import { ValorFilterDTO } from '../core/model/dto/valor/valorFilterDTO';
import { ValorPostDTO } from '../core/model/dto/valor/valorPostDTO';
import { ValorPutDTO } from '../core/model/dto/valor/valorPutDTO';

@Injectable({
  providedIn: 'root'
})
export class ValorService {

  private http = inject(HttpClient);
  private valorUrl: string = `${environment.apiUrl}/v1/valores`;

  valorCriado = signal<ValorResponseDTO | null>(null);

  async criarValor(valor: ValorPostDTO) {
    const response = await firstValueFrom(
      this.http.post<ValorResponseDTO>(this.valorUrl, valor)
    );
    this.valorCriado.set(response);
    return response;
  }

  async filtrar(filter: ValorFilterDTO): Promise<{ valores: ValorResponseDTO[], total: number }> {
    let params = new HttpParams()
      .set('page', filter.pagina)
      .set('size', filter.itensPorPagina);

    if (filter.valor) params = params.set('valor', filter.valor);
    if (filter.sortField && filter.sortDirection) {
      params = params.set('sort', `${filter.sortField},${filter.sortDirection}`);
    }

    const response: any = await firstValueFrom(
      this.http.get(`${this.valorUrl}/filter`, { params })
    );

    return {
      valores: Array.isArray(response?.content) ? response.content : [],
      total: response?.totalElements ?? 0
    };
  }

  async buscarTodosValores(): Promise<ValorResponseDTO[]> {
    const response = await firstValueFrom(
      this.http.get<ValorResponseDTO[]>(`${this.valorUrl}/todos`)
    );
    return response;
  }

  buscarPorId(id: number): Observable<ValorResponseDTO> {
    return this.http.get<ValorResponseDTO>(`${this.valorUrl}/${id}`);
  }

  async atualizarValor(id: number, dados: ValorPutDTO): Promise<ValorResponseDTO> {
   return await firstValueFrom(
    this.http.put<ValorResponseDTO>(`${this.valorUrl}/${id}`, dados)
   );
  }

  async excluirValor(id: number): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${this.valorUrl}/${id}`)
    );
  }

}
