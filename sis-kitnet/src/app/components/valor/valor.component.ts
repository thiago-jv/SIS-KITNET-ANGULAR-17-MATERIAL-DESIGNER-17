import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CadastrarValorComponent } from './cadastrar-valor/cadastrar-valor.component';

@Component({
  selector: 'app-valor',
  standalone: true,
  imports: [CadastrarValorComponent],
  templateUrl: './valor.component.html',
  styleUrl: './valor.component.scss'
})
export class ValorComponent {

    public titulo: string = 'Salvar';
    
    constructor(private route: ActivatedRoute) {}
  
    ngOnInit() {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        this.titulo = id ? 'Editar' : 'Salvar';
      });
    }
  

}
