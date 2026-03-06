import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { InquilinoComponent } from './inquilino.component';

describe('InquilinoComponent', () => {
  let component: InquilinoComponent;
  let fixture: ComponentFixture<InquilinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InquilinoComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of({ get: () => null }) }
        }
      ]
    })
    .overrideComponent(InquilinoComponent, {
      set: { template: '' }
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InquilinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});
