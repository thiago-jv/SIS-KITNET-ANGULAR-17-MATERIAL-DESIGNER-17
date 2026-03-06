import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ValorComponent } from './valor.component';

describe('ValorComponent', () => {
  let component: ValorComponent;
  let fixture: ComponentFixture<ValorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValorComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of({ get: () => null }) }
        }
      ]
    })
    .overrideComponent(ValorComponent, {
      set: { template: '' }
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ValorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});
