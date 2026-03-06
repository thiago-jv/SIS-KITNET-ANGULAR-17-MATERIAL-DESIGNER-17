import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CadastraApartamentoComponent } from './cadastra-apartamento.component';
import { ApartamentoService } from '../../../service/apartamento.service';
import { PredioService } from '../../../service/predio.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CadastraApartamentoComponent', () => {
  let component: CadastraApartamentoComponent;
  let fixture: ComponentFixture<CadastraApartamentoComponent>;
  let apartamentoService: jasmine.SpyObj<ApartamentoService>;
  let predioService: jasmine.SpyObj<PredioService>;

  const mockPredios = [
    { id: 1, descricao: 'Prédio A', endereco: 'Rua A' },
    { id: 2, descricao: 'Prédio B', endereco: 'Rua B' }
  ];

  const mockApartamento = {
    id: 1,
    descricao: 'Apartamento 101',
    numeroApartamento: '101',
    statusApartamento: 'DISPONIVEL',
    predio: mockPredios[0]
  };

  beforeEach(async () => {
    const apartamentoServiceSpy = jasmine.createSpyObj('ApartamentoService', [
      'criarApartamento',
      'atualizarApartamento',
      'buscarPorId',
      'buscarTodosApartamentos'
    ]);
    const predioServiceSpy = jasmine.createSpyObj('PredioService', [
      'buscarTodosPredios',
      'buscarPorId'
    ]);

    apartamentoServiceSpy.buscarPorId.and.returnValue(of(mockApartamento));
    predioServiceSpy.buscarTodosPredios.and.returnValue(Promise.resolve(mockPredios));
    predioServiceSpy.buscarPorId.and.returnValue(of(mockPredios[0]));

    await TestBed.configureTestingModule({
      imports: [
        CadastraApartamentoComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatSnackBarModule,
        MatToolbarModule,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ApartamentoService, useValue: apartamentoServiceSpy },
        { provide: PredioService, useValue: predioServiceSpy },
        { provide: MatSnackBar, useValue: { open: jasmine.createSpy('open') } },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } }
      ]
    }).compileComponents();

    apartamentoService = TestBed.inject(ApartamentoService) as jasmine.SpyObj<ApartamentoService>;
    predioService = TestBed.inject(PredioService) as jasmine.SpyObj<PredioService>;

    fixture = TestBed.createComponent(CadastraApartamentoComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar prédios na inicialização', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(predioService.buscarTodosPredios).toHaveBeenCalled();
    expect(component.predios.length).toBe(2);
  }));

  it('deve validar formulário - descrição é obrigatória', () => {
    component.form.patchValue({
      descricao: '',
      numero: 101,
      predioId: 1
    });

    expect(component.form.valid).toBeFalsy();
  });

  it('deve validar formulário - número é obrigatório', () => {
    component.form.patchValue({
      descricao: 'Apto 101',
      numero: null,
      predioId: 1
    });

    expect(component.form.valid).toBeFalsy();
  });

  it('deve validar formulário - número deve ser maior que zero', () => {
    component.form.patchValue({
      descricao: 'Apto 101',
      numero: 0,
      predioId: 1
    });

    expect(component.form.valid).toBeFalsy();
  });

  it('deve validar formulário - prédio é obrigatório', () => {
    component.form.patchValue({
      descricao: 'Apto 101',
      numero: 101,
      predioId: null
    });

    expect(component.form.valid).toBeFalsy();
  });

  it('deve ter formulário válido com todos os campos obrigatórios', () => {
    component.form.patchValue({
      descricao: 'Apto 101',
      numero: 101,
      predioId: 1
    });

    expect(component.form.valid).toBeTruthy();
  });

  it('deve limpar formulário ao cancelar quando não houver id', () => {
    component.id = null;
    component.form.controls['descricao'].setValue('Teste');
    component.form.controls['numero'].setValue(123);

    component.cancelar();

    expect(component.form.value.descricao).toBe('');
    expect(component.form.value.numero).toBeNull();
  });

  it('deve navegar para listagem ao cancelar quando houver id', () => {
    const routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    component.id = 1;
    
    component.cancelar();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/listar-apartamento']);
  });

  it('deve carregar dados do apartamento ao chamar carregarDadosApartamento', fakeAsync(() => {
    component.carregarDadosApartamento(1);
    tick();

    expect(apartamentoService.buscarPorId).toHaveBeenCalledWith(1);
    expect(component.form.value.descricao).toBe('Apartamento 101');
    expect(component.form.value.numero).toBe(101);
  }));

  it('deve disponibilizar prédios para o select após inicialização', fakeAsync(() => {
    fixture.detectChanges();
    tick();

      expect(component.predios.length).toBe(2);
  }));
});
