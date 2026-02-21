import {Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import {Constants} from "../../../util/constantes";
import {take} from "rxjs";
import { PredioService } from '../../../service/predio.service';
import { PredioPostDTO } from '../../../core/model/dto/predio/predioPostDTO';

@Component({
  selector: 'app-cadastrar-predio',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    RouterLink,
    MatSnackBarModule,
    MatToolbarModule
  ],
  templateUrl: './cadastrar-predio.component.html',
  styleUrl: './cadastrar-predio.component.scss'
})
export class CadastrarPredioComponent {

  private predioService = inject(PredioService);
  private route = inject(ActivatedRoute);
  private snack = inject(MatSnackBar);
  private router = inject(Router);

  id: number | null = null;
  formSubmitted = false;

  form = new FormGroup({
    descricao: new FormControl('', Validators.required),
    cep: new FormControl(''),
    logradouro: new FormControl(''),
    complemento: new FormControl(''),
    bairro: new FormControl(''),
    uf: new FormControl(''),
    localidade: new FormControl(''),
    numero: new FormControl<string | null>(null, [
      Validators.required
    ]),
  });

  ngOnInit(): void {
    const routeId = this.route.snapshot.paramMap.get('id');

    if (routeId) {
      this.id = Number(routeId);
      this.carregarDados(this.id);
    }
  }

  async salvar(): Promise<void> {
    this.formSubmitted = true;

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const dados = this.form.value as PredioPostDTO;

    try {
      if (this.id) {
        const resp = await this.predioService.updatePredio(this.id, dados);

        this.snack.open(Constants.ATUALIZADO_COM_SUCESSO, 'OK', {
          duration: 4000,
          panelClass: ['snackbar-success'],
          verticalPosition: 'top'
        });
        this.router.navigate(['/listar-predio']);

      } else {
        const resp = await this.predioService.createPredio(dados);

        this.snack.open(Constants.SALVO_COM_SUCESSO, 'OK', {
          duration: 4000,
          panelClass: ['snackbar-success'],
          verticalPosition: 'top'
        });
        this.router.navigate(['/listar-predio']);
      }

    } catch (error) {
      this.snack.open(Constants.ERRO_AO_SALVAR_OU_ATUALIZAR_RECURSO, 'OK', {
        duration: 4000,
        panelClass: ['snackbar-error'],
        verticalPosition: 'top'
      });
    }
  }

  cancelar(): void {
    if (this.id) {
       this.router.navigate(['/listar-predio']);
    } else {
      this.form.reset();
      this.formSubmitted = false;
    }
  }

  carregarDados(id: number): void {
    this.predioService.getById(id)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          if (!dados) {
            this.snack.open(Constants.RECURSO_NAO_ENCONTRADO, "OK", {
              duration: 3000,
              panelClass: ['snackbar-error'],
              verticalPosition: 'top'
            });
            return;
          }

          this.form.patchValue(dados);
        },

        error: () => {
          this.snack.open(Constants.ERRO_AO_CARREGAR_DADOS_DO_RECURSO, "OK", {
            duration: 3000,
            panelClass: ['snackbar-error'],
            verticalPosition: 'top'
          });
        }
      });
    }

  }
