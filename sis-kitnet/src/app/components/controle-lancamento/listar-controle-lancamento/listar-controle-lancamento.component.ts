import { Component, ViewChild, AfterViewInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { DialogExclusaoComponent } from '../../../shared/dialog-exclusao/dialog-exclusao.component';
import { RenovarLancamentoDialogComponent } from '../shared/renovar-lancamento-dialog/renovar-lancamento-dialog.component';
import { ControleLancamentoService } from '../../../service/controle-lancamento.service';
import { InquilinoService } from '../../../service/inquilino.service';
import { ApartamentoService } from '../../../service/apartamento.service';
import { PredioService } from '../../../service/predio.service';
import { ErrorHandlerService } from '../../../service/error-handler.service';
import { Constants } from '../../../util/constantes';
import { ControleLancamentoResponseDTO } from '../../../core/model/dto/controleLancamento/controleLancamentoResponseDTO';
import { ControleLancamentoFilterDTO } from '../../../core/model/dto/controleLancamento/controleLancamentoFilterDTO';
import { InquilinoResponseDTO } from '../../../core/model/dto/inquilino/inquilinoResponseDTO';
import { ApartamentoResponseDTO } from '../../../core/model/dto/apartamento/apartamentoResponseDTO';
import { PredioResponseDTO } from '../../../core/model/dto/predio/predioResponseDTO';

@Component({
  selector: 'app-listar-controle-lancamento',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatSortModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatDividerModule,
    ReactiveFormsModule
  ],
  templateUrl: './listar-controle-lancamento.component.html',
  styleUrls: ['./listar-controle-lancamento.component.scss']
})
export class ListarControleLancamentoComponent implements AfterViewInit {

