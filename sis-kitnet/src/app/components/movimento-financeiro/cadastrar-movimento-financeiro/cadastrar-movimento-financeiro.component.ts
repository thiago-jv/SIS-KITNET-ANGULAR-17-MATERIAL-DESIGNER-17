import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from '../../../service/error-handler.service';

import { CurrencyBrDirective } from '../../../shared/directives/currency-br.directive';

import { ApartamentoService } from '../../../service/apartamento.service';
import { InquilinoService } from '../../../service/inquilino.service';
import { ControleLancamentoService } from '../../../service/controle-lancamento.service';
import { MovimentoFinanceiroService } from '../../../service/movimento-financeiro.service';

import { ApartamentoResponseDTO } from '../../../core/model/dto/apartamento/apartamentoResponseDTO';
import { InquilinoResponseDTO } from '../../../core/model/dto/inquilino/inquilinoResponseDTO';
import { ControleLancamentoResponseDTO } from '../../../core/model/dto/controleLancamento/controleLancamentoResponseDTO';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-cadastrar-movimento-financeiro',
  standalone: true,
  templateUrl: './cadastrar-movimento-financeiro.component.html',
  styleUrls: ['./cadastrar-movimento-financeiro.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    RouterLink,
    MatToolbarModule,
    CurrencyBrDirective
  ]
})
export class CadastrarMovimentoFinanceiroComponent implements OnInit {

  form: FormGroup;
  formSubmitted = false;

  filtroApartamento = '';
  filtroInquilino = '';
  filtroLancamento = '';

  apartamentos: ApartamentoResponseDTO[] = [];
  apartamentosFiltrados: ApartamentoResponseDTO[] = [];

  inquilinos: InquilinoResponseDTO[] = [];
  inquilinosFiltrados: InquilinoResponseDTO[] = [];

  lancamentos: ControleLancamentoResponseDTO[] = [];
  lancamentosFiltrados: ControleLancamentoResponseDTO[] = [];

  @ViewChild('apartamentoSelect') apartamentoSelect?: MatSelect;
  @ViewChild('inquilinoSelect') inquilinoSelect?: MatSelect;
  @ViewChild('lancamentoSelect') lancamentoSelect?: MatSelect;

  public idMovimento: number | null = null;
  public isEditMode: boolean = false;


  tipos = [
    { label: 'Saída', value: 'SAIDA' }
  ];

