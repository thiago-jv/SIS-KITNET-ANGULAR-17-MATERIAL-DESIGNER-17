import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ListarApartamentoComponent } from './listar-apartamento.component';
import { ApartamentoService } from '../../../service/apartamento.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('ListarApartamentoComponent', () => {
  let component: ListarApartamentoComponent;
  let fixture: ComponentFixture<ListarApartamentoComponent>;

  // Mocks
  const serviceMock = {
    filter: jasmine.createSpy('filter').and.returnValue(
      Promise.resolve({ apartamentos: [], total: 0 })
    ),
    deleteApartamento: jasmine.createSpy('deleteApartamento').and.returnValue(
      Promise.resolve({})
    )
  };

  const dialogMock = {
    open: jasmine.createSpy('open').and.returnValue({
      afterClosed: () => of(true)
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ListarApartamentoComponent,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ApartamentoService, useValue: serviceMock },
        { provide: MatDialog, useValue: dialogMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListarApartamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve filtrar por número e chamar o serviço', fakeAsync(() => {
    serviceMock.filter.calls.reset();

    component.filtrarNumero(123);
    tick();

    expect(component.numeroFiltro()).toBe(123);
    expect(serviceMock.filter).toHaveBeenCalledTimes(1);
  }));
});
