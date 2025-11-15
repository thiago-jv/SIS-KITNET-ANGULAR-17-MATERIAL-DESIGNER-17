import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-apartamento',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  templateUrl: './apartamento.component.html',
  styleUrl: './apartamento.component.scss'
})
export class ApartamentoComponent {

  public titulo: string ='Salvar';

  form = new FormGroup({
    descricao: new FormControl('', Validators.required),
    numero: new FormControl(null, [Validators.required, Validators.min(1)]),
  });

  salvar() {
    if (this.form.valid) {
      console.log('Dados enviados:', this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

}