  categorias = [
    { label: 'Manutenção', value: 'MANUTENCAO' },
    { label: 'Material', value: 'MATERIAL' },
    { label: 'Serviço', value: 'SERVICO' },
    { label: 'Repasse Proprietário', value: 'REPASSE_PROPRIETARIO' },
    { label: 'Outros', value: 'OUTROS' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private errorHandler: ErrorHandlerService,
    private apartamentoService: ApartamentoService,
    private inquilinoService: InquilinoService,
    private controleLancamentoService: ControleLancamentoService,
    private movimentoService: MovimentoFinanceiroService,
    private route: ActivatedRoute
  ) {

    this.form = this.fb.group({
      tipo: [null, Validators.required],
      categoria: [null, Validators.required],
      descricao: [null, [Validators.required, Validators.maxLength(255)]],
      valor: [null, [Validators.required, Validators.min(0.01)]],
      data: [null, Validators.required],
      apartamentoId: [null],
      inquilinoId: [null],
      lancamentoId: [null]
    });

  }

  ngOnInit(): void {
    this.carregarListas();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.idMovimento = Number(id);
        this.isEditMode = true;
        this.carregarMovimentoPorId(this.idMovimento);
      } else {
        this.idMovimento = null;
        this.isEditMode = false;
      }
    });
  }

  private carregarMovimentoPorId(id: number) {
    this.movimentoService.buscarPorId(id).subscribe({
      next: (dados) => {
        this.form.patchValue({
          tipo: dados.tipo,
          categoria: dados.categoria,
          descricao: dados.descricao,
          valor: dados.valor,
          data: new Date(dados.data),
          apartamentoId: dados.apartamentoId ?? null,
          inquilinoId: dados.inquilinoId ?? null,
          lancamentoId: dados.lancamentoId ?? null
        });
      },
      error: (err) => {
        this.errorHandler.exibirErro(err, 'carregar movimento');
      }
    });
  }

  async carregarListas() {

    try {

      const [apartamentos, inquilinos, lancamentos] = await Promise.all([
        this.apartamentoService.buscarTodosApartamentos(),
        this.inquilinoService.buscarTodosInquilinos(),
        this.controleLancamentoService.buscarTodosControlesLancamento()
      ]);

      this.apartamentos = apartamentos;
      this.apartamentosFiltrados = [...apartamentos];

      this.inquilinos = inquilinos;
      this.inquilinosFiltrados = [...inquilinos];

      this.lancamentos = lancamentos;
      this.lancamentosFiltrados = [...lancamentos];

    } catch (error) {
      this.errorHandler.exibirErro(error, 'carregar dados');
    }

  }

  onFiltroApartamentoInput(event: Event) {

    const valor = (event.target as HTMLInputElement).value;
    this.filtroApartamento = valor;

    const termo = this.normalizarTexto(valor);

    this.apartamentosFiltrados = this.apartamentos.filter(a =>
      this.normalizarTexto(a.numeroApartamento).includes(termo)
    );

  }

  limparFiltroApartamento(event: Event) {

    event.stopPropagation();
    this.filtroApartamento = '';
    this.apartamentosFiltrados = [...this.apartamentos];

  }

  limparApartamentoSelecionado(event: Event) {

    event.stopPropagation();
    this.form.patchValue({ apartamentoId: null });

  }

  onApartamentoOpened(opened: boolean) {

    if (!opened) return;

    this.filtroApartamento = '';
    this.apartamentosFiltrados = [...this.apartamentos];

    setTimeout(() => {

      const panel = this.apartamentoSelect?.panel?.nativeElement as HTMLElement;
      panel?.scrollTo({ top: 0 });

      const input = document.getElementById('filtro-apartamento-input') as HTMLInputElement;
      input?.focus();

    });

  }

  onFiltroInquilinoInput(event: Event) {

    const valor = (event.target as HTMLInputElement).value;
    this.filtroInquilino = valor;

    const termo = this.normalizarTexto(valor);

    this.inquilinosFiltrados = this.inquilinos.filter(i =>
      this.normalizarTexto(i.nome).includes(termo)
    );

  }

  limparFiltroInquilino(event: Event) {

    event.stopPropagation();
    this.filtroInquilino = '';
    this.inquilinosFiltrados = [...this.inquilinos];

  }

  limparInquilinoSelecionado(event: Event) {

    event.stopPropagation();
    this.form.patchValue({ inquilinoId: null });

  }

  onInquilinoOpened(opened: boolean) {

    if (!opened) return;

    this.filtroInquilino = '';
    this.inquilinosFiltrados = [...this.inquilinos];

    setTimeout(() => {

      const panel = this.inquilinoSelect?.panel?.nativeElement as HTMLElement;
      panel?.scrollTo({ top: 0 });

      const input = document.getElementById('filtro-inquilino-input') as HTMLInputElement;
      input?.focus();

    });

  }

  limparFiltroLancamento(event: Event) {

    event.stopPropagation();
    this.filtroLancamento = '';
    this.lancamentosFiltrados = [...this.lancamentos];

  }

  limparLancamentoSelecionado(event: Event) {

    event.stopPropagation();
    this.form.patchValue({ lancamentoId: null });

  }

  onLancamentoOpened(opened: boolean) {

    if (!opened) return;

    this.filtroLancamento = '';
    this.lancamentosFiltrados = [...this.lancamentos];

    setTimeout(() => {

      const panel = this.lancamentoSelect?.panel?.nativeElement as HTMLElement;
      panel?.scrollTo({ top: 0 });

      const input = document.getElementById('filtro-lancamento-input') as HTMLInputElement;
      input?.focus();

    });

  }

  private normalizarTexto(valor: string | null | undefined): string {

    return (valor ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.value;
    let valor = raw.valor;
    if (typeof valor === 'string') {
      valor = valor.replace(',', '.');
      valor = parseFloat(valor);
    }
    const dto = {
      ...raw,
      valor,
      data: this.formatDate(raw.data)
    };
    if (this.isEditMode && this.idMovimento) {
      (this.movimentoService as any).atualizarMovimento(this.idMovimento, dto).subscribe({
        next: () => {
          this.errorHandler.exibirSucesso('Movimento atualizado com sucesso!');
          this.router.navigate(['/listar-movimento-financeiro']);
        },
        error: (error: any) => {
          this.errorHandler.exibirErro(error, 'atualizar movimento');
        }
      });
    } else {
      this.movimentoService.criarMovimento(dto).subscribe({
        next: () => {
          this.errorHandler.exibirSucesso('Movimento cadastrado com sucesso!');
          this.router.navigate(['/listar-movimento-financeiro']);
        },
        error: (error: any) => {
          this.errorHandler.exibirErro(error, 'cadastrar movimento');
        }
      });
    }
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];

  }

}