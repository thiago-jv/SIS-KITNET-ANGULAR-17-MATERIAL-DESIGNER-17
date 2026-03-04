import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ControleLancamentoResponseDTO } from '../../../../core/model/dto/controleLancamento/controleLancamentoResponseDTO';

@Component({
  selector: 'app-renovar-lancamento-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './renovar-lancamento-dialog.component.html',
  styleUrl: './renovar-lancamento-dialog.component.scss'
})
export class RenovarLancamentoDialogComponent {
  
  form = new FormGroup({
    quantidadeMeses: new FormControl<number>(1, [
      Validators.required,
      Validators.min(1),
      Validators.max(1)
    ])
  });

  constructor(
    public dialogRef: MatDialogRef<RenovarLancamentoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      idLancamento: number;
      lancamento: ControleLancamentoResponseDTO;
    }
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close(1); // Sempre retorna 1 (apenas 1 mês)
  }

  getProximoVencimento(dataPagamento: string | undefined): Date | null {
    if (!dataPagamento) return null;
    
    const data = new Date(dataPagamento);
    const proximoVencimento = new Date(data.getFullYear(), data.getMonth() + 1, data.getDate());
    return proximoVencimento;
  }
}
