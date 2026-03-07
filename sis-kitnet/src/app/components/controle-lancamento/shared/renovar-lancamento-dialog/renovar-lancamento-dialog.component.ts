import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ControleLancamentoResponseDTO } from '../../../../core/model/dto/controleLancamento/controleLancamentoResponseDTO';
import { InquilinoResponseDTO } from '../../../../core/model/dto/inquilino/inquilinoResponseDTO';
import { ApartamentoResponseDTO } from '../../../../core/model/dto/apartamento/apartamentoResponseDTO';
import { InquilinoService } from '../../../../service/inquilino.service';
import { ApartamentoService } from '../../../../service/apartamento.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-renovar-lancamento-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './renovar-lancamento-dialog.component.html',
  styleUrl: './renovar-lancamento-dialog.component.scss'
})
export class RenovarLancamentoDialogComponent implements OnInit {
  
  private inquilinoService = inject(InquilinoService);
  private apartamentoService = inject(ApartamentoService);
  
  inquilinoCompleto: InquilinoResponseDTO | null = null;
  apartamentoCompleto: ApartamentoResponseDTO | null = null;
  carregando = true;
  private inquilinoCarregado = false;
  private apartamentoCarregado = false;
  
  form = new FormGroup({
    novaDataEntrada: new FormControl<Date | null>(null, Validators.required),
    novoVencimento: new FormControl<Date | null>(null, Validators.required),
    novoValor: new FormControl<number | null>(null, [Validators.required, Validators.min(0)])
  });

  constructor(
    public dialogRef: MatDialogRef<RenovarLancamentoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      idLancamento: number;
      lancamento: ControleLancamentoResponseDTO;
    }
  ) {}

  ngOnInit(): void {
    // Buscar dados completos do inquilino e apartamento
    this.carregarDados();
  }

  private carregarDados(): void {
    const idInquilino = this.data.lancamento.inquilino.id;
    const idApartamento = this.data.lancamento.apartamento.id;

    // Buscar inquilino completo
    this.inquilinoService.buscarPorId(idInquilino)
      .pipe(take(1))
      .subscribe({
        next: (inquilino) => {
          this.inquilinoCompleto = inquilino;
          this.inquilinoCarregado = true;
          this.verificarCarregamentoCompleto();
        },
        error: () => {
          this.inquilinoCarregado = true;
          this.verificarCarregamentoCompleto();
        }
      });

    // Buscar apartamento completo
    this.apartamentoService.buscarPorId(idApartamento)
      .pipe(take(1))
      .subscribe({
        next: (apartamento) => {
          this.apartamentoCompleto = apartamento;
          this.apartamentoCarregado = true;
          this.verificarCarregamentoCompleto();
        },
        error: () => {
          this.apartamentoCarregado = true;
          this.verificarCarregamentoCompleto();
        }
      });

    // Calcular as datas automaticamente
    const dataAtual = this.data.lancamento.dataPagamento ? new Date(this.data.lancamento.dataPagamento) : new Date();
    const novaEntrada = new Date(dataAtual);
    const novoVencimento = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, dataAtual.getDate());
    
    // Preencher o formulário com os valores calculados
    this.form.patchValue({
      novaDataEntrada: novaEntrada,
      novoVencimento: novoVencimento,
      novoValor: this.data.lancamento.valores?.valorApartamento || 0
    });
  }

  private verificarCarregamentoCompleto(): void {
    if (this.inquilinoCarregado && this.apartamentoCarregado) {
      this.carregando = false;
    }
  }

  obterStatusPagamentoTexto(): string {
    return this.data.lancamento.status?.statusApartamePagamento || 'N/A';
  }

  obterClasseStatusPagamento(): Record<string, boolean> {
    const status = this.data.lancamento.status?.statusApartamePagamento;

    return {
      'status-pago': status === 'PAGO',
      'status-debito': status !== 'PAGO'
    };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.form.valid) {
      this.dialogRef.close({
        confirmado: true,
        dados: this.form.value
      });
    }
  }

  getProximoVencimento(dataPagamento: string | undefined): Date | null {
    if (!dataPagamento) return null;
    
    const data = new Date(dataPagamento);
    const proximoVencimento = new Date(data.getFullYear(), data.getMonth() + 1, data.getDate());
    return proximoVencimento;
  }
}
