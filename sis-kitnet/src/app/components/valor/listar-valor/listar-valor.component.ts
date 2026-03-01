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

import { DialogExclusaoComponent } from '../../../shared/dialog-exclusao/dialog-exclusao.component';
import { ValorService } from '../../../service/valor.service';
import { ValorResponseDTO } from '../../../core/model/dto/valor/valorResponseDTO';
import { ValorFilterDTO } from '../../../core/model/dto/valor/valorFilterDTO';
import { CurrencyBrDirective } from '../../../shared/directives/currency-br.directive';

@Component({
  selector: 'app-listar-valor',
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
    CurrencyBrDirective
  ],
  templateUrl: './listar-valor.component.html',
  styleUrl: './listar-valor.component.scss'
})
export class ListarValorComponent  implements AfterViewInit {

  private service = inject(ValorService);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // MatTableDataSource para integração com MatSort
  dataSource = new MatTableDataSource<ValorResponseDTO>();

  totalRegistros = signal(0);

  // Filtros
  valorFiltro = signal<number | undefined>(undefined);

  // Paginação
  paginaAtual = signal(0);
  itensPorPagina = signal(5);

  // Ordenação
  ordemCampo = signal<string | null>(null);
  ordemDirecao = signal<'asc' | 'desc' | ''>('');

  displayedColumns = ['id', 'valor', 'acoes'];

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
    const filtro: ValorFilterDTO = {
      pagina: this.paginaAtual(),
      itensPorPagina: this.itensPorPagina(),
      valor: this.valorFiltro(),
      sortField: this.ordemCampo() || undefined,
      sortDirection: this.ordemDirecao() || undefined
    };

    try {
      const result = await this.service.filter(filtro);
      this.dataSource.data = result.valores;
      this.totalRegistros.set(result.total);
    } catch (error) {
      console.error('Erro ao carregar valores:', error);
    }
  }

  private atualizarFiltro() {
    this.paginaAtual.set(0);
    this.carregarDados();
  }

  filtrarValor(valor: string) {
    // Extrair apenas números e tratar como centavos
    const apenasNumeros = valor.replace(/\D/g, '');
    const valorNumerico = apenasNumeros ? parseFloat(apenasNumeros) / 100 : undefined;
    this.valorFiltro.set(valorNumerico);
    this.atualizarFiltro();
  }

  async excluir(id: number) {
    const ref = this.dialog.open(DialogExclusaoComponent, {
      width: '450px',
      data: { dado: 'valor ' + id }
    });

    ref.afterClosed().subscribe(async confirmado => {
      if (confirmado) {
        try {
          await this.service.deleteValor(id);
          this.carregarDados();
        } catch (error) {
          console.error('Erro ao excluir valor:', error);
        }
      }
    });
  }

  getValorInput(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

}

