import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ListarValorComponent } from './listar-valor.component';
import { ValorService } from '../../../service/valor.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('ListarValorComponent', () => {
  let component: ListarValorComponent;
  let fixture: ComponentFixture<ListarValorComponent>;
  let valorService: jasmine.SpyObj<ValorService>;
  let matDialog: jasmine.SpyObj<MatDialog>;

  const mockValores = [
    { id: 1, valor: 1500.00 },
    { id: 2, valor: 2000.00 }
  ];

  beforeEach(async () => {
    const valorServiceSpy = jasmine.createSpyObj('ValorService', ['filtrar', 'excluirValor']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    valorServiceSpy.filtrar.and.returnValue(
      Promise.resolve({ valores: mockValores, total: 2 })
    );
    dialogSpy.open.and.returnValue({
      afterClosed: () => of(true)
    } as any);

    await TestBed.configureTestingModule({
      imports: [
        ListarValorComponent,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ValorService, useValue: valorServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    valorService = TestBed.inject(ValorService) as jasmine.SpyObj<ValorService>;
    matDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    fixture = TestBed.createComponent(ListarValorComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar valores na inicialização', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(valorService.filtrar).toHaveBeenCalled();
    expect(component.dataSource.data.length).toBe(2);
    expect(component.totalRegistros()).toBe(2);
  }));

  it('deve filtrar valores', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.filtrarValor('150000');

    expect(component.valorFiltro()).toBe(1500);
    expect(valorService.filtrar).toHaveBeenCalledTimes(2);
  }));

  it('deve excluir valor quando confirmado', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    valorService.excluirValor.and.returnValue(Promise.resolve());

    component.excluir(1);
    tick();

    expect(matDialog.open).toHaveBeenCalled();
    expect(valorService.excluirValor).toHaveBeenCalledWith(1);
  }));

  it('deve extrair corretamente valor numérico do input', () => {
    const event = new Event('input');
    const input = document.createElement('input');
    input.value = '1500.50';
    Object.defineProperty(event, 'target', { value: input });

    const result = component.getValorInput(event);
    expect(result).toBe('1500.50');
  });

  it('deve retornar null para input numérico vazio', () => {
    const event = new Event('input');
    const input = document.createElement('input');
    input.value = '';
    Object.defineProperty(event, 'target', { value: input });

    const result = component.getValorInput(event);
    expect(result).toBe('');
  });
});
