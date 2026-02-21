import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarPredioComponent } from './cadastrar-predio.component';

describe('CadastrarPredioComponent', () => {
  let component: CadastrarPredioComponent;
  let fixture: ComponentFixture<CadastrarPredioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarPredioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadastrarPredioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
