import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarValorComponent } from './cadastrar-valor.component';

describe('CadastrarValorComponent', () => {
  let component: CadastrarValorComponent;
  let fixture: ComponentFixture<CadastrarValorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarValorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadastrarValorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
