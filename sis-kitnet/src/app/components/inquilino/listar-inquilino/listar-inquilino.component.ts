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
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DialogExclusaoComponent } from '../../../shared/dialog-exclusao/dialog-exclusao.component';
import { InquilinoService } from '../../../service/inquilino.service';
import { ErrorHandlerService } from '../../../service/error-handler.service';
import { InquilinoResponseDTO } from '../../../core/model/dto/inquilino/inquilinoResponseDTO';
import { InquilinoFilterDTO } from '../../../core/model/dto/inquilino/inquilinoFilterDTO';
import { Constants } from '../../../util/constantes';

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
    MatSortModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './listar-inquilino.component.html',
  styleUrls: ['./listar-inquilino.component.scss']
})
export class ListarInquilinoComponent implements AfterViewInit {

  private service = inject(InquilinoService);
  private dialog = inject(MatDialog);
  private errorHandler = inject(ErrorHandlerService);

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

  statusOptions = [Constants.STATUS_ATIVO, Constants.STATUS_INATIVO];
  displayedColumns = ['id', 'nome', 'nomeAbreviado', 'email', 'cpf', 'rg', 'status', 'acoes'];

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
      const result = await this.service.filtrar(filtro);
      this.dataSource.data = result.inquilinos;
      this.totalRegistros.set(result.total);
    } catch (error: any) {
      this.errorHandler.exibirErro(error, 'Carregar inquilinos');
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
          await this.service.excluirInquilino(id);
          this.errorHandler.exibirSucesso(Constants.EXCLUIDO_COM_SUCESSO);
          this.carregarDados();
        } catch (error: any) {
          this.errorHandler.exibirErro(error, 'Excluir inquilino');
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

  obterStatus(item: InquilinoResponseDTO | null | undefined): string {
    return item?.status ?? Constants.STATUS_DESCONHECIDO;
  }

  obterClasseStatusBadge(status: string | null | undefined): Record<string, boolean> {
    const statusSafe = this.obterStatus({ status } as any);
    return {
      'badge-ativo': statusSafe === Constants.STATUS_ATIVO,
      'badge-inativo': statusSafe === Constants.STATUS_INATIVO
    };
  }
}
