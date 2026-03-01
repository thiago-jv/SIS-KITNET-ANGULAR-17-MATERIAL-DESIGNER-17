import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CurrencyBrDirective } from '../../../shared/directives/currency-br.directive';
import { Constants } from '../../../util/constantes';
import { take } from 'rxjs';
import { ControleLancamentoService } from '../../../service/controle-lancamento.service';
import { InquilinoService } from '../../../service/inquilino.service';
import { ApartamentoService } from '../../../service/apartamento.service';
import { ValorService } from '../../../service/valor.service';
import { ControleLancamentoPostDTO } from '../../../core/model/dto/controleLancamento/controleLancamentoPostDTO';
import { ControleLancamentoPutDTO } from '../../../core/model/dto/controleLancamento/controleLancamentoPutDTO';
import { ControleLancamentoResponseDTO } from '../../../core/model/dto/controleLancamento/controleLancamentoResponseDTO';
import { InquilinoResponseDTO } from '../../../core/model/dto/inquilino/inquilinoResponseDTO';
import { ApartamentoResponseDTO } from '../../../core/model/dto/apartamento/apartamentoResponseDTO';
import { ValorResponseDTO } from '../../../core/model/dto/valor/valorResponseDTO';
import { ValorId } from '../../../core/model/dto/controleLancamento/valorId';
import { InquilinoId } from '../../../core/model/dto/controleLancamento/inquilinoId';
import { ApartamentoId } from '../../../core/model/dto/controleLancamento/apartamentoId';

@Component({
  selector: 'app-cadastrar-controle-lancamento',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatCardModule,
    RouterLink,
    MatSnackBarModule,
    MatToolbarModule,
    CurrencyBrDirective
  ],
  templateUrl: './cadastrar-controle-lancamento.component.html',
  styleUrl: './cadastrar-controle-lancamento.component.scss'
})
export class CadastrarControleLancamentoComponent implements OnInit {

  private controleLancamentoService = inject(ControleLancamentoService);
  private inquilinoService = inject(InquilinoService);
  private apartamentoService = inject(ApartamentoService);
  private valorService = inject(ValorService);
  private route = inject(ActivatedRoute);
  private snack = inject(MatSnackBar);
  private router = inject(Router);

  id: number | null = null;
  formSubmitted = false;
  minDatePagamento: Date | null = null;

  inquilinos: InquilinoResponseDTO[] = [];
  apartamentos: ApartamentoResponseDTO[] = [];
  valores: ValorResponseDTO[] = [];

  statusApartamePagamentoLuz = [
    { label: 'Pago', value: 'PAGO' },
    { label: 'Débito', value: 'DEBITO' }
  ];

  entragaContaLuz = [
    { label: 'Sim', value: 'SIM' },
    { label: 'Não', value: 'NAO' }
  ];

  statusProximoPagamento = [
    { label: 'Pago', value: 'PAGO' },
    { label: 'Débito', value: 'DEBITO' }
  ];

  form = new FormGroup({
    dataEntrada: new FormControl<Date | string | null>(null, Validators.required),
    dataPagamento: new FormControl<Date | string | null>(null, Validators.required),
    observacao: new FormControl<string | null>(null),
    valorId: new FormControl<number | null>(null, Validators.required),
    inquilinoId: new FormControl<number | null>(null, Validators.required),
    apartamentoId: new FormControl<number | null>(null, Validators.required),
    statusProximoPagamento: new FormControl<string>('DEBITO', Validators.required),
    entragaContaLuz: new FormControl<string>('NAO', Validators.required),
    statusApartamePagamentoLuz: new FormControl<string>('DEBITO', Validators.required),
    valorApartamento: new FormControl<number>({ value: 0, disabled: true }),
    dia: new FormControl<number>({ value: 0, disabled: true }),
    valorDiaria: new FormControl<number>({ value: 0, disabled: true }),
    valorTotalDiaria: new FormControl<number>({ value: 0, disabled: true }),
    valorPagoApartamento: new FormControl<number>(0, Validators.required),
    valorDebitoApartamento: new FormControl<number>({ value: 0, disabled: true })
  });

  async ngOnInit(): Promise<void> {
    await this.carregarTodosInquilinos();
    await this.carregarTodosApartamentos();
    await this.carregarTodosValores();
    
    // Subscribe to dataEntrada changes to set minimum date for dataPagamento
    this.form.get('dataEntrada')?.valueChanges.subscribe((dataEntrada: Date | string | null) => {
      if (!dataEntrada) {
        this.minDatePagamento = null;
        return;
      }

      const partesDataEntrada = this.extrairPartesData(dataEntrada);
      if (!partesDataEntrada) {
        this.minDatePagamento = null;
        return;
      }

      const { ano, mes, dia } = partesDataEntrada;

      // Datas locais (sem UTC) para manter semântica de LocalDate do backend
      const dataEntradaDate = new Date(ano, mes - 1, dia);

      // dataPagamento deve ser posterior à dataEntrada
      const minDate = new Date(dataEntradaDate);
      minDate.setDate(minDate.getDate() + 1);
      this.minDatePagamento = minDate;

      // Mesmo dia no próximo mês (com ajuste para último dia quando necessário)
      const dataPagamentoDate = this.calcularMesmoDiaProximoMes(ano, mes, dia);

      // Preenche como Date para evitar parse UTC de string no datepicker
      this.form.patchValue({ dataPagamento: dataPagamentoDate }, { emitEvent: false });
    });
    
    this.form.get('valorId')?.valueChanges.subscribe(valorId => {
      if (valorId) {
        this.buscarPorIdValor(valorId);
      }
    });

    const routeId = this.route.snapshot.paramMap.get('id');

    if (routeId) {
      this.id = Number(routeId);
      this.carregarDados(this.id);
    }
  }

