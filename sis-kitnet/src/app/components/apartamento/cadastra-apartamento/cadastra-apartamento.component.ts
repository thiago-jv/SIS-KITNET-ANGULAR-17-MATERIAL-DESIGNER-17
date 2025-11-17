import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import {ApartamentoService} from "../../../service/apartamento.service";
import {ApartamentoPostDTO } from "../../../core/model/dto/apartamento/apartamentoPostDTO";
import {Constants} from "../../../util/constantes";


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

  form = new FormGroup({
    descricao: new FormControl('', Validators.required),
    numero: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1)
    ]),
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.carregarDados(Number(id));
    }
  }

  async salvar(): Promise<void> {
    if (this.form.valid) {
      const dados = this.form.value as unknown as ApartamentoPostDTO;

      try {
        const response = await this.apartamentoService.createApartamento(dados);
        this.snack.open(Constants.SALVO_COM_SUCESSO, 'OK', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackbar-success']
        });

        this.form.reset();

      } catch (error) {
        this.snack.open(Constants.ERRO_AO_SALVAR_RECURSO, 'OK', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackbar-error']
        });
      }

    } else {
      this.form.markAllAsTouched();
    }
  }

  cancelar(): void {
    this.form.reset();
  }

  carregarDados(id: number): void {
    // Mock de dados
    const dadosMock = {
      descricao: `Apto ${id}`,
      numero: 100 + id
    };

    this.form.patchValue(dadosMock);
  }
}
