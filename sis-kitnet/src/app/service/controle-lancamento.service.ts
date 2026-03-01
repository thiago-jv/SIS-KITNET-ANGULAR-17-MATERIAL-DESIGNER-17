import { Injectable, signal, inject } from '@angular/core';
import { environment } from '../../environments/environment.dev';
import { firstValueFrom, Observable } from 'rxjs';
import { HttpClient, HttpParams } from "@angular/common/http";
import { ControleLancamentoResponseDTO } from '../core/model/dto/controleLancamento/controleLancamentoResponseDTO';
import { ControleLancamentoFilterDTO } from '../core/model/dto/controleLancamento/controleLancamentoFilterDTO';
import { ControleLancamentoPostDTO } from '../core/model/dto/controleLancamento/controleLancamentoPostDTO';
import { ControleLancamentoPutDTO } from '../core/model/dto/controleLancamento/controleLancamentoPutDTO';

@Injectable({
  providedIn: 'root'
})
export class ControleLancamentoService {

  private http = inject(HttpClient);
  private controleLancamentoUrl: string = `${environment.apiUrl}/v1/controles`;

  controleLancamentoCriado = signal<ControleLancamentoResponseDTO | null>(null);

  async createControleLancamento(controleLancamento: ControleLancamentoPostDTO) {
    const response = await firstValueFrom(
      this.http.post<ControleLancamentoResponseDTO>(this.controleLancamentoUrl, controleLancamento)
    );
    this.controleLancamentoCriado.set(response);
    return response;
  }

  async filter(filter: ControleLancamentoFilterDTO): Promise<{ controleLancamentos: ControleLancamentoResponseDTO[], total: number }> {
    let params = new HttpParams()
      .set('page', filter.pagina)
      .set('size', filter.itensPorPagina);

    if (filter.dataPagamentoDe) params = params.set('dataPagamentoDe', filter.dataPagamentoDe);
    if (filter.dataPagamentoAte) params = params.set('dataPagamentoAte', filter.dataPagamentoAte);
    if (filter.entragaContaLuz) params = params.set('entragaContaLuz', filter.entragaContaLuz);
    if (filter.statusApartamePagamento) params = params.set('statusApartamePagamento', filter.statusApartamePagamento);
    if (filter.statusApartamePagamentoLuz) params = params.set('statusApartamePagamentoLuz', filter.statusApartamePagamentoLuz);
    if (filter.sortField && filter.sortDirection) {
      params = params.set('sort', `${filter.sortField},${filter.sortDirection}`);
    }

    const response: any = await firstValueFrom(
      this.http.get(`${this.controleLancamentoUrl}/filter`, { params })
    );

    return {
      controleLancamentos: response.content,
      total: response.totalElements
    };
  }

  getById(id: number): Observable<ControleLancamentoResponseDTO> {
    return this.http.get<ControleLancamentoResponseDTO>(`${this.controleLancamentoUrl}/${id}`);
  }

  async updateControleLancamento(id: number, dados: ControleLancamentoPutDTO): Promise<ControleLancamentoResponseDTO> {
   return await firstValueFrom(
    this.http.put<ControleLancamentoResponseDTO>(`${this.controleLancamentoUrl}/${id}`, dados)
   );
  }

  async updateStatus(id: number): Promise<void> {
    await firstValueFrom(
      this.http.put(`${this.controleLancamentoUrl}/${id}/status`, {})
    );
  }

  async deleteControleLancamento(id: number): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${this.controleLancamentoUrl}/${id}`)
    );
  }

  async downloadRelatorio(idLancamento: number): Promise<Blob> {
    const params = new HttpParams().set('idLancamento', idLancamento);
    return await firstValueFrom(
      this.http.get(`${this.controleLancamentoUrl}/relatorio/por-controle-lancamento`, {
        params,
        responseType: 'blob'
      })
    );
  }

}
