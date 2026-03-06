import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ListarPredioComponent } from './listar-predio.component';
import { PredioService } from '../../../service/predio.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('ListarPredioComponent', () => {
  let component: ListarPredioComponent;
  let fixture: ComponentFixture<ListarPredioComponent>;
  let predioService: jasmine.SpyObj<PredioService>;
  let matDialog: jasmine.SpyObj<MatDialog>;

  const mockPredios = [
    { id: 1, descricao: 'Prédio A', endereco: 'Rua A, 100' },
    { id: 2, descricao: 'Prédio B', endereco: 'Rua B, 200' }
  ];

  beforeEach(async () => {
    const predioServiceSpy = jasmine.createSpyObj('PredioService', ['filtrar', 'excluirPredio']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    predioServiceSpy.filtrar.and.returnValue(
      Promise.resolve({ predios: mockPredios, total: 2 })
    );
    dialogSpy.open.and.returnValue({
      afterClosed: () => of(true)
    } as any);

    await TestBed.configureTestingModule({
      imports: [
        ListarPredioComponent,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: PredioService, useValue: predioServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    predioService = TestBed.inject(PredioService) as jasmine.SpyObj<PredioService>;
    matDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    fixture = TestBed.createComponent(ListarPredioComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar prédios na inicialização', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(predioService.filtrar).toHaveBeenCalled();
    expect(component.dataSource.data.length).toBe(2);
    expect(component.totalRegistros()).toBe(2);
  }));

  it('deve filtrar prédios por descrição', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.filtrarDescricao('Prédio A');

    expect(component.descricaoFiltro()).toBe('Prédio A');
    expect(predioService.filtrar).toHaveBeenCalledTimes(2);
  }));

  it('deve excluir prédio quando confirmado', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    predioService.excluirPredio.and.returnValue(Promise.resolve());

    component.excluir(1);
    tick();

    expect(matDialog.open).toHaveBeenCalled();
    expect(predioService.excluirPredio).toHaveBeenCalledWith(1);
  }));

  it('deve extrair corretamente o valor do input', () => {
    const event = new Event('input');
    const input = document.createElement('input');
    input.value = 'Test Predio';
    Object.defineProperty(event, 'target', { value: input });

    const result = component.getValorInput(event);
    expect(result).toBe('Test Predio');
  });
});
