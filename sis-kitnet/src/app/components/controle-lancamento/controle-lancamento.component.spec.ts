import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControleLancamentoComponent } from './controle-lancamento.component';

describe('ControleLancamentoComponent', () => {
  let component: ControleLancamentoComponent;
  let fixture: ComponentFixture<ControleLancamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControleLancamentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControleLancamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
