import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CadastraApartamentoComponent } from './cadastra-apartamento.component';
import { ApartamentoService } from '../../../service/apartamento.service';
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
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CadastraApartamentoComponent', () => {
  let component: CadastraApartamentoComponent;
  let fixture: ComponentFixture<CadastraApartamentoComponent>;

  const apartamentoServiceMock = {
    createApartamento: jasmine.createSpy('createApartamento').and.returnValue(Promise.resolve({})),
    updateApartamento: jasmine.createSpy('updateApartamento').and.returnValue(Promise.resolve({})),
    getById: jasmine.createSpy('getById').and.returnValue(of({ descricao: 'Apto 101', numero: 101 }))
  };

  const snackBarMock = { open: jasmine.createSpy('open') };
  const routerMock = { navigate: jasmine.createSpy('navigate') };
  const activatedRouteMock = { snapshot: { paramMap: { get: (key: string) => null } } }; // sem id

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CadastraApartamentoComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSnackBarModule,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ApartamentoService, useValue: apartamentoServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CadastraApartamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset form on cancelar if no id', () => {
    component.form.controls['descricao'].setValue('Teste');
    component.form.controls['numero'].setValue(123);

    component.cancelar();

    expect(component.form.value.descricao).toBeNull();
    expect(component.form.value.numero).toBeNull();
  });

  it('should navigate on cancelar if id exists', () => {
    component.id = 1;
    component.cancelar();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/listar-apartamento']);
  });
});
