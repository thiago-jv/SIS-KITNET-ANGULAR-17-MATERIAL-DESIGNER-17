import {Component, inject, OnInit} from '@angular/core';
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
import {ApartamentoService} from "../../../service/apartamento.service";
import {ApartamentoPostDTO } from "../../../core/model/dto/apartamento/apartamentoPostDTO";
import {Constants} from "../../../util/constantes";
import {take} from "rxjs";


@Component({
  selector: 'app-cadastra-apartamento',
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
  templateUrl: './cadastra-apartamento.component.html',
  styleUrl: './cadastra-apartamento.component.scss'
})
export class CadastraApartamentoComponent implements OnInit {

  private apartamentoService = inject(ApartamentoService);
  private route = inject(ActivatedRoute);
  private snack = inject(MatSnackBar);
  private router = inject(Router);

  id: number | null = null;
  formSubmitted = false;

  form = new FormGroup({
    descricao: new FormControl('', Validators.required),
    numero: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1)
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

    const dados = this.form.value as ApartamentoPostDTO;

    try {

      if (this.id) {
        await this.apartamentoService.updateApartamento(this.id, dados);

        this.snack.open(Constants.ATUALIZADO_COM_SUCESSO, 'OK', {
          duration: 4000,
          panelClass: ['snackbar-success']
        });

      } else {
        await this.apartamentoService.createApartamento(dados);

        this.snack.open(Constants.SALVO_COM_SUCESSO, 'OK', {
          duration: 4000,
          panelClass: ['snackbar-success']
        });

        this.form.reset();
        this.formSubmitted = false;
      }

    } catch (error) {
      this.snack.open(Constants.ERRO_AO_SALVAR_OU_ATUALIZAR_RECURSO, 'OK', {
        duration: 4000,
        panelClass: ['snackbar-error']
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

  carregarDados(id: number): void {
    this.apartamentoService.getById(id)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          if (!dados) {
            this.snack.open(Constants.RECURSO_NAO_ENCONTRADO, "OK", {
              duration: 3000,
              panelClass: ['snackbar-error']
            });
            return;
          }

          this.form.patchValue(dados);
        },

        error: () => {
          this.snack.open(Constants.ERRO_AO_CARREGAR_DADOS_DO_RECURSO, "OK", {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      });
  }

}
