import { Component } from '@angular/core';
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
    MatSnackBarModule
  ],
  templateUrl: './cadastra-apartamento.component.html',
  styleUrl: './cadastra-apartamento.component.scss'
})
export class CadastraApartamentoComponent {

  constructor(
    private route: ActivatedRoute,
    private snack: MatSnackBar) {}

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

  salvar(): void {
    if (this.form.valid) {

      console.log('Dados enviados:', this.form.value);

      this.snack.open('Apartamento salvo com sucesso!', 'OK', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['snackbar-success']
      });

    } else {
      this.form.markAllAsTouched();
    }
  }

  cancelar(): void {
    this.form.reset();
  }

  carregarDados(id: number): void {
    const dadosMock = {
      descricao: `Apto ${id}`,
      numero: 100 + id
    };

    this.form.patchValue(dadosMock);
  }
}
