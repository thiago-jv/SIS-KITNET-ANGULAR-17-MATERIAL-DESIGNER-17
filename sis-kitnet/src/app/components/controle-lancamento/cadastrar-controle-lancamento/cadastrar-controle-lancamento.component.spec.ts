import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarControleLancamentoComponent } from './cadastrar-controle-lancamento.component';

describe('CadastrarControleLancamentoComponent', () => {
  let component: CadastrarControleLancamentoComponent;
  let fixture: ComponentFixture<CadastrarControleLancamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarControleLancamentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastrarControleLancamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
