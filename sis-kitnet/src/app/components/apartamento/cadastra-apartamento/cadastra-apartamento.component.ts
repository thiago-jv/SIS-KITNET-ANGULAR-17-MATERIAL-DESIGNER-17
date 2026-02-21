import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

import { ApartamentoService } from '../../../service/apartamento.service';
import { PredioService } from '../../../service/predio.service';

import { ApartamentoPostDTO } from '../../../core/model/dto/apartamento/apartamentoPostDTO';
import { PredioResponseDTO } from '../../../core/model/dto/predio/predioResponseDTO';
import { Constants } from '../../../util/constantes';

import { take } from 'rxjs';

@Component({
  selector: 'app-cadastra-apartamento',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    RouterLink,
    MatSnackBarModule,
    MatToolbarModule
  ],
  templateUrl: './cadastra-apartamento.component.html',
  styleUrl: './cadastra-apartamento.component.scss'
})
export class CadastraApartamentoComponent implements OnInit {

  private apartamentoService = inject(ApartamentoService);
  private predioService = inject(PredioService);
  private route = inject(ActivatedRoute);
  private snack = inject(MatSnackBar);
  private router = inject(Router);

  id: number | null = null;

  formSubmitted = false;
  predios: PredioResponseDTO[] = [];

  form = new FormGroup<{
    descricao: FormControl<string>;
    numero: FormControl<number | null>;
    predioId: FormControl<number | null>;
  }>({
    descricao: new FormControl('', {
      nonNullable: true,
      validators: Validators.required
    }),
    numero: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1)
    ]),
    predioId: new FormControl<number | null>(null, Validators.required)
  });

  async ngOnInit(): Promise<void> {
  const routeId = this.route.snapshot.paramMap.get('id');
  await this.carregarTodosPredios();

  if (routeId) {
    this.id = Number(routeId);
    this.carregarDadosApartamento(this.id);
  }
 }

  carregarDadosApartamento(id: number): void {
  this.apartamentoService.getById(id)
    .pipe(take(1))
    .subscribe({
      next: (dados) => {
        if (!dados) {
          this.snack.open(Constants.RECURSO_NAO_ENCONTRADO, 'OK', {
            duration: 3000,
            panelClass: ['snackbar-error'],
            verticalPosition: 'top'
          });
          return;
        }
        this.form.patchValue({
          descricao: dados.descricao ?? '',
          numero: dados.numeroApartamento ? Number(dados.numeroApartamento) : null,
          predioId: dados.predio?.id ?? null
        });

        if (dados.predio?.id) {
          this.carregarDadosPredioPorId(dados.predio.id);
        }
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

  carregarDadosPredioPorId(id: number): void {
  this.predioService.getById(id)
    .pipe(take(1))
    .subscribe({
      next: (predio) => {
        if (!predio) {
          this.snack.open(Constants.RECURSO_NAO_ENCONTRADO, 'OK', {
            duration: 3000,
            panelClass: ['snackbar-error'],
            verticalPosition: 'top'
          });
          return;
        }

        // adiciona na lista se ainda não existir
        if (!this.predios.some(p => p.id === predio.id)) {
          this.predios.push(predio);
        }

        this.form.patchValue({
          predioId: predio.id
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

  async carregarTodosPredios(): Promise<void> {
  try {
    const predios = await this.predioService.getAllPredios();

    this.predios = predios ?? [];

  } catch (error) {
    this.predios = [];

    this.snack.open('Não foi possível carregar os prédios.', 'OK', {
      duration: 4000,
      panelClass: ['snackbar-error'],
      verticalPosition: 'top'
    });
   }
  }


  async salvar(): Promise<void> {
    this.formSubmitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;

    const dados: ApartamentoPostDTO = {
      descricao: value.descricao!,
      numeroApartamento: String(value.numero),
      statusApartamento: 'DISPONIVEL',
      predio: {
        id: value.predioId!
      }
    };

    try {
      if (this.id) {
        await this.apartamentoService.updateApartamento(this.id, dados);
        this.snack.open(Constants.ATUALIZADO_COM_SUCESSO, 'OK', { 
          duration: 4000,
          verticalPosition: 'top',
          panelClass: ['snackbar-success']
        });
        this.router.navigate(['/listar-apartamento']);
      } else {
        await this.apartamentoService.createApartamento(dados);
        this.snack.open(Constants.SALVO_COM_SUCESSO, 'OK', { 
          duration: 4000,
          verticalPosition: 'top',
          panelClass: ['snackbar-success']
        });
        this.router.navigate(['/listar-apartamento']);
      }
    } catch {
      this.snack.open(Constants.ERRO_AO_SALVAR_OU_ATUALIZAR_RECURSO, 'OK', {
        duration: 4000,
        panelClass: ['snackbar-error'],
        verticalPosition: 'top'
      });
    }
  }

  cancelar(): void {
    if (this.id) {
      this.router.navigate(['/listar-apartamento']);
    } else {
      this.form.reset();
      this.formSubmitted = false;
    }
  }

}
