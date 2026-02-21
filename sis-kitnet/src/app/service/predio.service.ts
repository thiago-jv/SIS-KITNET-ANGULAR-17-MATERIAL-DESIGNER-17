import { Injectable, signal, inject } from '@angular/core';
import { environment } from '../../environments/environment.dev';

import {firstValueFrom, Observable} from 'rxjs';
import {HttpClient, HttpParams} from "@angular/common/http";
import { PredioResponseDTO } from '../core/model/dto/predio/predioResponseDTO';
import { PredioFilterDTO } from '../core/model/dto/predio/predioFilterDTO';
import { PredioPostDTO } from '../core/model/dto/predio/predioPostDTO';

@Injectable({
  providedIn: 'root'
})
export class PredioService {

  private http = inject(HttpClient);
  private predioUrl: string = `${environment.apiUrl}/v1/predios`;

  predioCriado = signal<PredioResponseDTO | null>(null);

  async createPredio(predio: PredioPostDTO) {
    const response = await firstValueFrom(
      this.http.post<PredioResponseDTO>(this.predioUrl, predio)
    );
    this.predioCriado.set(response);
    return response;
  }

  async filter(filter: PredioFilterDTO): Promise<{ predios: PredioResponseDTO[], total: number }> {
    let params = new HttpParams()
      .set('page', filter.pagina)
      .set('size', filter.itensPorPagina);

    if (filter.descricao) params = params.set('descricao', filter.descricao);
    if (filter.numero) params = params.set('numero', filter.numero);
    if (filter.sortField && filter.sortDirection) {
      params = params.set('sort', `${filter.sortField},${filter.sortDirection}`);
    }

    const response: any = await firstValueFrom(
      this.http.get(`${this.predioUrl}/filter`, { params })
    );

    console.log('PredioService.filter raw response:', response);

    return {
      predios: response.content,
      total: response.totalElements
    };
  }

  async getAllPredios(): Promise<PredioResponseDTO[]> {
    const response = await firstValueFrom(
      this.http.get<PredioResponseDTO[]>(`${this.predioUrl}/todos`)
    );
    return response;
  }

  getById(id: number): Observable<PredioResponseDTO> {
    return this.http.get<PredioResponseDTO>(`${this.predioUrl}/${id}`);
  }

  async updatePredio(id: number, dados: PredioPostDTO): Promise<PredioResponseDTO> {
   return await firstValueFrom(
    this.http.put<PredioResponseDTO>(`${this.predioUrl}/${id}`, dados)
   );
  }

  async deletePredio(id: number): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${this.predioUrl}/${id}`)
    );
  }

  

}
