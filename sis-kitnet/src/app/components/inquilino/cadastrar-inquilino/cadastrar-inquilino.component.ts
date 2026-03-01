import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Constants } from '../../../util/constantes';
import { take } from 'rxjs';
import { InquilinoService } from '../../../service/inquilino.service';
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
  private snack = inject(MatSnackBar);
  private router = inject(Router);

  id: number | null = null;
  formSubmitted = false;

  form = new FormGroup({
    nome: new FormControl<string | null>(null, Validators.required),
    nomeAbreviado: new FormControl<string | null>(null, Validators.required),
    email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
    contato: new FormControl<string | null>(null, Validators.required),
    status: new FormControl<string>('ATIVO', Validators.required),
    genero: new FormControl<string>('MASCULINO', Validators.required),
    cpf: new FormControl<string | null>(null, Validators.required),
  });

  statusOptions = ['ATIVO', 'INATIVO'];
  generoOptions = ['MASCULINO', 'FEMININO'];

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
      nomeAbreviado: this.form.value.nomeAbreviado!,
      email: this.form.value.email!,
      contato: this.form.value.contato!,
      status: this.form.value.status || 'ATIVO',
      genero: this.form.value.genero || 'MASCULINO',
      cpf: this.form.value.cpf!
    };

    try {
      if (this.id) {
        const putData: InquilinoPutDTO = { id: this.id, ...dados };
        await this.inquilinoService.updateInquilino(this.id, putData);

        this.snack.open(Constants.ATUALIZADO_COM_SUCESSO, 'OK', {
          duration: 4000,
          panelClass: ['snackbar-success'],
          verticalPosition: 'top'
        });
      } else {
        await this.inquilinoService.createInquilino(dados);

        this.snack.open(Constants.SALVO_COM_SUCESSO, 'OK', {
          duration: 4000,
          panelClass: ['snackbar-success'],
          verticalPosition: 'top'
        });
      }

      this.router.navigate(['/listar-inquilino']);

    } catch {
      this.snack.open(Constants.ERRO_AO_SALVAR_OU_ATUALIZAR_RECURSO, 'OK', {
        duration: 4000,
        panelClass: ['snackbar-error'],
        verticalPosition: 'top'
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/listar-inquilino']);
  }

  carregarDados(id: number): void {
    this.inquilinoService.getById(id)
      .pipe(take(1))
      .subscribe({
        next: (dados: InquilinoResponseDTO) => {
          if (!dados) {
            this.snack.open(Constants.RECURSO_NAO_ENCONTRADO, 'OK', {
              duration: 3000,
              panelClass: ['snackbar-error'],
              verticalPosition: 'top'
            });
            return;
          }

          this.form.patchValue({
            nome: dados.nome,
            nomeAbreviado: dados.nomeAbreviado,
            email: dados.email,
            contato: dados.contato,
            status: dados.status,
            genero: dados.genero,
            cpf: dados.cpf
          });
        },
        error: () => {
          this.snack.open(Constants.ERRO_AO_CARREGAR_DADOS_DO_RECURSO, 'OK', {
            duration: 3000,
            panelClass: ['snackbar-error'],
            verticalPosition: 'top'
          });
        }
      });
  }
}
