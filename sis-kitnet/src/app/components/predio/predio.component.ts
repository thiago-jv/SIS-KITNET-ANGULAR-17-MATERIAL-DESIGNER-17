import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CadastrarPredioComponent } from "./cadastrar-predio/cadastrar-predio.component";

@Component({
  selector: 'app-predio',
  standalone: true,
  imports: [CadastrarPredioComponent],
  templateUrl: './predio.component.html',
  styleUrl: './predio.component.scss'
})
export class PredioComponent {


  public titulo: string = 'Salvar';
  
    constructor(private route: ActivatedRoute) {}
  
    ngOnInit() {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        this.titulo = id ? 'Editar' : 'Salvar';
      });
    }

}
