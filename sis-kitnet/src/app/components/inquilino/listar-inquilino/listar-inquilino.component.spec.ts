import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ListarInquilinoComponent } from './listar-inquilino.component';
import { InquilinoService } from '../../../service/inquilino.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('ListarInquilinoComponent', () => {
  let component: ListarInquilinoComponent;
  let fixture: ComponentFixture<ListarInquilinoComponent>;
  let inquilinoService: jasmine.SpyObj<InquilinoService>;
  let matDialog: jasmine.SpyObj<MatDialog>;

  const mockInquilinos = [
    { id: 1, nome: 'João Silva', email: 'joao@example.com', cpf: '12345678901', status: 'Ativo' },
    { id: 2, nome: 'Maria Santos', email: 'maria@example.com', cpf: '98765432101', status: 'Inativo' }
  ];

  beforeEach(async () => {
    const inquilinoServiceSpy = jasmine.createSpyObj('InquilinoService', ['filtrar', 'excluirInquilino']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    inquilinoServiceSpy.filtrar.and.returnValue(
      Promise.resolve({ inquilinos: mockInquilinos, total: 2 })
    );
    dialogSpy.open.and.returnValue({
      afterClosed: () => of(true)
    } as any);

    await TestBed.configureTestingModule({
      imports: [
        ListarInquilinoComponent,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: InquilinoService, useValue: inquilinoServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    inquilinoService = TestBed.inject(InquilinoService) as jasmine.SpyObj<InquilinoService>;
    matDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    fixture = TestBed.createComponent(ListarInquilinoComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar inquilinos na inicialização', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(inquilinoService.filtrar).toHaveBeenCalled();
    expect(component.dataSource.data.length).toBe(2);
    expect(component.totalRegistros()).toBe(2);
  }));

  it('deve filtrar inquilinos por nome', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.filtrarNome('João Silva');

    expect(component.nomeFiltro()).toBe('João Silva');
    expect(inquilinoService.filtrar).toHaveBeenCalledTimes(2);
  }));

  it('deve filtrar inquilinos por CPF', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.filtrarCpf('12345678901');

    expect(component.cpfFiltro()).toBe('12345678901');
    expect(inquilinoService.filtrar).toHaveBeenCalledTimes(2);
  }));

  it('deve filtrar inquilinos por status', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.filtrarStatus('Ativo');

    expect(component.statusFiltro()).toBe('Ativo');
    expect(inquilinoService.filtrar).toHaveBeenCalledTimes(2);
  }));

  it('deve excluir inquilino quando confirmado', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    inquilinoService.excluirInquilino.and.returnValue(Promise.resolve());

    component.excluir(1);
    tick();

    expect(matDialog.open).toHaveBeenCalled();
    expect(inquilinoService.excluirInquilino).toHaveBeenCalledWith(1);
  }));

  it('deve retornar classe correta de badge para ATIVO', () => {
    const result = component.obterClasseStatusBadge('ATIVO');
    expect(result['badge-ativo']).toBe(true);
    expect(result['badge-inativo']).toBe(false);
  });

  it('deve retornar classe correta de badge para INATIVO', () => {
    const result = component.obterClasseStatusBadge('INATIVO');
    expect(result['badge-ativo']).toBe(false);
    expect(result['badge-inativo']).toBe(true);
  });
});
