import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarApartamentoComponent } from './listar-apartamento.component';

describe('ListarApartamentoComponent', () => {
  let component: ListarApartamentoComponent;
  let fixture: ComponentFixture<ListarApartamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarApartamentoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarApartamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