  async carregarTodosInquilinos(): Promise<void> {
    try {
      const inquilinos = await this.inquilinoService.getAllInquilinos();
      this.inquilinos = inquilinos;
    } catch (error) {
      console.error('Erro ao carregar inquilinos:', error);
      this.snack.open('Erro ao carregar inquilinos', 'OK', {
        duration: 3000,
        panelClass: ['snackbar-error'],
        verticalPosition: 'top'
      });
    }
  }

  async carregarTodosApartamentos(): Promise<void> {
    try {
      const apartamentos = await this.apartamentoService.getAllApartamentos();
      this.apartamentos = apartamentos;
    } catch (error) {
      console.error('Erro ao carregar apartamentos:', error);
      this.snack.open('Erro ao carregar apartamentos', 'OK', {
        duration: 3000,
        panelClass: ['snackbar-error'],
        verticalPosition: 'top'
      });
    }
  }

  async carregarTodosValores(): Promise<void> {
    try {
      const valores = await this.valorService.getAllValores();
      this.valores = valores;
    } catch (error) {
      console.error('Erro ao carregar valores:', error);
      this.snack.open('Erro ao carregar valores', 'OK', {
        duration: 3000,
        panelClass: ['snackbar-error'],
        verticalPosition: 'top'
      });
    }
  }

  carregarInquilinoPorId(id: number): void {
    this.inquilinoService.getById(id)
      .pipe(take(1))
      .subscribe({
        next: (inquilino) => {
          if (!inquilino) return;
          
          if (!this.inquilinos.some(i => i.id === inquilino.id)) {
            this.inquilinos.push(inquilino);
          }

          this.form.patchValue({
            inquilinoId: inquilino.id
          });
        },
        error: () => {
          console.error('Erro ao carregar inquilino');
        }
      });
  }

  carregarApartamentoPorId(id: number): void {
    this.apartamentoService.getById(id)
      .pipe(take(1))
      .subscribe({
        next: (apartamento) => {
          if (!apartamento) return;
          
          if (!this.apartamentos.some(a => a.id === apartamento.id)) {
            this.apartamentos.push(apartamento);
          }

          this.form.patchValue({
            apartamentoId: apartamento.id
          });
        },
        error: () => {
          console.error('Erro ao carregar apartamento');
        }
      });
  }

  carregarValorPorId(id: number): void {
    this.valorService.getById(id)
      .pipe(take(1))
      .subscribe({
        next: (valor) => {
          if (!valor) return;
          
          // adiciona na lista se ainda não existir
          if (!this.valores.some(v => v.id === valor.id)) {
            this.valores.push(valor);
          }

          this.form.patchValue({
            valorId: valor.id
          });
        },
        error: () => {
          console.error('Erro ao carregar valor');
        }
      });
  }

  private formatarData(data: Date | string | null | undefined): string {
    if (!data) return '';

    if (typeof data === 'string') {
      // Mantém string ISO já no padrão esperado pelo backend
      if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
        return data;
      }

      const parsed = this.extrairPartesData(data);
      if (!parsed) return '';

      const mes = String(parsed.mes).padStart(2, '0');
      const dia = String(parsed.dia).padStart(2, '0');
      return `${parsed.ano}-${mes}-${dia}`;
    }

    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  private extrairPartesData(data: Date | string): { ano: number; mes: number; dia: number } | null {
    if (data instanceof Date) {
      return {
        ano: data.getFullYear(),
        mes: data.getMonth() + 1,
        dia: data.getDate()
      };
    }

    if (typeof data !== 'string') {
      return null;
    }

    // ISO (yyyy-MM-dd)
    const iso = data.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (iso) {
      return {
        ano: Number(iso[1]),
        mes: Number(iso[2]),
        dia: Number(iso[3])
      };
    }

    // BR (dd/MM/yyyy)
    const br = data.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (br) {
      return {
        ano: Number(br[3]),
        mes: Number(br[2]),
        dia: Number(br[1])
      };
    }

    return null;
  }

  private calcularMesmoDiaProximoMes(ano: number, mes: number, dia: number): Date {
    const proximoMes = mes === 12 ? 1 : mes + 1;
    const anoProximoMes = mes === 12 ? ano + 1 : ano;

    // último dia do mês alvo
    const ultimoDiaMesAlvo = new Date(anoProximoMes, proximoMes, 0).getDate();
    const diaAjustado = Math.min(dia, ultimoDiaMesAlvo);

    return new Date(anoProximoMes, proximoMes - 1, diaAjustado);
  }

