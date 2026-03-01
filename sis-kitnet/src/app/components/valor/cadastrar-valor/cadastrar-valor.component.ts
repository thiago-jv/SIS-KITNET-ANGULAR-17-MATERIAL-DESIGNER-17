import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Constants } from '../../../util/constantes';
import { take } from 'rxjs';
import { ValorService } from '../../../service/valor.service';
import { ValorPostDTO } from '../../../core/model/dto/valor/valorPostDTO';
import { ValorPutDTO } from '../../../core/model/dto/valor/valorPutDTO';
import { ValorResponseDTO } from '../../../core/model/dto/valor/valorResponseDTO';
import { CurrencyBrDirective } from '../../../shared/directives/currency-br.directive';

@Component({
  selector: 'app-cadastrar-valor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
    MatSnackBarModule,
    MatToolbarModule,
    CurrencyBrDirective
  ],
  templateUrl: './cadastrar-valor.component.html',
  styleUrl: './cadastrar-valor.component.scss'
})
export class CadastrarValorComponent implements OnInit {

  private valorService = inject(ValorService);
  private route = inject(ActivatedRoute);
  private snack = inject(MatSnackBar);
  private router = inject(Router);

  id: number | null = null;
  formSubmitted = false;

  form = new FormGroup({
    valor: new FormControl<string | null>(null, Validators.required),
  });

  private formatarParaDecimal(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor);
  }

  private converterMoedaParaNumero(valor: string | null | undefined): number | null {
    if (!valor) {
      return null;
    }

    const apenasDigitos = valor.replace(/\D/g, '');
    if (!apenasDigitos) {
      return null;
    }

    return Number(apenasDigitos) / 100;
  }

  ngOnInit(): void {
    const routeId = this.route.snapshot.paramMap.get('id');

    if (routeId) {
      this.id = Number(routeId);
      this.carregarDados(this.id);
    }
  }

  async salvar(): Promise<void> {
    this.formSubmitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valorNumerico = this.converterMoedaParaNumero(this.form.value.valor);
    if (valorNumerico === null) {
      this.form.get('valor')?.setErrors({ required: true });
      this.form.markAllAsTouched();
      return;
    }

    const dados: ValorPostDTO = {
      valor: valorNumerico
    };

    try {
      if (this.id) {
        const putData: ValorPutDTO = { id: this.id, ...dados };
        await this.valorService.updateValor(this.id, putData);

        this.snack.open(Constants.ATUALIZADO_COM_SUCESSO, 'OK', {
          duration: 4000,
          panelClass: ['snackbar-success'],
          verticalPosition: 'top'
        });
      } else {
        await this.valorService.createValor(dados);

        this.snack.open(Constants.SALVO_COM_SUCESSO, 'OK', {
          duration: 4000,
          panelClass: ['snackbar-success'],
          verticalPosition: 'top'
        });
      }

      this.router.navigate(['/listar-valor']);

    } catch {
      this.snack.open(Constants.ERRO_AO_SALVAR_OU_ATUALIZAR_RECURSO, 'OK', {
        duration: 4000,
        panelClass: ['snackbar-error'],
        verticalPosition: 'top'
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/listar-valor']);
  }

  carregarDados(id: number): void {
    this.valorService.getById(id)
      .pipe(take(1))
      .subscribe({
        next: (dados: ValorResponseDTO) => {
          if (!dados) {
            this.snack.open(Constants.RECURSO_NAO_ENCONTRADO, 'OK', {
              duration: 3000,
              panelClass: ['snackbar-error'],
              verticalPosition: 'top'
            });
            return;
          }

          this.form.patchValue({
            valor: this.formatarParaDecimal(dados.valor)
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
}