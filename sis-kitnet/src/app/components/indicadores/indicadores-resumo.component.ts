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
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
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
    MatToolbarModule,
    MatSelectModule,
    MatDividerModule
  ],
  templateUrl: './indicadores-resumo.component.html',
  styleUrl: './indicadores-resumo.component.scss'
})
export class IndicadoresResumoComponent implements OnInit {
  private indicadoresService = inject(IndicadoresService);

  carregando = signal(false);
  erro = signal<string | null>(null);
  dataInicial = signal<Date | null>(null);
  dataFinal = signal<Date | null>(null);
  status = signal<string>('AMBOS');

  statusOptions = [
    { value: 'ABERTO', label: 'Abertos' },
    { value: 'FECHADO', label: 'Fechados' },
    { value: 'AMBOS', label: 'Todos' }
  ];

  resumo = signal<IndicadoresResumoDTO>({
    totalApartamentos: 0,
    totalApartamentosAlugados: 0,
    totalApartamentosVagos: 0,
    receitaPrevista: 0,
    totalRecebido: 0,
    totalDebito: 0,
    totalEmAberto: 0,
    taxaOcupacao: 0,
    taxaInadimplencia: 0,
    taxaPagamento: 0,
    totalPagamentos: 0,
    pagamentosVencidos: 0
  });

  ngOnInit(): void {
    this.setarDatasMesAtual();
    this.carregarResumo();
  }

  async carregarResumo(): Promise<void> {
    if (!this.dataInicial() || !this.dataFinal()) {
      this.erro.set('As datas inicial e final são obrigatórias.');
      return;
    }

    this.carregando.set(true);
    this.erro.set(null);

    try {
      const dados = await this.indicadoresService.obterResumo(
        this.dataInicial() || undefined,
        this.dataFinal() || undefined,
        this.status()
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
    this.dataInicial.set(null);
    this.dataFinal.set(null);
    this.status.set('ABERTO');
    this.carregarResumo();
  }

  formatarMoeda(valor: number | null | undefined): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor ?? 0);
  }

  setarDatasMesAtual(): void {
    const now = new Date();
    const primeiroDia = new Date(now.getFullYear(), now.getMonth(), 1);
    const ultimoDia = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    this.dataInicial.set(primeiroDia);
    this.dataFinal.set(ultimoDia);
  }
  
}
