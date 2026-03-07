import { Component, ViewChild, AfterViewInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DialogExclusaoComponent } from '../../../shared/dialog-exclusao/dialog-exclusao.component';
import { PredioService } from '../../../service/predio.service';
import { ErrorHandlerService } from '../../../service/error-handler.service';
import { PredioResponseDTO } from '../../../core/model/dto/predio/predioResponseDTO';
import { Constants } from '../../../util/constantes';

@Component({
  selector: 'app-listar-predio',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatSortModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './listar-predio.component.html',
  styleUrls: ['./listar-predio.component.scss']
})
export class ListarPredioComponent implements AfterViewInit {

  private service = inject(PredioService);
  private dialog = inject(MatDialog);
  private errorHandler = inject(ErrorHandlerService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // MatTableDataSource para integração com MatSort
  dataSource = new MatTableDataSource<PredioResponseDTO>();

  totalRegistros = signal(0);

  // Filtros
  descricaoFiltro = signal('');
  numeroFiltro = signal<string | null>(null);

  // Paginação
  paginaAtual = signal(0);
  itensPorPagina = signal(5);

  // Ordenação
  ordemCampo = signal<string | null>(null);
  ordemDirecao = signal<'asc' | 'desc' | ''>('');

  displayedColumns = ['id', 'descricao', 'numero', 'acoes'];

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
  }

  private async carregarDados() {
    const filtro = {
      pagina: this.paginaAtual(),
      itensPorPagina: this.itensPorPagina(),
      descricao: this.descricaoFiltro() || undefined,
      numero: this.numeroFiltro() || undefined,
      sortField: this.ordemCampo() || undefined,
      sortDirection: this.ordemDirecao() || undefined
    };


    try {
      const result = await this.service.filtrar(filtro);
      this.dataSource.data = result.predios;
      this.totalRegistros.set(result.total);
    } catch (error: any) {
      this.errorHandler.exibirErro(error, 'Carregar prédios');
    }
  }

  private atualizarFiltro() {
    this.paginaAtual.set(0);
    this.carregarDados();
  }

  filtrarDescricao(valor: string) {
    this.descricaoFiltro.set(valor);
    this.atualizarFiltro();
  }

  filtrarNumero(valor: string) {
    // Se o valor está vazio, limpa o filtro
    const numeroLimpo = valor.trim();
    this.numeroFiltro.set(numeroLimpo || null);
    this.atualizarFiltro();
  }

  async excluir(id: number) {
    const ref = this.dialog.open(DialogExclusaoComponent, {
      width: '450px',
      data: { dado: 'predio ' + id }
    });

    ref.afterClosed().subscribe(async confirmado => {
      if (confirmado) {
        try {
          await this.service.excluirPredio(id);
          this.errorHandler.exibirSucesso(Constants.EXCLUIDO_COM_SUCESSO);
          this.carregarDados();
        } catch (error: any) {
          this.errorHandler.exibirErro(error, 'Excluir prédio');
        }
      }
    });
  }

  getValorInput(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

}

