import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CadastrarInquilinoComponent } from './cadastrar-inquilino/cadastrar-inquilino.component';

@Component({
  selector: 'app-inquilino',
  standalone: true,
  imports: [CadastrarInquilinoComponent],
  templateUrl: './inquilino.component.html',
  styleUrl: './inquilino.component.scss'
})
export class InquilinoComponent {

    public titulo: string = 'Salvar';
    
    constructor(private route: ActivatedRoute) {}
  
    ngOnInit() {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        this.titulo = id ? 'Editar' : 'Salvar';
      });
    }
  

}
