import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Constants } from '../../../util/constantes';
import { take } from 'rxjs';
import { InquilinoService } from '../../../service/inquilino.service';
import { ErrorHandlerService } from '../../../service/error-handler.service';
import { InquilinoPostDTO } from '../../../core/model/dto/inquilino/inquilinoPostDTO';
import { InquilinoPutDTO } from '../../../core/model/dto/inquilino/inquilinoPutDTO';
import { InquilinoResponseDTO } from '../../../core/model/dto/inquilino/inquilinoResponseDTO';

@Component({
  selector: 'app-cadastrar-inquilino',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    RouterLink,
    MatSnackBarModule,
    MatToolbarModule
  ],
  templateUrl: './cadastrar-inquilino.component.html',
  styleUrl: './cadastrar-inquilino.component.scss'
})
export class CadastrarInquilinoComponent implements OnInit {

  private inquilinoService = inject(InquilinoService);
  private route = inject(ActivatedRoute);
  private errorHandler = inject(ErrorHandlerService);
  private router = inject(Router);

  id: number | null = null;
  formSubmitted = false;

  form = new FormGroup({
    nome: new FormControl<string | null>(null, Validators.required),
    nomeAbreviado: new FormControl<string | null>(null),
    email: new FormControl<string | null>(null, Validators.email),
    contato: new FormControl<string | null>(null),
    status: new FormControl<string>(Constants.STATUS_ATIVO),
    genero: new FormControl<string>(Constants.GENERO_MASCULINO),
    cpf: new FormControl<string | null>(null),
    rg: new FormControl<string | null>(null),
  });

  statusOptions = [Constants.STATUS_ATIVO, Constants.STATUS_INATIVO];
  generoOptions = [Constants.GENERO_MASCULINO, Constants.GENERO_FEMININO];

  ngOnInit(): void {
    const routeId = this.route.snapshot.paramMap.get('id');

    if (routeId) {
      this.id = Number(routeId);
      this.carregarDados(this.id);
    }
  }

  async salvar(): Promise<void> {
    this.formSubmitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dados: InquilinoPostDTO = {
      nome: this.form.value.nome!,
      nomeAbreviado: this.form.value.nomeAbreviado || null,
      email: this.form.value.email || null,
      contato: this.form.value.contato || null,
      status: this.form.value.status || Constants.STATUS_ATIVO,
      genero: this.form.value.genero || Constants.GENERO_MASCULINO,
      cpf: this.form.value.cpf || null,
      rg: this.form.value.rg || null
    };

    try {
      if (this.id) {
        const putData: InquilinoPutDTO = { id: this.id, ...dados };
        await this.inquilinoService.atualizarInquilino(this.id, putData);
        this.errorHandler.exibirSucesso(Constants.ATUALIZADO_COM_SUCESSO);
      } else {
        await this.inquilinoService.criarInquilino(dados);
        this.errorHandler.exibirSucesso(Constants.SALVO_COM_SUCESSO);
      }

      this.router.navigate(['/listar-inquilino']);

    } catch (error: any) {
      this.errorHandler.exibirErro(error, 'salvar ou atualizar inquilino');
    }
  }

  cancelar(): void {
    this.router.navigate(['/listar-inquilino']);
  }

  carregarDados(id: number): void {
    this.inquilinoService.buscarPorId(id)
      .pipe(take(1))
      .subscribe({
        next: (dados: InquilinoResponseDTO) => {
          if (!dados) {
            this.errorHandler.exibirErro(null, 'recurso não encontrado');
            return;
          }

          this.form.patchValue({
            nome: dados.nome,
            nomeAbreviado: dados.nomeAbreviado,
            email: dados.email,
            contato: dados.contato,
            status: dados.status,
            genero: dados.genero,
            cpf: dados.cpf,
            rg: dados.rg
          });
        },
        error: (error: any) => {
          this.errorHandler.exibirErro(error, 'carregar dados do inquilino');
        }
      });
  }
}
