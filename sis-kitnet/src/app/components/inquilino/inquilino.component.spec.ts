import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquilinoComponent } from './inquilino.component';

describe('InquilinoComponent', () => {
  let component: InquilinoComponent;
  let fixture: ComponentFixture<InquilinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InquilinoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InquilinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
