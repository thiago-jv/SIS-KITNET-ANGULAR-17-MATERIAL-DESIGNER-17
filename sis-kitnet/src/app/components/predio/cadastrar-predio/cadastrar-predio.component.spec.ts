import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastrarPredioComponent } from './cadastrar-predio.component';
import { PredioService } from '../../../service/predio.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CadastrarPredioComponent', () => {
  let component: CadastrarPredioComponent;
  let fixture: ComponentFixture<CadastrarPredioComponent>;
  let predioService: jasmine.SpyObj<PredioService>;

  const mockPredio = {
    id: 1,
    descricao: 'Prédio A',
    cep: '01001-000',
    logradouro: 'Rua A',
    complemento: '',
    bairro: 'Centro',
    uf: 'SP',
    localidade: 'São Paulo',
    numero: '100'
  };

  beforeEach(async () => {
    const predioServiceSpy = jasmine.createSpyObj('PredioService', [
      'criarPredio',
      'atualizarPredio',
      'buscarPorId'
    ]);

    predioServiceSpy.buscarPorId.and.returnValue(of(mockPredio));

    await TestBed.configureTestingModule({
      imports: [
        CadastrarPredioComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSnackBarModule,
        MatToolbarModule,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: PredioService, useValue: predioServiceSpy },
        { provide: MatSnackBar, useValue: { open: jasmine.createSpy('open') } },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } }
      ]
    }).compileComponents();

    predioService = TestBed.inject(PredioService) as jasmine.SpyObj<PredioService>;

    fixture = TestBed.createComponent(CadastrarPredioComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve validar formulário - descrição é obrigatória', () => {
    component.form.patchValue({
      descricao: '',
      numero: '100'
    });

    expect(component.form.valid).toBeFalsy();
  });

  it('deve validar formulário - número é obrigatório', () => {
    component.form.patchValue({
      descricao: 'Prédio A',
      numero: null
    });

    expect(component.form.valid).toBeFalsy();
  });

  it('deve ter formulário válido com todos os campos obrigatórios', () => {
    component.form.patchValue({
      descricao: 'Prédio A',
      numero: '100'
    });

    expect(component.form.valid).toBeTruthy();
  });

  it('deve limpar formulário ao cancelar quando não houver id', () => {
    component.id = null;
    component.form.controls['descricao'].setValue('Teste');
    component.form.controls['numero'].setValue('101');

    component.cancelar();

    expect(component.form.value.descricao).toBeNull();
    expect(component.form.value.numero).toBeNull();
  });

  it('deve navegar para listagem ao cancelar quando houver id', () => {
    const routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    component.id = 1;
    
    component.cancelar();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/listar-predio']);
  });
});
