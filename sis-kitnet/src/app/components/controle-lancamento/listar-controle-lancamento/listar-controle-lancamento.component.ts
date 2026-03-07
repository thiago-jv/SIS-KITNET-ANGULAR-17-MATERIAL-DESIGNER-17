import { Component, ViewChild, AfterViewInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
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
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { DialogExclusaoComponent } from '../../../shared/dialog-exclusao/dialog-exclusao.component';
import { RenovarLancamentoDialogComponent } from '../shared/renovar-lancamento-dialog/renovar-lancamento-dialog.component';
import { ControleLancamentoService } from '../../../service/controle-lancamento.service';
import { ErrorHandlerService } from '../../../service/error-handler.service';
import { Constants } from '../../../util/constantes';
import { ControleLancamentoResponseDTO } from '../../../core/model/dto/controleLancamento/controleLancamentoResponseDTO';
import { ControleLancamentoFilterDTO } from '../../../core/model/dto/controleLancamento/controleLancamentoFilterDTO';

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
    ReactiveFormsModule
  ],
  templateUrl: './listar-controle-lancamento.component.html',
  styleUrls: ['./listar-controle-lancamento.component.scss']
})
export class ListarControleLancamentoComponent implements AfterViewInit {

  private service = inject(ControleLancamentoService);
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

  // Opções para os selects de status
  statusOptions = [
    { label: 'Todos', value: '' },
    { label: 'Pago', value: Constants.STATUS_PAGO },
    { label: 'Débito', value: 'DEBITO' }
  ];

  // Form controls para os selects
  statusApartamentoControl = new FormControl('');

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

    // Subscribe aos filtros de status
    this.statusApartamentoControl.valueChanges.subscribe(value => {
      this.statusApartamePagamentoFiltro.set(value || undefined);
      this.atualizarFiltro();
    });
  }
  
  private async carregarDados() {
    const filtro: ControleLancamentoFilterDTO = {
      pagina: this.paginaAtual(),
      itensPorPagina: this.itensPorPagina(),
      dataPagamentoDe: this.dataPagamentoDeFiltro(),
      dataPagamentoAte: this.dataPagamentoAteFiltro(),
      statusApartamePagamento: this.statusApartamePagamentoFiltro(),
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

  atualizarFiltro() {
    this.paginaAtual.set(0);
    this.carregarDados();
  }

  filtrarDataPagamentoDe(event: any) {
    if (event && event.value) {
      const date = new Date(event.value);
      const formattedDate = date.toISOString().split('T')[0];
      this.dataPagamentoDeFiltro.set(formattedDate);
      this.minDateAte.set(date);
      
      // Valida se a data 'até' é menor que a data 'de'
      const dataAte = this.dataPagamentoAteFiltro();
      if (dataAte && dataAte < formattedDate) {
        this.dataPagamentoAteFiltro.set(undefined);
      }
    } else {
      this.dataPagamentoDeFiltro.set(undefined);
      this.minDateAte.set(null);
    }
    this.atualizarFiltro();
  }

  filtrarDataPagamentoAte(event: any) {
    if (event && event.value) {
      const date = new Date(event.value);
      const formattedDate = date.toISOString().split('T')[0];
      
      // Valida se a data 'até' é menor que a data 'de'
      const dataDe = this.dataPagamentoDeFiltro();
      if (dataDe && formattedDate < dataDe) {
        // Não permite que a data 'até' seja menor que a data 'de'
        this.dataPagamentoAteFiltro.set(undefined);
        return;
      }
      
      this.dataPagamentoAteFiltro.set(formattedDate);
    } else {
      this.dataPagamentoAteFiltro.set(undefined);
    }
    this.atualizarFiltro();
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
}
