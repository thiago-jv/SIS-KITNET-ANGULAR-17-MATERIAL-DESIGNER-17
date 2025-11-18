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

import { ApartamentoService } from '../../../service/apartamento.service';
import { DialogExclusaoComponent } from '../../../shared/dialog-exclusao/dialog-exclusao.component';
import { ApartamentoResponseDTO } from '../../../core/model/dto/apartamento/apartamentoResponseDTO';

@Component({
  selector: 'app-listar-apartamento',
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
    MatSortModule
  ],
  templateUrl: './listar-apartamento.component.html',
  styleUrls: ['./listar-apartamento.component.scss']
})
export class ListarApartamentoComponent implements AfterViewInit {

  private service = inject(ApartamentoService);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // MatTableDataSource para integração com MatSort
  dataSource = new MatTableDataSource<ApartamentoResponseDTO>();

  totalRegistros = signal(0);

  // Filtros
  descricaoFiltro = signal('');
  numeroFiltro = signal<number | null>(null);

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
      const result = await this.service.filter(filtro);
      this.dataSource.data = result.apartamentos;
      this.totalRegistros.set(result.total);
    } catch (error) {
      console.error('Erro ao carregar apartamentos:', error);
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

  filtrarNumero(valor: number | null) {
    this.numeroFiltro.set(valor);
    this.atualizarFiltro();
  }

  async excluir(id: number) {
    const ref = this.dialog.open(DialogExclusaoComponent, {
      width: '450px',
      data: { dado: 'apartamento ' + id }
    });

    ref.afterClosed().subscribe(async confirmado => {
      if (confirmado) {
        try {
          await this.service.deleteApartamento(id);
          this.carregarDados();
        } catch (error) {
          console.error('Erro ao excluir apartamento:', error);
        }
      }
    });
  }

  getValorInput(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  getValorNumero(event: Event): number | null {
    const v = (event.target as HTMLInputElement).value;
    return v ? Number(v) : null;
  }
}
