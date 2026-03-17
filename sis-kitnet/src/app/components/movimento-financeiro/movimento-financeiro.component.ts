
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CadastrarMovimentoFinanceiroComponent } from './cadastrar-movimento-financeiro/cadastrar-movimento-financeiro.component';

@Component({
  selector: 'app-movimento-financeiro',
  standalone: true,
  templateUrl: './movimento-financeiro.component.html',
  styleUrls: ['./movimento-financeiro.component.scss'],
  imports: [
    CommonModule,
    CadastrarMovimentoFinanceiroComponent
  ]
})
export class MovimentoFinanceiroComponent implements OnInit {

  public titulo: string = 'Salvar';
    
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.titulo = id ? 'Editar' : 'Salvar';
    });
  }
  
}
