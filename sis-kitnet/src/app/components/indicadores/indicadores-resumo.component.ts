import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { IndicadoresService } from '../../service/indicadores.service';
import { IndicadoresResumoDTO } from '../../core/model/dto/indicadores/indicadoresResumoDTO';

@Component({
  selector: 'app-indicadores-resumo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatToolbarModule
  ],
  templateUrl: './indicadores-resumo.component.html',
  styleUrl: './indicadores-resumo.component.scss'
})
export class IndicadoresResumoComponent implements OnInit {
  private indicadoresService = inject(IndicadoresService);

  carregando = signal(false);
  erro = signal<string | null>(null);
  dataInicio = signal<Date | null>(null);
  dataFim = signal<Date | null>(null);

  resumo = signal<IndicadoresResumoDTO>({
    totalApartamentos: 0,
    totalApartamentosAlugados: 0,
    totalApartamentosVagos: 0,
    somaAlugueisEmAberto: 0,
    totalDebitoReal: 0
  });

  ngOnInit(): void {
    this.carregarResumo();
  }

  async carregarResumo(): Promise<void> {
    this.carregando.set(true);
    this.erro.set(null);

    try {
      const dados = await this.indicadoresService.obterResumo(
        this.dataInicio() || undefined,
        this.dataFim() || undefined
      );
      this.resumo.set(dados);
    } catch {
      this.erro.set('Não foi possível carregar os indicadores.');
    } finally {
      this.carregando.set(false);
    }
  }

  aplicarFiltro(): void {
    this.carregarResumo();
  }

  limparFiltro(): void {
    this.dataInicio.set(null);
    this.dataFim.set(null);
    this.carregarResumo();
  }

  formatarMoeda(valor: number | null | undefined): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor ?? 0);
  }
}
