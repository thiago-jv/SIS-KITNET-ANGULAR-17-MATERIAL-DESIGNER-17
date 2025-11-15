import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CadastraApartamentoComponent } from './cadastra-apartamento/cadastra-apartamento.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-apartamento',
  standalone: true,
  imports: [
    CommonModule,
    CadastraApartamentoComponent
  ],
  templateUrl: './apartamento.component.html',
  styleUrl: './apartamento.component.scss'
})
export class ApartamentoComponent {

  public titulo: string = 'Salvar';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.titulo = 'Editar';
    }
  }

}