  private service = inject(ControleLancamentoService);
  private inquilinoService = inject(InquilinoService);
  private apartamentoService = inject(ApartamentoService);
  private predioService = inject(PredioService);
  private dialog = inject(MatDialog);
  private errorHandler = inject(ErrorHandlerService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // MatTableDataSource para integração com MatSort
  dataSource = new MatTableDataSource<ControleLancamentoResponseDTO>();

  totalRegistros = signal(0);
  
  // Set com IDs dos últimos lançamentos por inquilino
  ultimosLancamentosPorInquilino = new Set<number>();

  // Filtros
  dataPagamentoDeFiltro = signal<string | undefined>(undefined);
  dataPagamentoAteFiltro = signal<string | undefined>(undefined);
  minDateAte = signal<Date | null>(null);
  statusApartamePagamentoFiltro = signal<string | undefined>(undefined);
  inquilinoIdFiltro = signal<number | undefined>(undefined);
  apartamentoIdFiltro = signal<number | undefined>(undefined);
  predioIdFiltro = signal<number | undefined>(undefined);

  // Listas para os selects
  inquilinos = signal<InquilinoResponseDTO[]>([]);
  inquilinosFiltrados = signal<InquilinoResponseDTO[]>([]);
  apartamentos = signal<ApartamentoResponseDTO[]>([]);
  apartamentosFiltrados = signal<ApartamentoResponseDTO[]>([]);
  predios = signal<PredioResponseDTO[]>([]);
  prediosFiltrados = signal<PredioResponseDTO[]>([]);

  // Filtros de pesquisa
  filtroPredio = '';
  filtroApartamento = '';
  filtroInquilino = '';

  @ViewChild('predioSelect') predioSelect?: MatSelect;
  @ViewChild('apartamentoSelect') apartamentoSelect?: MatSelect;
  @ViewChild('inquilinoSelect') inquilinoSelect?: MatSelect;

  // Opções para os selects de status
  statusOptions = [
    { label: 'Todos', value: '' },
    { label: 'Pago', value: Constants.STATUS_PAGO },
    { label: 'Débito', value: 'DEBITO' }
  ];

  // Form controls para os selects
  statusApartamentoControl = new FormControl('');
  inquilinoControl = new FormControl('');
  apartamentoControl = new FormControl('');
  predioControl = new FormControl('');
  dataPagamentoDeControl = new FormControl<Date | null>(null);
  dataPagamentoAteControl = new FormControl<Date | null>(null);

  // Paginação
  paginaAtual = signal(0);
  itensPorPagina = signal(5);

  // Ordenação
  ordemCampo = signal<string | null>(null);
  ordemDirecao = signal<'asc' | 'desc' | ''>('');

  displayedColumns = [
    'id',
    'inquilino',
    'apartamento',
    'dataEntrada',
    'dataPagamento',
    'statusApartamePagamento',
    'valorApartamento',
    'valorDebitoApartamento',
    'statusControle',
    'acoes'
  ];

  ngAfterViewInit() {
    // Vincula MatSort à dataSource
    this.dataSource.sort = this.sort;

    this.carregarListasParaFiltros();
    this.carregarDados();

    // Paginação
    this.paginator.page.subscribe(page => {
      this.paginaAtual.set(page.pageIndex);
      this.itensPorPagina.set(page.pageSize);
      this.carregarDados();
    });

    // Ordenação
    this.sort.sortChange.subscribe((sort: Sort) => {
      this.ordemCampo.set(sort.active);
      this.ordemDirecao.set(sort.direction as 'asc' | 'desc' | '');
      this.paginaAtual.set(0);
      this.carregarDados();
    });
  }

  private async carregarListasParaFiltros() {
    try {
      const [inquilinos, apartamentos, predios] = await Promise.all([
        this.inquilinoService.buscarTodosInquilinos(),
        this.apartamentoService.buscarTodosApartamentos(),
        this.predioService.buscarTodosPredios()
      ]);
      
      this.inquilinos.set(inquilinos);
      this.apartamentos.set(apartamentos);
      this.predios.set(predios);
      
      this.aplicarFiltroInquilinos();
      this.aplicarFiltroApartamentos();
      this.aplicarFiltroPredios();
    } catch (error: any) {
      this.errorHandler.exibirErro(error, 'carregar listas de filtros');
    }
  }
  
  private async carregarDados() {
    const filtro: ControleLancamentoFilterDTO = {
      pagina: this.paginaAtual(),
      itensPorPagina: this.itensPorPagina(),
      dataPagamentoDe: this.dataPagamentoDeFiltro(),
      dataPagamentoAte: this.dataPagamentoAteFiltro(),
      statusApartamePagamento: this.statusApartamePagamentoFiltro(),
      inquilinoId: this.inquilinoIdFiltro(),
      apartamentoId: this.apartamentoIdFiltro(),
      predioId: this.predioIdFiltro(),
      sortField: this.ordemCampo() || undefined,
      sortDirection: this.ordemDirecao() || undefined
    };

    try {
      const result = await this.service.filtrar(filtro);
      this.dataSource.data = result.controleLancamentos;
      this.totalRegistros.set(result.total);
      
      // Identificar último lançamento por inquilino
      this.identificarUltimosLancamentosPorInquilino(result.controleLancamentos);
    } catch (error: any) {
      this.errorHandler.exibirErro(error, 'carregar controle de lançamentos');
    }
  }
  
  private identificarUltimosLancamentosPorInquilino(lancamentos: ControleLancamentoResponseDTO[]) {
    this.ultimosLancamentosPorInquilino.clear();
    
    // Agrupar por inquilino e encontrar o ID mais alto (último registro)
    const mapaInquilinos = new Map<number, number>();
    
    lancamentos.forEach(lancamento => {
      const inquilinoId = lancamento.inquilino?.id;
      const lancamentoId = lancamento.id;
      
      if (inquilinoId && lancamentoId) {
        const idAtual = mapaInquilinos.get(inquilinoId);
        if (!idAtual || lancamentoId > idAtual) {
          mapaInquilinos.set(inquilinoId, lancamentoId);
        }
      }
    });
    
    // Adicionar os IDs dos últimos lançamentos ao Set
    mapaInquilinos.forEach(lancamentoId => {
      this.ultimosLancamentosPorInquilino.add(lancamentoId);
    });
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
    this.predioControl.setValue('');
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
    this.apartamentoControl.setValue('');
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
    this.inquilinoControl.setValue('');
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

  aplicarFiltros() {
    // Atualizar filtros a partir dos FormControls
    const statusValue = this.statusApartamentoControl.value;
    this.statusApartamePagamentoFiltro.set(statusValue || undefined);

    const inquilinoValue = this.inquilinoControl.value;
    this.inquilinoIdFiltro.set(inquilinoValue ? Number(inquilinoValue) : undefined);

    const apartamentoValue = this.apartamentoControl.value;
    this.apartamentoIdFiltro.set(apartamentoValue ? Number(apartamentoValue) : undefined);

    const predioValue = this.predioControl.value;
    this.predioIdFiltro.set(predioValue ? Number(predioValue) : undefined);

    const dataDe = this.dataPagamentoDeControl.value;
    if (dataDe) {
      const formattedDate = dataDe.toISOString().split('T')[0];
      this.dataPagamentoDeFiltro.set(formattedDate);
      this.minDateAte.set(dataDe);
    } else {
      this.dataPagamentoDeFiltro.set(undefined);
      this.minDateAte.set(null);
    }

    const dataAte = this.dataPagamentoAteControl.value;
    if (dataAte) {
      const formattedDate = dataAte.toISOString().split('T')[0];
      this.dataPagamentoAteFiltro.set(formattedDate);
    } else {
      this.dataPagamentoAteFiltro.set(undefined);
    }

    this.paginaAtual.set(0);
    this.carregarDados();
  }

  limparFiltros() {
    this.statusApartamentoControl.setValue('');
    this.inquilinoControl.setValue('');
    this.apartamentoControl.setValue('');
    this.predioControl.setValue('');
    this.dataPagamentoDeControl.setValue(null);
    this.dataPagamentoAteControl.setValue(null);

    this.statusApartamePagamentoFiltro.set(undefined);
    this.inquilinoIdFiltro.set(undefined);
    this.apartamentoIdFiltro.set(undefined);
    this.predioIdFiltro.set(undefined);
    this.dataPagamentoDeFiltro.set(undefined);
    this.dataPagamentoAteFiltro.set(undefined);
    this.minDateAte.set(null);

    this.paginaAtual.set(0);
    this.carregarDados();
  }

  async excluir(id: number) {
    const ref = this.dialog.open(DialogExclusaoComponent, {
      width: '450px',
      data: { dado: 'controle de lançamento ' + id }
    });

    ref.afterClosed().subscribe(async confirmado => {
      if (confirmado) {
        try {
          await this.service.excluirControleLancamento(id);
          this.errorHandler.exibirSucesso(Constants.EXCLUIDO_COM_SUCESSO);
          this.carregarDados();
        } catch (error: any) {
          this.errorHandler.exibirErro(error, 'excluir controle de lançamento');
        }
      }
    });
  }

  async atualizarStatus(id: number) {
    try {
      await this.service.atualizarStatus(id);
      this.errorHandler.exibirSucesso(Constants.STATUS_ATUALIZADO_COM_SUCESSO);
      this.carregarDados();
    } catch (error: any) {
      this.errorHandler.exibirErro(error, 'atualizar status');
    }
  }

  async baixarRelatorio(id: number) {
    try {
      const blob = await this.service.baixarRelatorio(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `controle-lancamento-${id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      this.errorHandler.exibirSucesso(Constants.RELATORIO_BAIXADO_COM_SUCESSO);
    } catch (error: any) {
      this.errorHandler.exibirErro(error, 'baixar relatório');
    }
  }

  async renovar(lancamento: ControleLancamentoResponseDTO) {
    // Abre modal informativo
    const ref = this.dialog.open(RenovarLancamentoDialogComponent, {
      width: '900px',
      data: { 
        idLancamento: lancamento.id,
        lancamento: lancamento
      }
    });

    ref.afterClosed().subscribe(async (resultado) => {
      if (resultado?.confirmado) {
        try {
          // Por enquanto ainda usa o método antigo que só aceita quantidade de meses
          // TODO: Implementar novo endpoint que aceite dados editáveis
          await this.service.renovarLancamento(lancamento.id!, 1);
          this.errorHandler.exibirSucesso(Constants.LANCAMENTO_CRIADO_COM_SUCESSO, 4000);
          this.carregarDados();
        } catch (error: any) {
          this.errorHandler.exibirErro(error, 'renovar lançamento');
        }
      }
    });
  }

  estaVencido(dataPagamento: string | undefined): boolean {
    if (!dataPagamento) return false;
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const data = new Date(dataPagamento);
    data.setHours(0, 0, 0, 0);
    
    return data <= hoje;
  }

  obterStatus(item: ControleLancamentoResponseDTO | null | undefined) {
    return item?.status ?? { statusControle: null, statusApartamePagamento: null };
  }

  obterStatusControle(item: ControleLancamentoResponseDTO | null | undefined): boolean {
    return this.obterStatus(item).statusControle ?? true;
  }

  obterStatusApartamePagamento(item: ControleLancamentoResponseDTO | null | undefined): string {
    return this.obterStatus(item).statusApartamePagamento ?? '';
  }

  podeEditar(item: ControleLancamentoResponseDTO): boolean {
    return this.obterStatusControle(item) !== false;
  }

  obterDicaEdicao(item: ControleLancamentoResponseDTO): string {
    if (this.obterStatusControle(item) === false) {
      return 'Lançamento fechado - não é possível editar';
    }
    return '';
  }

  podeRenovar(item: ControleLancamentoResponseDTO): boolean {
    // Verifica se é o último lançamento do inquilino
    return item.id ? this.ultimosLancamentosPorInquilino.has(item.id) : false;
  }

  obterDicaRenovacao(item: ControleLancamentoResponseDTO): string {
    if (!item.id || !this.ultimosLancamentosPorInquilino.has(item.id)) {
      return 'Apenas o último lançamento do inquilino pode ser renovado';
    }
    return '';
  }

  podeDeletar(item: ControleLancamentoResponseDTO): boolean {
    return this.obterStatusControle(item) !== false;
  }

  obterDicaDelecao(item: ControleLancamentoResponseDTO): string {
    if (this.obterStatusControle(item) === false) {
      return 'Lançamento fechado - não é possível excluir';
    }
    return '';
  }

  obterClasseBadgePagamento(status: string | null | undefined): Record<string, boolean> {
    return {
      'badge-paid': status === Constants.STATUS_PAGO,
      'badge-debit': status !== Constants.STATUS_PAGO
    };
  }

  obterClasseStatusControle(item: ControleLancamentoResponseDTO): Record<string, boolean> {
    return {
      'status-link-open': this.obterStatusControle(item),
      'status-link-closed': !this.obterStatusControle(item)
    };
  }

  obterTextoStatusControle(item: ControleLancamentoResponseDTO): string {
    return this.obterStatusControle(item) ? 'Aberto' : 'Fechado';
  }

  obterTooltipStatusControle(item: ControleLancamentoResponseDTO): string {
    return this.obterStatusControle(item)
      ? 'Aberto — clique para fechar'
      : 'Fechado — clique para abrir';
  }
}
