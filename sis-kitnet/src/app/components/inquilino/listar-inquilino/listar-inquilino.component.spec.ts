import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarInquilinoComponent } from './listar-inquilino.component';

describe('ListarInquilinoComponent', () => {
  let component: ListarInquilinoComponent;
  let fixture: ComponentFixture<ListarInquilinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarInquilinoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarInquilinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
