import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastrarInquilinoComponent } from './cadastrar-inquilino.component';
import { InquilinoService } from '../../../service/inquilino.service';
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

describe('CadastrarInquilinoComponent', () => {
  let component: CadastrarInquilinoComponent;
  let fixture: ComponentFixture<CadastrarInquilinoComponent>;
  let inquilinoService: jasmine.SpyObj<InquilinoService>;

  const mockInquilino = {
    id: 1,
    nome: 'João Silva',
    email: 'joao@example.com',
    cpf: '12345678901',
    status: 'Ativo'
  };

  beforeEach(async () => {
    const inquilinoServiceSpy = jasmine.createSpyObj('InquilinoService', [
      'criarInquilino',
      'atualizarInquilino',
      'buscarPorId'
    ]);

    inquilinoServiceSpy.buscarPorId.and.returnValue(of(mockInquilino));

    await TestBed.configureTestingModule({
      imports: [
        CadastrarInquilinoComponent,
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
        { provide: InquilinoService, useValue: inquilinoServiceSpy },
        { provide: MatSnackBar, useValue: { open: jasmine.createSpy('open') } },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } }
      ]
    }).compileComponents();

    inquilinoService = TestBed.inject(InquilinoService) as jasmine.SpyObj<InquilinoService>;

    fixture = TestBed.createComponent(CadastrarInquilinoComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve validar formulário - nome é obrigatório', () => {
    component.form.patchValue({
      nome: '',
      nomeAbreviado: 'João',
      email: 'joao@example.com',
      contato: '11999999999',
      cpf: '12345678901'
    });

    expect(component.form.valid).toBeFalsy();
  });

  it('deve validar formulário - e-mail é obrigatório e válido', () => {
    component.form.patchValue({
      nome: 'João Silva',
      nomeAbreviado: 'João',
      email: '',
      contato: '11999999999',
      cpf: '12345678901'
    });

    expect(component.form.valid).toBeFalsy();

    component.form.patchValue({ email: 'invalid-email' });
    expect(component.form.valid).toBeFalsy();
  });

  it('deve validar formulário - CPF é obrigatório', () => {
    component.form.patchValue({
      nome: 'João Silva',
      nomeAbreviado: 'João',
      email: 'joao@example.com',
      contato: '11999999999',
      cpf: ''
    });

    expect(component.form.valid).toBeFalsy();
  });

  it('deve ter formulário válido com todos os campos obrigatórios', () => {
    component.form.patchValue({
      nome: 'João Silva',
      nomeAbreviado: 'João',
      email: 'joao@example.com',
      contato: '11999999999',
      status: 'ATIVO',
      genero: 'MASCULINO',
      cpf: '12345678901'
    });

    expect(component.form.valid).toBeTruthy();
  });

  it('deve navegar para listagem ao cancelar quando não houver id', () => {
    const routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    component.cancelar();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/listar-inquilino']);
  });

  it('deve navegar para listagem ao cancelar quando houver id', () => {
    const routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    component.id = 1;
    
    component.cancelar();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/listar-inquilino']);
  });
});
