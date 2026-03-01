import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarInquilinoComponent } from './cadastrar-inquilino.component';

describe('CadastrarInquilinoComponent', () => {
  let component: CadastrarInquilinoComponent;
  let fixture: ComponentFixture<CadastrarInquilinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarInquilinoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastrarInquilinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
