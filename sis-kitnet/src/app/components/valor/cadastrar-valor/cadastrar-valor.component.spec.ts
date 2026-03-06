import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastrarValorComponent } from './cadastrar-valor.component';
import { ValorService } from '../../../service/valor.service';
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

describe('CadastrarValorComponent', () => {
  let component: CadastrarValorComponent;
  let fixture: ComponentFixture<CadastrarValorComponent>;
  let valorService: jasmine.SpyObj<ValorService>;

  const mockValor = {
    id: 1,
    valor: 1500.00
  };

  beforeEach(async () => {
    const valorServiceSpy = jasmine.createSpyObj('ValorService', [
      'criarValor',
      'atualizarValor',
      'buscarPorId'
    ]);

    valorServiceSpy.buscarPorId.and.returnValue(of(mockValor));

    await TestBed.configureTestingModule({
      imports: [
        CadastrarValorComponent,
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
        { provide: ValorService, useValue: valorServiceSpy },
        { provide: MatSnackBar, useValue: { open: jasmine.createSpy('open') } },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } }
      ]
    }).compileComponents();

    valorService = TestBed.inject(ValorService) as jasmine.SpyObj<ValorService>;

    fixture = TestBed.createComponent(CadastrarValorComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve validar formulário - valor é obrigatório', () => {
    component.form.patchValue({
      valor: null
    });

    expect(component.form.valid).toBeFalsy();
  });

  it('deve validar formulário - valor deve ser maior que zero', () => {
    component.form.patchValue({
      valor: '0,00'
    });

    expect(component.form.valid).toBeTruthy();

    component.form.patchValue({
      valor: ''
    });

    expect(component.form.valid).toBeFalsy();
  });

  it('deve ter formulário válido com valor maior que zero', () => {
    component.form.patchValue({
      valor: '1.500,00'
    });

    expect(component.form.valid).toBeTruthy();
  });

  it('deve limpar formulário ao cancelar quando não houver id', () => {
    component.id = null;
    component.form.controls['valor'].setValue('1.500,00');

    component.cancelar();

    expect(component.form.value.valor).toBe('1.500,00');
  });

  it('deve navegar para listagem ao cancelar quando houver id', () => {
    const routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    component.id = 1;
    
    component.cancelar();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/listar-valor']);
  });
});
