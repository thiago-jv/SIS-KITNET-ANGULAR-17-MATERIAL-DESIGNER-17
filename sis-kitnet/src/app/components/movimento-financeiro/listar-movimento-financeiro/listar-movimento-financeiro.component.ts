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
import { ErrorHandlerService } from '../../../service/error-handler.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DialogExclusaoComponent } from '../../../shared/dialog-exclusao/dialog-exclusao.component';
import { MovimentoFinanceiroService } from '../../../service/movimento-financeiro.service';
import { MovimentoFinanceiroResponseDTO } from '../../../core/model/dto/movimento-financeiro/movimentoFinanceiroResponseDTO';

@Component({
  selector: 'app-listar-movimento-financeiro',
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
  templateUrl: './listar-movimento-financeiro.component.html',
  styleUrls: ['./listar-movimento-financeiro.component.scss']
})
export class ListarMovimentoFinanceiroComponent implements AfterViewInit {
  private service = inject(MovimentoFinanceiroService);
  private dialog = inject(MatDialog);
  private errorHandler = inject(ErrorHandlerService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<MovimentoFinanceiroResponseDTO>();
  totalRegistros = signal(0);

  // Filtros com FormControl
  dataInicioControl = new FormControl<Date | null>(null);
  dataFimControl = new FormControl<Date | null>(null);
  dataInicioFiltro = signal<string | undefined>(undefined);
  dataFimFiltro = signal<string | undefined>(undefined);

  // Paginação
  paginaAtual = signal(0);
  itensPorPagina = signal(10);

  displayedColumns = [
    'id',
    'tipo',
    'categoria',
    'descricao',
    'valor',
    'data',
    'apartamentoId',
    'inquilinoId',
    'lancamentoId',
    'acoes'
  ];

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.carregarDados();
    this.paginator.page.subscribe(page => {
      this.paginaAtual.set(page.pageIndex);
      this.itensPorPagina.set(page.pageSize);
      this.carregarDados();
    });
  }

  aplicarFiltros() {
    const dataInicio = this.dataInicioControl.value;
    if (dataInicio) {
      this.dataInicioFiltro.set(dataInicio.toISOString().split('T')[0]);
    } else {
      this.dataInicioFiltro.set(undefined);
    }
    const dataFim = this.dataFimControl.value;
    if (dataFim) {
      this.dataFimFiltro.set(dataFim.toISOString().split('T')[0]);
    } else {
      this.dataFimFiltro.set(undefined);
    }
    this.paginaAtual.set(0);
    this.carregarDados();
  }

  limparFiltros() {
    this.dataInicioControl.setValue(null);
    this.dataFimControl.setValue(null);
    this.dataInicioFiltro.set(undefined);
    this.dataFimFiltro.set(undefined);
    this.paginaAtual.set(0);
    this.carregarDados();
  }

  carregarDados() {
    this.service.filtrarPorData(
      this.dataInicioFiltro(),
      this.dataFimFiltro(),
      this.paginaAtual(),
      this.itensPorPagina()
    ).subscribe({
      next: (result) => {
        this.dataSource.data = result.content;
        this.totalRegistros.set(result.totalElements);
      },
      error: (err) => {
        this.errorHandler.exibirErro(err, 'carregar movimentos financeiros');
      }
    });
  }

  async excluir(id: number) {
    const ref = this.dialog.open(DialogExclusaoComponent, {
      width: '450px',
      data: { dado: 'movimento financeiro ' + id }
    });

    ref.afterClosed().subscribe(async confirmado => {
      if (confirmado) {
        try {
          await this.service.deletar(id).toPromise();
          this.dialog.closeAll();
          this.carregarDados();
          this.errorHandler.exibirSucesso('Movimento excluído com sucesso!');
        } catch (error: any) {
          this.errorHandler.exibirErro(error, 'excluir movimento');
        }
      }
    });
  }
}
