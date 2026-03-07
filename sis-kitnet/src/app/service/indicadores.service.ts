import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment.dev';
import { IndicadoresResumoDTO } from '../core/model/dto/indicadores/indicadoresResumoDTO';

@Injectable({
  providedIn: 'root'
})
export class IndicadoresService {
  private http = inject(HttpClient);
  private indicadoresUrl = `${environment.apiUrl}/v1/indicadores`;

  async obterResumo(dataInicio?: Date, dataFim?: Date, status?: string): Promise<IndicadoresResumoDTO> {
    let params = new HttpParams();
    
    if (dataInicio) {
      params = params.set('dataInicio', this.formatarData(dataInicio));
    }
    
    if (dataFim) {
      params = params.set('dataFim', this.formatarData(dataFim));
    }

    if (status) {
      params = params.set('status', status);
    }
    
    return await firstValueFrom(
      this.http.get<IndicadoresResumoDTO>(`${this.indicadoresUrl}/resumo`, { params })
    );
  }

  private formatarData(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }
}
