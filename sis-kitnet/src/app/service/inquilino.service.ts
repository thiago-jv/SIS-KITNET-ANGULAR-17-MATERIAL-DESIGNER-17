import { Injectable, signal, inject } from '@angular/core';
import { environment } from '../../environments/environment.dev';
import { firstValueFrom, Observable } from 'rxjs';
import { HttpClient, HttpParams } from "@angular/common/http";
import { InquilinoResponseDTO } from '../core/model/dto/inquilino/inquilinoResponseDTO';
import { InquilinoFilterDTO } from '../core/model/dto/inquilino/inquilinoFilterDTO';
import { InquilinoPostDTO } from '../core/model/dto/inquilino/inquilinoPostDTO';
import { InquilinoPutDTO } from '../core/model/dto/inquilino/inquilinoPutDTO';

@Injectable({
  providedIn: 'root'
})
export class InquilinoService {

  private http = inject(HttpClient);
  private inquilinoUrl: string = `${environment.apiUrl}/v1/inquilinos`;

  inquilinoCriado = signal<InquilinoResponseDTO | null>(null);

  async createInquilino(inquilino: InquilinoPostDTO) {
    const response = await firstValueFrom(
      this.http.post<InquilinoResponseDTO>(this.inquilinoUrl, inquilino)
    );
    this.inquilinoCriado.set(response);
    return response;
  }

  async filter(filter: InquilinoFilterDTO): Promise<{ inquilinos: InquilinoResponseDTO[], total: number }> {
    let params = new HttpParams()
      .set('page', filter.pagina)
      .set('size', filter.itensPorPagina);

    if (filter.nome) params = params.set('nome', filter.nome);
    if (filter.cpf) params = params.set('cpf', filter.cpf);
    if (filter.status) params = params.set('status', filter.status);
    if (filter.sortField && filter.sortDirection) {
      params = params.set('sort', `${filter.sortField},${filter.sortDirection}`);
    }

    const response: any = await firstValueFrom(
      this.http.get(`${this.inquilinoUrl}/filter`, { params })
    );

    return {
      inquilinos: response.content,
      total: response.totalElements
    };
  }

  async getAllInquilinos(): Promise<InquilinoResponseDTO[]> {
    const response = await firstValueFrom(
      this.http.get<InquilinoResponseDTO[]>(`${this.inquilinoUrl}/todos`)
    );
    return response;
  }

  async getAllInquilAtivos(): Promise<InquilinoResponseDTO[]> {
    const response = await firstValueFrom(
      this.http.get<InquilinoResponseDTO[]>(`${this.inquilinoUrl}/todos/ativos`)
    );
    return response;
  }

  getById(id: number): Observable<InquilinoResponseDTO> {
    return this.http.get<InquilinoResponseDTO>(`${this.inquilinoUrl}/${id}`);
  }

  async updateInquilino(id: number, dados: InquilinoPutDTO): Promise<InquilinoResponseDTO> {
   return await firstValueFrom(
    this.http.put<InquilinoResponseDTO>(`${this.inquilinoUrl}/${id}`, dados)
   );
  }

  async deleteInquilino(id: number): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${this.inquilinoUrl}/${id}`)
    );
  }

}
