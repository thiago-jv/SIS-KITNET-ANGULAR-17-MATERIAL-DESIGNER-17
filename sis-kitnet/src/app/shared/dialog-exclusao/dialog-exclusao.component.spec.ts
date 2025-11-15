import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogExclusaoComponent } from './dialog-exclusao.component';

describe('DialogExclusaoComponent', () => {
  let component: DialogExclusaoComponent;
  let fixture: ComponentFixture<DialogExclusaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogExclusaoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogExclusaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
