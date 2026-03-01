import { Component, ViewChild, AfterViewInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';

import { DialogExclusaoComponent } from '../../../shared/dialog-exclusao/dialog-exclusao.component';
import { InquilinoService } from '../../../service/inquilino.service';
import { InquilinoResponseDTO } from '../../../core/model/dto/inquilino/inquilinoResponseDTO';
import { InquilinoFilterDTO } from '../../../core/model/dto/inquilino/inquilinoFilterDTO';

@Component({
  selector: 'app-listar-inquilino',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatSortModule
  ],
  templateUrl: './listar-inquilino.component.html',
  styleUrl: './listar-inquilino.component.scss'
})
export class ListarInquilinoComponent implements AfterViewInit {

  private service = inject(InquilinoService);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // MatTableDataSource para integração com MatSort
  dataSource = new MatTableDataSource<InquilinoResponseDTO>();

  totalRegistros = signal(0);

  // Filtros
  nomeFiltro = signal<string | undefined>(undefined);
  cpfFiltro = signal<string | undefined>(undefined);
  statusFiltro = signal<string | undefined>(undefined);

  // Paginação
  paginaAtual = signal(0);
  itensPorPagina = signal(5);

  // Ordenação
  ordemCampo = signal<string | null>(null);
  ordemDirecao = signal<'asc' | 'desc' | ''>('');

  statusOptions = ['ATIVO', 'INATIVO'];
  displayedColumns = ['id', 'nome', 'nomeAbreviado', 'email', 'cpf', 'status', 'acoes'];

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
    const filtro: InquilinoFilterDTO = {
      pagina: this.paginaAtual(),
      itensPorPagina: this.itensPorPagina(),
      nome: this.nomeFiltro(),
      cpf: this.cpfFiltro(),
      status: this.statusFiltro(),
      sortField: this.ordemCampo() || undefined,
      sortDirection: this.ordemDirecao() || undefined
    };

    try {
      const result = await this.service.filter(filtro);
      this.dataSource.data = result.inquilinos;
      this.totalRegistros.set(result.total);
    } catch (error) {
      console.error('Erro ao carregar inquilinos:', error);
    }
  }

  private atualizarFiltro() {
    this.paginaAtual.set(0);
    this.carregarDados();
  }

  filtrarNome(nome: string) {
    this.nomeFiltro.set(nome.trim() || undefined);
    this.atualizarFiltro();
  }

  filtrarCpf(cpf: string) {
    this.cpfFiltro.set(cpf.trim() || undefined);
    this.atualizarFiltro();
  }

  filtrarStatus(status: string) {
    this.statusFiltro.set(status || undefined);
    this.atualizarFiltro();
  }

  async excluir(id: number) {
    const ref = this.dialog.open(DialogExclusaoComponent, {
      width: '450px',
      data: { dado: 'inquilino ' + id }
    });

    ref.afterClosed().subscribe(async confirmado => {
      if (confirmado) {
        try {
          await this.service.deleteInquilino(id);
          this.carregarDados();
        } catch (error) {
          console.error('Erro ao excluir inquilino:', error);
        }
      }
    });
  }

  getNomeInput(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  getCpfInput(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }
}
