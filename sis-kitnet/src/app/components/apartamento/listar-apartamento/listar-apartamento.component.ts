import { Component, ViewChild, AfterViewInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { ApartamentoService } from '../../../service/apartamento.service';
import { DialogExclusaoComponent } from '../../../shared/dialog-exclusao/dialog-exclusao.component';

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
    MatToolbarModule
  ],
  templateUrl: './listar-apartamento.component.html',
  styleUrl: './listar-apartamento.component.scss'
})
export class ListarApartamentoComponent implements AfterViewInit {

  private service = inject(ApartamentoService);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  apartamentos = signal<any[]>([]);
  totalRegistros = signal(0);

  // Filtros
  descricaoFiltro = signal('');
  numeroFiltro = signal<number | null>(null);

  // Paginação
  paginaAtual = signal(0);
  itensPorPagina = signal(5);

  displayedColumns = ['id', 'descricao', 'numero', 'acoes'];

  ngAfterViewInit() {
    this.carregarDados();

    this.paginator.page.subscribe(page => {
      this.paginaAtual.set(page.pageIndex);
      this.itensPorPagina.set(page.pageSize);
      this.carregarDados();
    });
  }

  async carregarDados() {
    const filtro = {
      pagina: this.paginaAtual(),
      intensPorPagina: this.itensPorPagina(),
      descricao: this.descricaoFiltro() || undefined,
      numero: this.numeroFiltro() || undefined
    };

    const result = await this.service.filter(filtro);
    this.apartamentos.set(result.apartamentos);
    this.totalRegistros.set(result.total);
  }

  filtrarDescricao(valor: string) {
    this.descricaoFiltro.set(valor);
    this.paginaAtual.set(0);
    this.carregarDados();
  }

  filtrarNumero(valor: number | null) {
    this.numeroFiltro.set(valor);
    this.paginaAtual.set(0);
    this.carregarDados();
  }

  excluir(id: number) {
    const ref = this.dialog.open(DialogExclusaoComponent, {
      width: '450px',
      data: { dado: 'apartamento ' + id }
    });

    ref.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        console.warn('TODO: implementar delete no backend');
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
