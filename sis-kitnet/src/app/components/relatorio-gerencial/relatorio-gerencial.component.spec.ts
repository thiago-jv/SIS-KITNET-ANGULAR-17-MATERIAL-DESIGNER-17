import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RelatorioGerencialComponent } from './relatorio-gerencial.component';

describe('RelatorioGerencialComponent', () => {
  let component: RelatorioGerencialComponent;
  let fixture: ComponentFixture<RelatorioGerencialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatorioGerencialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatorioGerencialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
