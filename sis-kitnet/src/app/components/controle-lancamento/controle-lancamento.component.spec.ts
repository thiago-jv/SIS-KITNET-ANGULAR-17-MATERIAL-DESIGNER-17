import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ControleLancamentoComponent } from './controle-lancamento.component';

describe('ControleLancamentoComponent', () => {
  let component: ControleLancamentoComponent;
  let fixture: ComponentFixture<ControleLancamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControleLancamentoComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of({ get: () => null }) }
        }
      ]
    })
    .overrideComponent(ControleLancamentoComponent, {
      set: { template: '' }
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControleLancamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});
