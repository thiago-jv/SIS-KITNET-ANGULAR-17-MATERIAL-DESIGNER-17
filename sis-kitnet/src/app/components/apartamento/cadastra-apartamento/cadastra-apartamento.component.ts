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
import { MatToolbarModule } from '@angular/material/toolbar';

import { ApartamentoService } from '../../../service/apartamento.service';
import { PredioService } from '../../../service/predio.service';
import { ErrorHandlerService } from '../../../service/error-handler.service';

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
    MatToolbarModule
  ],
  templateUrl: './cadastra-apartamento.component.html',
  styleUrl: './cadastra-apartamento.component.scss'
})
export class CadastraApartamentoComponent implements OnInit {

  private apartamentoService = inject(ApartamentoService);
  private predioService = inject(PredioService);
  private route = inject(ActivatedRoute);
  private errorHandler = inject(ErrorHandlerService);
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
    numero: new FormControl<number | null>(null, Validators.required),
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
  this.apartamentoService.buscarPorId(id)
    .pipe(take(1))
    .subscribe({
      next: (dados) => {
        if (!dados) {
          this.errorHandler.exibirErro(new Error('Recurso não encontrado'), 'carregar dados');
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
      error: (error) => {
        this.errorHandler.exibirErro(error, 'carregar dados');
      }
    });
  }

  carregarDadosPredioPorId(id: number): void {
  this.predioService.buscarPorId(id)
    .pipe(take(1))
    .subscribe({
      next: (predio) => {
        if (!predio) {
          this.errorHandler.exibirErro(new Error('Recurso não encontrado'), 'carregar dados');
          return;
        }

        if (!this.predios.some(p => p.id === predio.id)) {
          this.predios.push(predio);
        }

        this.form.patchValue({
          predioId: predio.id
        });
      },
      error: (error) => {
        this.errorHandler.exibirErro(error, 'carregar dados');
      }
    });
}

  async carregarTodosPredios(): Promise<void> {
  try {
    const predios = await this.predioService.buscarTodosPredios();

    this.predios = predios ?? [];

  } catch (error) {
    this.predios = [];

    this.errorHandler.exibirErro(error, 'carregar prédios');
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
      statusApartamento: Constants.STATUS_DISPONIVEL,
      predio: {
        id: value.predioId!
      }
    };

    try {
      if (this.id) {
        await this.apartamentoService.atualizarApartamento(this.id, dados);
        this.errorHandler.exibirSucesso(Constants.ATUALIZADO_COM_SUCESSO);
        this.router.navigate(['/apartamento/listar']);
      } else {
        await this.apartamentoService.criarApartamento(dados);
        this.errorHandler.exibirSucesso(Constants.SALVO_COM_SUCESSO);
        this.router.navigate(['/apartamento/listar']);
      }
    } catch (error) {
      this.errorHandler.exibirErro(error, 'salvar ou atualizar');
    }
  }

  cancelar(): void {
    if (this.id) {
      this.router.navigate(['/apartamento/listar']);
    } else {
      this.form.reset();
      this.formSubmitted = false;
    }
  }

}
