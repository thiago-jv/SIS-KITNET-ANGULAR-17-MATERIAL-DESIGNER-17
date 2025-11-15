import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogExclusaoComponent } from '../../../shared/dialog-exclusao/dialog-exclusao.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-listar-apartamento',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './listar-apartamento.component.html',
  styleUrl: './listar-apartamento.component.scss'
})
export class ListarApartamentoComponent {

  constructor(private dialog: MatDialog) {}

  apartamentos = [
    { id: 1, descricao: 'Apto 101', numero: 101 },
    { id: 2, descricao: 'Apto 102', numero: 102 },
    { id: 3, descricao: 'Apto 201', numero: 201 },
  ];

  dataSource = [...this.apartamentos];

  filtroDescricao = '';
  filtroNumero: number | null = null;

  displayedColumns = ['id', 'descricao', 'numero', 'acoes'];

  aplicarFiltros() {
    this.dataSource = this.apartamentos.filter(a => {

      const condDesc =
        this.filtroDescricao === '' ||
        a.descricao.toLowerCase().includes(this.filtroDescricao.toLowerCase());

      const condNumero =
        this.filtroNumero === null || a.numero === this.filtroNumero;

      return condDesc && condNumero;
    });
  }

  filtrarDescricao(valor: string) {
    this.filtroDescricao = valor.trim();
    this.aplicarFiltros();
  }

  filtrarNumero(valor: number | null) {
    if (valor === null) {
      this.dataSource = [...this.apartamentos];
      return;
    }
    this.dataSource = this.apartamentos.filter(a => a.numero === valor);
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
        this.aplicarFiltros();
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
