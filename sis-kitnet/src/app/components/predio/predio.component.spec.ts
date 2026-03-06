import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PredioComponent } from './predio.component';

describe('PredioComponent', () => {
  let component: PredioComponent;
  let fixture: ComponentFixture<PredioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PredioComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of({ get: () => null }) }
        }
      ]
    })
    .overrideComponent(PredioComponent, {
      set: { template: '' }
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PredioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});
