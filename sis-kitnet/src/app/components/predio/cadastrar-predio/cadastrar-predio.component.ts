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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import {Constants} from "../../../util/constantes";
import {take} from "rxjs";
import { PredioService } from '../../../service/predio.service';
import { PredioPostDTO } from '../../../core/model/dto/predio/predioPostDTO';
import { ErrorHandlerService } from '../../../service/error-handler.service';

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
    MatToolbarModule
  ],
  templateUrl: './cadastrar-predio.component.html',
  styleUrl: './cadastrar-predio.component.scss'
})
export class CadastrarPredioComponent {

  private predioService = inject(PredioService);
  private route = inject(ActivatedRoute);
  private errorHandler = inject(ErrorHandlerService);
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
        const resp = await this.predioService.atualizarPredio(this.id, dados);

        this.errorHandler.exibirSucesso(Constants.ATUALIZADO_COM_SUCESSO);
        this.router.navigate(['/predio/listar']);

      } else {
        const resp = await this.predioService.criarPredio(dados);

        this.errorHandler.exibirSucesso(Constants.SALVO_COM_SUCESSO);
        this.router.navigate(['/predio/listar']);
      }

    } catch (error) {
      this.errorHandler.exibirErro(error, 'salvar ou atualizar');
    }
  }

  cancelar(): void {
    if (this.id) {
      this.router.navigate(['/predio/listar']);
    } else {
      this.form.reset();
      this.formSubmitted = false;
    }
  }

  carregarDados(id: number): void {
    this.predioService.buscarPorId(id)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          if (!dados) {
            this.errorHandler.exibirErro(new Error('Recurso não encontrado'), 'carregar dados');
            return;
          }

          this.form.patchValue(dados);
        },

        error: (error) => {
          this.errorHandler.exibirErro(error, 'carregar dados');
        }
      });
    }

  }
