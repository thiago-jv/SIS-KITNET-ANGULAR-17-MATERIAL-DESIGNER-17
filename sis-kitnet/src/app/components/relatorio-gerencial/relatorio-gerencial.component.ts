import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { RelatorioService } from '../../service/relatorio.service';
import { PredioService } from '../../service/predio.service';
import { ApartamentoService } from '../../service/apartamento.service';
import { InquilinoService } from '../../service/inquilino.service';
import { Constants } from '../../util/constantes';
import { RelatorioGerencialFilterDTO } from '../../core/model/dto/relatorio/relatorioGerencialFilterDTO';
import { PredioResponseDTO } from '../../core/model/dto/predio/predioResponseDTO';
import { ApartamentoResponseDTO } from '../../core/model/dto/apartamento/apartamentoResponseDTO';
import { InquilinoResponseDTO } from '../../core/model/dto/inquilino/inquilinoResponseDTO';

@Component({
  selector: 'app-relatorio-gerencial',
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
    MatCardModule,
    MatToolbarModule,
    MatSelectModule,
    MatDividerModule
  ],
  templateUrl: './relatorio-gerencial.component.html',
  styleUrl: './relatorio-gerencial.component.scss'
})
export class RelatorioGerencialComponent implements OnInit {
  private relatorioService = inject(RelatorioService);
  private predioService = inject(PredioService);
  private apartamentoService = inject(ApartamentoService);
  private inquilinoService = inject(InquilinoService);
  private snackBar = inject(MatSnackBar);

  carregando = signal(false);
  carregandoDados = signal(false);
  
  // Filtros
  predioId = signal<number | null>(null);
  apartamentoId = signal<number | null>(null);
  inquilinoId = signal<number | null>(null);
  dataInicio = signal<Date | null>(this.getPrimeiroDiaMesAtual());
  dataFim = signal<Date | null>(this.getUltimoDiaMesAtual());
  statusPagamentoSelecionado: 'TODOS' | 'PAGO' | 'DEBITO' = 'TODOS';

  // Listas para os selects
  predios = signal<PredioResponseDTO[]>([]);
  apartamentos = signal<ApartamentoResponseDTO[]>([]);
  inquilinos = signal<InquilinoResponseDTO[]>([]);

  statusOptions = [
    { value: 'TODOS', label: 'Todos' },
    { value: 'PAGO', label: 'Pagos' },
    { value: 'DEBITO', label: 'Em Débito' }
  ];

  async ngOnInit(): Promise<void> {
    await this.carregarDadosIniciais();
  }

  async carregarDadosIniciais(): Promise<void> {
    try {
      this.carregandoDados.set(true);
      const [predios, apartamentos, inquilinos] = await Promise.all([
        this.predioService.buscarTodosPredios(),
        this.apartamentoService.buscarTodosApartamentos(),
        this.inquilinoService.buscarTodosInquilinos()
      ]);

      this.predios.set(predios);
      this.apartamentos.set(apartamentos);
      this.inquilinos.set(inquilinos);
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
      this.snackBar.open('Erro ao carregar dados. Tente novamente.', 'Fechar', {
        duration: 5000,
        panelClass: ['snackbar-error']
      });
    } finally {
      this.carregandoDados.set(false);
    }
  }

  async gerarPDF(abrirNovaAba: boolean = false): Promise<void> {
    try {
      this.carregando.set(true);
      const filtros = this.construirFiltros();
      await this.relatorioService.gerarRelatorioGerencialPDF(filtros, abrirNovaAba);
      
      this.snackBar.open(
        abrirNovaAba ? 'PDF aberto em nova aba' : Constants.RELATORIO_BAIXADO_COM_SUCESSO,
        'Fechar',
        {
          duration: 3000,
          panelClass: ['snackbar-success']
        }
      );
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      this.snackBar.open('Erro ao gerar PDF. Tente novamente.', 'Fechar', {
        duration: 5000,
        panelClass: ['snackbar-error']
      });
    } finally {
      this.carregando.set(false);
    }
  }

  limparFiltros(): void {
    this.predioId.set(null);
    this.apartamentoId.set(null);
    this.inquilinoId.set(null);
    this.dataInicio.set(this.getPrimeiroDiaMesAtual());
    this.dataFim.set(this.getUltimoDiaMesAtual());
    this.statusPagamentoSelecionado = 'TODOS';
  }

  private construirFiltros(): RelatorioGerencialFilterDTO {
    const filtros: RelatorioGerencialFilterDTO = {};

    const predio = this.predioId();
    const apartamento = this.apartamentoId();
    const inquilino = this.inquilinoId();
    const inicio = this.dataInicio();
    const fim = this.dataFim();
    const status = this.statusPagamentoSelecionado;

    if (predio) filtros.predioId = predio;
    if (apartamento) filtros.apartamentoId = apartamento;
    if (inquilino) filtros.inquilinoId = inquilino;
    if (inicio) filtros.dataInicio = inicio;
    if (fim) filtros.dataFim = fim;
    filtros.statusPagamento = status;

    return filtros;
  }

  private getPrimeiroDiaMesAtual(): Date {
    const hoje = new Date();
    return new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  }

  private getUltimoDiaMesAtual(): Date {
    const hoje = new Date();
    return new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
  }

}
