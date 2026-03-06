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
  let apartamentoService: jasmine.SpyObj<ApartamentoService>;
  let matDialog: jasmine.SpyObj<MatDialog>;

  const mockApartamentos = [
    { id: 1, descricao: 'Apt 101', numeroApartamento: '101', idPredio: 1, statusApartamento: 'DISPONIVEL' },
    { id: 2, descricao: 'Apt 102', numeroApartamento: '102', idPredio: 1, statusApartamento: 'OCUPADO' }
  ];

  beforeEach(async () => {
    const apartamentoServiceSpy = jasmine.createSpyObj('ApartamentoService', ['filtrar', 'excluirApartamento']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    apartamentoServiceSpy.filtrar.and.returnValue(
      Promise.resolve({ apartamentos: mockApartamentos, total: 2 })
    );
    dialogSpy.open.and.returnValue({
      afterClosed: () => of(true)
    } as any);

    await TestBed.configureTestingModule({
      imports: [
        ListarApartamentoComponent,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ApartamentoService, useValue: apartamentoServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    apartamentoService = TestBed.inject(ApartamentoService) as jasmine.SpyObj<ApartamentoService>;
    matDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    fixture = TestBed.createComponent(ListarApartamentoComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar apartamentos na inicialização', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(apartamentoService.filtrar).toHaveBeenCalled();
    expect(component.dataSource.data.length).toBe(2);
    expect(component.totalRegistros()).toBe(2);
  }));

  it('deve filtrar apartamentos por descrição', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.filtrarDescricao('Apt 101');

    expect(component.descricaoFiltro()).toBe('Apt 101');
    expect(apartamentoService.filtrar).toHaveBeenCalledTimes(2);
  }));

  it('deve filtrar apartamentos por número', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.filtrarNumeroApartamento('101');

    expect(component.numeroApartamentoFiltro()).toBe('101');
    expect(apartamentoService.filtrar).toHaveBeenCalledTimes(2);
  }));

  it('deve excluir apartamento quando confirmado', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    apartamentoService.excluirApartamento.and.returnValue(Promise.resolve());

    component.excluir(1);
    tick();

    expect(matDialog.open).toHaveBeenCalled();
    expect(apartamentoService.excluirApartamento).toHaveBeenCalledWith(1);
  }));

  it('deve retornar classe correta de badge para DISPONIVEL', () => {
    const result = component.obterClasseStatusBadge('DISPONIVEL');
    expect(result['badge-disponivel']).toBe(true);
    expect(result['badge-ocupado']).toBe(false);
  });

  it('deve retornar classe correta de badge para OCUPADO', () => {
    const result = component.obterClasseStatusBadge('OCUPADO');
    expect(result['badge-disponivel']).toBe(false);
    expect(result['badge-ocupado']).toBe(true);
  });

  it('deve extrair corretamente o valor de input texto', () => {
    const event = new Event('input');
    const input = document.createElement('input');
    input.value = 'Test Value';
    Object.defineProperty(event, 'target', { value: input });

    const result = component.getValorInput(event);
    expect(result).toBe('Test Value');
  });

  it('deve extrair corretamente o valor de input numérico', () => {
    const event = new Event('input');
    const input = document.createElement('input');
    input.value = '123';
    Object.defineProperty(event, 'target', { value: input });

    const result = component.getValorNumero(event);
    expect(result).toBe(123);
  });

  it('deve retornar null para input numérico vazio', () => {
    const event = new Event('input');
    const input = document.createElement('input');
    input.value = '';
    Object.defineProperty(event, 'target', { value: input });

    const result = component.getValorNumero(event);
    expect(result).toBeNull();
  });
});
