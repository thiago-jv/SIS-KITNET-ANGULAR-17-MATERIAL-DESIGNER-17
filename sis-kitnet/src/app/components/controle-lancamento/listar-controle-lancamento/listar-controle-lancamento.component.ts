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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FilterBarComponent } from '../../../core/filters/filter-bar.component';

import { DialogExclusaoComponent } from '../../../shared/dialog-exclusao/dialog-exclusao.component';
import { RenovarLancamentoDialogComponent } from '../shared/renovar-lancamento-dialog/renovar-lancamento-dialog.component';
import { ControleLancamentoService } from '../../../service/controle-lancamento.service';
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
    MatSnackBarModule,
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
  private snack = inject(MatSnackBar);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // MatTableDataSource para integração com MatSort
  dataSource = new MatTableDataSource<ControleLancamentoResponseDTO>();

  totalRegistros = signal(0);

  // Filtros
  dataPagamentoDeFiltro = signal<string | undefined>(undefined);
  dataPagamentoAteFiltro = signal<string | undefined>(undefined);
  minDateAte = signal<Date | null>(null);
  statusApartamePagamentoFiltro = signal<string | undefined>(undefined);
  entragaContaLuzFiltro = signal<string | undefined>(undefined);
  statusApartamePagamentoLuzFiltro = signal<string | undefined>(undefined);

  // Opções para os selects de status
  statusOptions = [
    { label: 'Todos', value: '' },
    { label: 'Pago', value: 'PAGO' },
    { label: 'Débito', value: 'DEBITO' }
  ];

  entregaLuzOptions = [
    { label: 'Todos', value: '' },
    { label: 'Sim', value: 'SIM' },
    { label: 'Não', value: 'NAO' }
  ];

  // Form controls para os selects
  statusApartamentoControl = new FormControl('');
  entregaLuzControl = new FormControl('');
  statusLuzControl = new FormControl('');

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
    'statusProximoPagamento',
    'entragaContaLuz',
    'statusApartamePagamentoLuz',
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

    this.entregaLuzControl.valueChanges.subscribe(value => {
      this.entragaContaLuzFiltro.set(value || undefined);
      this.atualizarFiltro();
    });

    this.statusLuzControl.valueChanges.subscribe(value => {
      this.statusApartamePagamentoLuzFiltro.set(value || undefined);
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
      entragaContaLuz: this.entragaContaLuzFiltro(),
      statusApartamePagamentoLuz: this.statusApartamePagamentoLuzFiltro(),
      sortField: this.ordemCampo() || undefined,
      sortDirection: this.ordemDirecao() || undefined
    };

    try {
      const result = await this.service.filtrar(filtro);
      this.dataSource.data = result.controleLancamentos;
      this.totalRegistros.set(result.total);
    } catch (error) {
      console.error('Erro ao carregar controle de lançamentos:', error);
    }
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
          this.carregarDados();
        } catch (error) {
          console.error('Erro ao excluir controle de lançamento:', error);
        }
      }
    });
  }

  async atualizarStatus(id: number) {
    try {
      await this.service.atualizarStatus(id);
      this.carregarDados();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
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
    } catch (error) {
      console.error('Erro ao baixar relatório:', error);
    }
  }

  async renovar(lancamento: ControleLancamentoResponseDTO) {
    // Validação 1: Só PAGO
    if (lancamento.status?.statusApartamePagamento !== 'PAGO') {
      this.snack.open('Apenas lançamentos PAGOS podem ser renovados', 'OK', {
        duration: 4000,
        panelClass: ['snackbar-warning'],
        verticalPosition: 'top'
      });
      return;
    }

    // Validação 2: Status do controle deve estar FECHADO (statusControle = false)
    if (lancamento.status?.statusControle !== false) {
      this.snack.open('O lançamento deve estar FECHADO para renovar', 'OK', {
        duration: 4000,
        panelClass: ['snackbar-warning'],
        verticalPosition: 'top'
      });
      return;
    }

    // Abre modal informativo
    const ref = this.dialog.open(RenovarLancamentoDialogComponent, {
      width: '600px',
      data: { 
        idLancamento: lancamento.id,
        lancamento: lancamento
      }
    });

    ref.afterClosed().subscribe(async (confirmado) => {
      if (confirmado) {
        try {
          await this.service.renovarLancamento(lancamento.id!, 1);
          this.snack.open('Próximo lançamento criado com sucesso!', 'OK', {
            duration: 4000,
            panelClass: ['snackbar-success'],
            verticalPosition: 'top'
          });
          this.carregarDados();
        } catch (error) {
          console.error('Erro ao renovar lançamento:', error);
          this.snack.open('Erro ao renovar lançamento', 'OK', {
            duration: 4000,
            panelClass: ['snackbar-error'],
            verticalPosition: 'top'
          });
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
    return item?.status ?? { statusControle: null, statusApartamePagamento: null, statusApartamePagamentoLuz: null };
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
    const status = this.obterStatus(item);
    const podeRenovar = status.statusApartamePagamento === 'PAGO' && 
                        status.statusControle === true;
    return podeRenovar;
  }

  obterDicaRenovacao(item: ControleLancamentoResponseDTO): string {
    const status = this.obterStatus(item);
    if (status.statusApartamePagamento !== 'PAGO') {
      return 'Apenas lançamentos PAGOS podem ser renovados';
    }
    if (status.statusControle !== true) {
      return 'O lançamento deve estar ABERTO para renovar';
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
      'badge-paid': status === 'PAGO',
      'badge-debit': status !== 'PAGO'
    };
  }
}
