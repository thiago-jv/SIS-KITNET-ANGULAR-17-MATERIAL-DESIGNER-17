import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ControleLancamentoService } from '../../../service/controle-lancamento.service';
import { InquilinoService } from '../../../service/inquilino.service';
import { ApartamentoService } from '../../../service/apartamento.service';
import { ValorService } from '../../../service/valor.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { CadastrarControleLancamentoComponent } from './cadastrar-controle-lancamento.component';

describe('CadastrarControleLancamentoComponent', () => {
  let component: CadastrarControleLancamentoComponent;
  let fixture: ComponentFixture<CadastrarControleLancamentoComponent>;

  beforeEach(async () => {
    const controleServiceSpy = jasmine.createSpyObj('ControleLancamentoService', [
      'buscarPorId',
      'criarControleLancamento',
      'atualizarControleLancamento'
    ]);
    const inquilinoServiceSpy = jasmine.createSpyObj('InquilinoService', ['buscarTodosInquilinos', 'buscarPorId']);
    const apartamentoServiceSpy = jasmine.createSpyObj('ApartamentoService', ['buscarTodosApartamentos', 'buscarPorId']);
    const valorServiceSpy = jasmine.createSpyObj('ValorService', ['buscarTodosValores', 'buscarPorId']);

    controleServiceSpy.buscarPorId.and.returnValue(of(null));
    controleServiceSpy.criarControleLancamento.and.returnValue(Promise.resolve({}));
    controleServiceSpy.atualizarControleLancamento.and.returnValue(Promise.resolve({}));

    inquilinoServiceSpy.buscarTodosInquilinos.and.returnValue(Promise.resolve([]));
    inquilinoServiceSpy.buscarPorId.and.returnValue(of(null));
    apartamentoServiceSpy.buscarTodosApartamentos.and.returnValue(Promise.resolve([]));
    apartamentoServiceSpy.buscarPorId.and.returnValue(of(null));
    valorServiceSpy.buscarTodosValores.and.returnValue(Promise.resolve([]));
    valorServiceSpy.buscarPorId.and.returnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [CadastrarControleLancamentoComponent, NoopAnimationsModule, RouterTestingModule],
      providers: [
        { provide: ControleLancamentoService, useValue: controleServiceSpy },
        { provide: InquilinoService, useValue: inquilinoServiceSpy },
        { provide: ApartamentoService, useValue: apartamentoServiceSpy },
        { provide: ValorService, useValue: valorServiceSpy },
        { provide: MatSnackBar, useValue: { open: jasmine.createSpy('open') } },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastrarControleLancamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});
