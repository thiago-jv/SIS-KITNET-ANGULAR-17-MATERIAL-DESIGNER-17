import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastraApartamentoComponent } from './cadastra-apartamento.component';

describe('CadastraApartamentoComponent', () => {
  let component: CadastraApartamentoComponent;
  let fixture: ComponentFixture<CadastraApartamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastraApartamentoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadastraApartamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
