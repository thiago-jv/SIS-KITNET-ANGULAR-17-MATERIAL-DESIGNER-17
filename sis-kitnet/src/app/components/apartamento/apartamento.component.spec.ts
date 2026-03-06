import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ApartamentoComponent } from './apartamento.component';

describe('ApartamentoComponent', () => {
  let component: ApartamentoComponent;
  let fixture: ComponentFixture<ApartamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApartamentoComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of({ get: () => null }) }
        }
      ]
    })
    .overrideComponent(ApartamentoComponent, {
      set: { template: '' }
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApartamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});
