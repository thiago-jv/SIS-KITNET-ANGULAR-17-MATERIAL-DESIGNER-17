import { Component, inject, signal, OnInit, ViewChild } from '@angular/core';
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
import { MatSelect, MatSelectModule } from '@angular/material/select';
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
  prediosFiltrados = signal<PredioResponseDTO[]>([]);
  apartamentos = signal<ApartamentoResponseDTO[]>([]);
  apartamentosFiltrados = signal<ApartamentoResponseDTO[]>([]);
  inquilinos = signal<InquilinoResponseDTO[]>([]);
  inquilinosFiltrados = signal<InquilinoResponseDTO[]>([]);

  // Filtros de pesquisa
  filtroPredio = '';
  filtroApartamento = '';
  filtroInquilino = '';

  @ViewChild('predioSelect') predioSelect?: MatSelect;
  @ViewChild('apartamentoSelect') apartamentoSelect?: MatSelect;
  @ViewChild('inquilinoSelect') inquilinoSelect?: MatSelect;

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
      
      this.aplicarFiltroPredios();
      this.aplicarFiltroApartamentos();
      this.aplicarFiltroInquilinos();
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

  // Métodos de filtro para Prédio
  onFiltroPredioInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.filtroPredio = target.value ?? '';
    this.aplicarFiltroPredios();
  }

  limparFiltroPredio(event: MouseEvent): void {
    event.stopPropagation();
    this.filtroPredio = '';
    this.aplicarFiltroPredios();
  }

  onPredioOpened(opened: boolean): void {
    if (!opened) return;
    this.filtroPredio = '';
    this.aplicarFiltroPredios();
    setTimeout(() => {
      const panel = this.predioSelect?.panel?.nativeElement as HTMLElement | undefined;
      panel?.scrollTo({ top: 0 });
      const input = document.getElementById('filtro-predio-input') as HTMLInputElement | null;
      input?.focus();
    });
  }

  limparPredioSelecionado(event: MouseEvent): void {
    event.stopPropagation();
    this.predioId.set(null);
    this.filtroPredio = '';
    this.aplicarFiltroPredios();
  }

  private aplicarFiltroPredios(): void {
    const termo = this.normalizarTexto(this.filtroPredio);
    if (!termo) {
      this.prediosFiltrados.set([...this.predios()]);
      return;
    }
    const filtrados = this.predios().filter(predio => {
      const texto = `${predio.numero} ${predio.descricao ?? ''}`;
      return this.normalizarTexto(texto).includes(termo);
    });
    this.prediosFiltrados.set(filtrados);
  }

  // Métodos de filtro para Apartamento
  onFiltroApartamentoInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.filtroApartamento = target.value ?? '';
    this.aplicarFiltroApartamentos();
  }

  limparFiltroApartamento(event: MouseEvent): void {
    event.stopPropagation();
    this.filtroApartamento = '';
    this.aplicarFiltroApartamentos();
  }

  onApartamentoOpened(opened: boolean): void {
    if (!opened) return;
    this.filtroApartamento = '';
    this.aplicarFiltroApartamentos();
    setTimeout(() => {
      const panel = this.apartamentoSelect?.panel?.nativeElement as HTMLElement | undefined;
      panel?.scrollTo({ top: 0 });
      const input = document.getElementById('filtro-apartamento-input') as HTMLInputElement | null;
      input?.focus();
    });
  }

  limparApartamentoSelecionado(event: MouseEvent): void {
    event.stopPropagation();
    this.apartamentoId.set(null);
    this.filtroApartamento = '';
    this.aplicarFiltroApartamentos();
  }

  private aplicarFiltroApartamentos(): void {
    const termo = this.normalizarTexto(this.filtroApartamento);
    if (!termo) {
      this.apartamentosFiltrados.set([...this.apartamentos()]);
      return;
    }
    const filtrados = this.apartamentos().filter(apartamento => {
      const texto = `${apartamento.numeroApartamento} ${apartamento.descricao ?? ''}`;
      return this.normalizarTexto(texto).includes(termo);
    });
    this.apartamentosFiltrados.set(filtrados);
  }

  // Métodos de filtro para Inquilino
  onFiltroInquilinoInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.filtroInquilino = target.value ?? '';
    this.aplicarFiltroInquilinos();
  }

  limparFiltroInquilino(event: MouseEvent): void {
    event.stopPropagation();
    this.filtroInquilino = '';
    this.aplicarFiltroInquilinos();
  }

  onInquilinoOpened(opened: boolean): void {
    if (!opened) return;
    this.filtroInquilino = '';
    this.aplicarFiltroInquilinos();
    setTimeout(() => {
      const panel = this.inquilinoSelect?.panel?.nativeElement as HTMLElement | undefined;
      panel?.scrollTo({ top: 0 });
      const input = document.getElementById('filtro-inquilino-input') as HTMLInputElement | null;
      input?.focus();
    });
  }

  limparInquilinoSelecionado(event: MouseEvent): void {
    event.stopPropagation();
    this.inquilinoId.set(null);
    this.filtroInquilino = '';
    this.aplicarFiltroInquilinos();
  }

  private aplicarFiltroInquilinos(): void {
    const termo = this.normalizarTexto(this.filtroInquilino);
    if (!termo) {
      this.inquilinosFiltrados.set([...this.inquilinos()]);
      return;
    }
    const filtrados = this.inquilinos().filter(inquilino =>
      this.normalizarTexto(inquilino.nome).includes(termo)
    );
    this.inquilinosFiltrados.set(filtrados);
  }

  private normalizarTexto(valor: string | null | undefined): string {
    return (valor ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
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
