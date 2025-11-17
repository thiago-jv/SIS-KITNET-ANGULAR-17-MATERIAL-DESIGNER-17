import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogExclusaoComponent } from '../../../shared/dialog-exclusao/dialog-exclusao.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';

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

  constructor(private dialog: MatDialog) {}

  apartamentos = [
    { id: 1, descricao: 'Apto 101', numero: 101 },
    { id: 2, descricao: 'Apto 102', numero: 102 },
    { id: 3, descricao: 'Apto 201', numero: 201 },
    { id: 4, descricao: 'Apto 202', numero: 202 },
    { id: 5, descricao: 'Apto 203', numero: 203 },
    { id: 6, descricao: 'Apto 301', numero: 301 },
    { id: 7, descricao: 'Apto 302', numero: 302 },
    { id: 8, descricao: 'Apto 303', numero: 303 },
    { id: 9, descricao: 'Apto 304', numero: 304 },
    { id: 10, descricao: 'Apto 401', numero: 401 },
    { id: 11, descricao: 'Apto 402', numero: 402 },
    { id: 12, descricao: 'Apto 403', numero: 403 },
    { id: 13, descricao: 'Apto 404', numero: 404 },
    { id: 14, descricao: 'Apto 501', numero: 501 },
    { id: 15, descricao: 'Apto 502', numero: 502 },
    { id: 16, descricao: 'Apto 503', numero: 503 },
    { id: 17, descricao: 'Apto 504', numero: 504 },
    { id: 18, descricao: 'Apto 601', numero: 601 },
    { id: 19, descricao: 'Apto 602', numero: 602 },
    { id: 20, descricao: 'Apto 603', numero: 603 },
    { id: 21, descricao: 'Apto 604', numero: 604 },
    { id: 22, descricao: 'Apto 701', numero: 701 },
    { id: 23, descricao: 'Apto 702', numero: 702 },
    { id: 24, descricao: 'Apto 703', numero: 703 },
    { id: 25, descricao: 'Apto 704', numero: 704 }
  ];


  dataSource = new MatTableDataSource(this.apartamentos);

  displayedColumns = ['id', 'descricao', 'numero', 'acoes'];

  filtroDescricao = '';
  filtroNumero: number | null = null;

  @ViewChild(MatPaginator, { static: false })
  paginator!: MatPaginator | null;

  totalPaginas = 1;

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

    this.dataSource.filterPredicate = (data, filter) =>
      data.descricao.toLowerCase().includes(filter.toLowerCase());

    this.atualizarTotalPaginas();
  }

  atualizarTotalPaginas() {
    if (this.paginator) {
      this.totalPaginas = Math.ceil(
        this.dataSource.filteredData.length / this.paginator.pageSize
      );
    }
  }

  filtrarDescricao(valor: string) {
    this.filtroDescricao = valor.trim();
    this.dataSource.filter = this.filtroDescricao;

    if (this.paginator) {
      this.paginator.firstPage();
    }

    this.atualizarTotalPaginas();
  }

  filtrarNumero(valor: number | null) {
    if (valor === null) {
      this.dataSource.data = [...this.apartamentos];
    } else {
      this.dataSource.data = this.apartamentos.filter(a => a.numero === valor);
    }

    this.dataSource.filter = this.filtroDescricao;

    if (this.paginator) {
      this.paginator.firstPage();
    }

    this.atualizarTotalPaginas();
  }

  excluir(id: number) {
    const ap = this.apartamentos.find(a => a.id === id);

    const ref = this.dialog.open(DialogExclusaoComponent, {
      width: '450px',
      data: { dado: ap?.descricao }
    });

    ref.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.apartamentos = this.apartamentos.filter(a => a.id !== id);

        this.dataSource.data = [...this.apartamentos];
        this.dataSource.filter = this.filtroDescricao;

        if (this.paginator) {
          this.paginator.firstPage();
        }

        this.atualizarTotalPaginas();
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
