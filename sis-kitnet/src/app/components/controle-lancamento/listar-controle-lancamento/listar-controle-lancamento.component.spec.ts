import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarControleLancamentoComponent } from './listar-controle-lancamento.component';

describe('ListarControleLancamentoComponent', () => {
  let component: ListarControleLancamentoComponent;
  let fixture: ComponentFixture<ListarControleLancamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarControleLancamentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarControleLancamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
