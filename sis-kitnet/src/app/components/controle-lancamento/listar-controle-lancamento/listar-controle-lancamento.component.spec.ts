import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControleLancamentoService } from '../../../service/controle-lancamento.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { ListarControleLancamentoComponent } from './listar-controle-lancamento.component';

describe('ListarControleLancamentoComponent', () => {
  let component: ListarControleLancamentoComponent;
  let fixture: ComponentFixture<ListarControleLancamentoComponent>;

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('ControleLancamentoService', [
      'filtrar',
      'excluirControleLancamento',
      'atualizarStatus',
      'baixarRelatorio',
      'renovarLancamento'
    ]);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const snackSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    serviceSpy.filtrar.and.returnValue(Promise.resolve({ controleLancamentos: [], total: 0 }));
    serviceSpy.excluirControleLancamento.and.returnValue(Promise.resolve());
    serviceSpy.atualizarStatus.and.returnValue(Promise.resolve());
    serviceSpy.baixarRelatorio.and.returnValue(Promise.resolve(new Blob()));
    serviceSpy.renovarLancamento.and.returnValue(Promise.resolve());
    dialogSpy.open.and.returnValue({ afterClosed: () => of(false) } as any);

    await TestBed.configureTestingModule({
      imports: [ListarControleLancamentoComponent, NoopAnimationsModule, RouterTestingModule],
      providers: [
        { provide: ControleLancamentoService, useValue: serviceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatSnackBar, useValue: snackSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarControleLancamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});
