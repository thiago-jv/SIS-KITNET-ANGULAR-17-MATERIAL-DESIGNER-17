import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CadastrarControleLancamentoComponent } from './cadastrar-controle-lancamento/cadastrar-controle-lancamento.component';

@Component({
  selector: 'app-controle-lancamento',
  standalone: true,
  imports: [CadastrarControleLancamentoComponent],
  templateUrl: './controle-lancamento.component.html',
  styleUrl: './controle-lancamento.component.scss'
})
export class ControleLancamentoComponent {

    public titulo: string = 'Salvar';
    
    constructor(private route: ActivatedRoute) {}
  
    ngOnInit() {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        this.titulo = id ? 'Editar' : 'Salvar';
      });
    }
  

}
