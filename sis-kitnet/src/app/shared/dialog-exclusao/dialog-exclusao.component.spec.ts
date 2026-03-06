import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DialogExclusaoComponent } from './dialog-exclusao.component';

describe('DialogExclusaoComponent', () => {
  let component: DialogExclusaoComponent;
  let fixture: ComponentFixture<DialogExclusaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogExclusaoComponent],
      providers: [
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: MAT_DIALOG_DATA, useValue: { dado: 'registro 1' } }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogExclusaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});