  private toDateLocal(data: Date | string | null | undefined): Date | null {
    if (!data) return null;
    if (data instanceof Date) return data;

    const partes = this.extrairPartesData(data);
    if (!partes) return null;

    return new Date(partes.ano, partes.mes - 1, partes.dia);
  }

  buscarPorIdValor(id: number): void {
    this.valorService.getById(id)
      .pipe(take(1))
      .subscribe({
        next: (valor) => {
          if (!valor) return;
          
          this.form.patchValue({
            valorApartamento: valor.valor
          });
        },
        error: () => {
          console.error('Erro ao carregar valor');
        }
      });
  }

  private converterParaNumero(valor: any): number {
    if (typeof valor === 'number') return valor;
    if (!valor) return 0;
    
    // Remove pontos (separador de milhar) e substitui vírgula por ponto (separador decimal)
    const valorString = String(valor).replace(/\./g, '').replace(',', '.');
    return parseFloat(valorString) || 0;
  }

  async salvar(): Promise<void> {
    this.formSubmitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formRawValue = this.form.getRawValue();
    
    const dados: ControleLancamentoPostDTO = {
      dataEntrada: this.formatarData(this.form.value.dataEntrada!),
      dataPagamento: this.form.value.dataPagamento ? this.formatarData(this.form.value.dataPagamento) : undefined,
      observacao: this.form.value.observacao || undefined,
      status: {
        entragaContaLuz: this.form.value.entragaContaLuz || 'NAO',
        statusApartamePagamentoLuz: this.form.value.statusApartamePagamentoLuz || 'DEBITO',
        statusProximoPagamento: this.form.value.statusProximoPagamento || 'DEBITO',
        statusControle: true
      },
      valores: {
        valorPagoApartamento: this.converterParaNumero(this.form.value.valorPagoApartamento),
        valorApartamento: this.converterParaNumero(formRawValue.valorApartamento)
      },
      valor: { id: this.form.value.valorId! } as ValorId,
      inquilino: { id: this.form.value.inquilinoId! } as InquilinoId,
      apartamento: { id: this.form.value.apartamentoId! } as ApartamentoId
    };

    try {
      if (this.id) {
        const putData: ControleLancamentoPutDTO = { id: this.id, ...dados };
        await this.controleLancamentoService.updateControleLancamento(this.id, putData);

        this.snack.open(Constants.ATUALIZADO_COM_SUCESSO, 'OK', {
          duration: 4000,
          panelClass: ['snackbar-success'],
          verticalPosition: 'top'
        });
      } else {
        await this.controleLancamentoService.createControleLancamento(dados);

        this.snack.open(Constants.SALVO_COM_SUCESSO, 'OK', {
          duration: 4000,
          panelClass: ['snackbar-success'],
          verticalPosition: 'top'
        });
      }

      this.router.navigate(['/listar-controle-lancamento']);

    } catch {
      this.snack.open(Constants.ERRO_AO_SALVAR_OU_ATUALIZAR_RECURSO, 'OK', {
        duration: 4000,
        panelClass: ['snackbar-error'],
        verticalPosition: 'top'
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/listar-controle-lancamento']);
  }

  carregarDados(id: number): void {
    this.controleLancamentoService.getById(id)
      .pipe(take(1))
      .subscribe({
        next: (dados: ControleLancamentoResponseDTO) => {
          if (!dados) {
            this.snack.open(Constants.RECURSO_NAO_ENCONTRADO, 'OK', {
              duration: 3000,
              panelClass: ['snackbar-error'],
              verticalPosition: 'top'
            });
            return;
          }

          this.form.patchValue({
            dataEntrada: this.toDateLocal(dados.dataEntrada),
            dataPagamento: this.toDateLocal(dados.dataPagamento),
            observacao: dados.observacao,
            valorId: dados.valor?.id,
            inquilinoId: dados.inquilino?.id,
            apartamentoId: dados.apartamento?.id,
            statusProximoPagamento: dados.status?.statusProximoPagamento || 'DEBITO',
            entragaContaLuz: dados.status?.entragaContaLuz || 'NAO',
            statusApartamePagamentoLuz: dados.status?.statusApartamePagamentoLuz || 'DEBITO',
            valorApartamento: dados.valores?.valorApartamento || 0,
            dia: dados.valores?.dia || 0,
            valorDiaria: dados.valores?.valorDiaria || 0,
            valorTotalDiaria: dados.valores?.valorTotalDiaria || 0,
            valorPagoApartamento: dados.valores?.valorPagoApartamento || 0,
            valorDebitoApartamento: dados.valores?.valorDebitoApartamento || 0
          });

          if (dados.inquilino?.id) {
            this.carregarInquilinoPorId(dados.inquilino.id);
          }
          if (dados.apartamento?.id) {
            this.carregarApartamentoPorId(dados.apartamento.id);
          }
          if (dados.valor?.id) {
            this.carregarValorPorId(dados.valor.id);
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
}
