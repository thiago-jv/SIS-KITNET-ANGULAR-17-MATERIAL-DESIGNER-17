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

  async createValor(valor: ValorPostDTO) {
    const response = await firstValueFrom(
      this.http.post<ValorResponseDTO>(this.valorUrl, valor)
    );
    this.valorCriado.set(response);
    return response;
  }

  async filter(filter: ValorFilterDTO): Promise<{ valores: ValorResponseDTO[], total: number }> {
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
      valores: response.content,
      total: response.totalElements
    };
  }

  async getAllValores(): Promise<ValorResponseDTO[]> {
    const response = await firstValueFrom(
      this.http.get<ValorResponseDTO[]>(`${this.valorUrl}/todos`)
    );
    return response;
  }

  getById(id: number): Observable<ValorResponseDTO> {
    return this.http.get<ValorResponseDTO>(`${this.valorUrl}/${id}`);
  }

  async updateValor(id: number, dados: ValorPutDTO): Promise<ValorResponseDTO> {
   return await firstValueFrom(
    this.http.put<ValorResponseDTO>(`${this.valorUrl}/${id}`, dados)
   );
  }

  async deleteValor(id: number): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${this.valorUrl}/${id}`)
    );
  }

}
