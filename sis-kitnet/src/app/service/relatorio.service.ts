import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment.dev';
import { RelatorioGerencialFilterDTO } from '../core/model/dto/relatorio/relatorioGerencialFilterDTO';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {
  private http = inject(HttpClient);
  private relatoriosUrl = `${environment.apiUrl}/v1/controles/relatorio`;

  /**
   * Gera e baixa o relatório gerencial em PDF
   * @param filtros Filtros opcionais para o relatório
   * @param abrirNovaAba Se true, abre o PDF em nova aba. Se false, faz download
   */
  async gerarRelatorioGerencialPDF(filtros?: RelatorioGerencialFilterDTO, abrirNovaAba: boolean = false): Promise<void> {
    const params = this.construirParams(filtros);

    const blob = await firstValueFrom(
      this.http.get(`${this.relatoriosUrl}/gerencial/pdf`, {
        params,
        responseType: 'blob'
      })
    );

    if (abrirNovaAba) {
      this.abrirPdfNovaAba(blob);
    } else {
      this.baixarArquivo(blob, this.gerarNomeArquivo(filtros));
    }
  }

  private construirParams(filtros?: RelatorioGerencialFilterDTO): HttpParams {
    let params = new HttpParams();

    if (!filtros) {
      return params;
    }

    if (filtros.predioId) {
      params = params.set('predioId', filtros.predioId.toString());
    }

    if (filtros.apartamentoId) {
      params = params.set('apartamentoId', filtros.apartamentoId.toString());
    }

    if (filtros.inquilinoId) {
      params = params.set('inquilinoId', filtros.inquilinoId.toString());
    }

    if (filtros.dataInicio) {
      params = params.set('dataInicio', this.formatarData(filtros.dataInicio));
    }

    if (filtros.dataFim) {
      params = params.set('dataFim', this.formatarData(filtros.dataFim));
    }

    if (filtros.statusPagamento) {
      params = params.set('statusPagamento', filtros.statusPagamento);
    }

    return params;
  }

  private formatarData(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  private gerarNomeArquivo(filtros?: RelatorioGerencialFilterDTO): string {
    const dataInicio = filtros?.dataInicio ? this.formatarData(filtros.dataInicio) : 'inicio';
    const dataFim = filtros?.dataFim ? this.formatarData(filtros.dataFim) : 'fim';
    return `relatorio_gerencial_${dataInicio}_${dataFim}.pdf`;
  }

  private baixarArquivo(blob: Blob, nomeArquivo: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private abrirPdfNovaAba(blob: Blob): void {
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
    // Não revogar a URL imediatamente para permitir que a aba abra corretamente
    setTimeout(() => window.URL.revokeObjectURL(url), 100);
  }
}

