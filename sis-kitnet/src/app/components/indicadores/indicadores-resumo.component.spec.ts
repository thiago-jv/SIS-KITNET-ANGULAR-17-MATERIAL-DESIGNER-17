import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { IndicadoresResumoComponent } from './indicadores-resumo.component';
import { IndicadoresService } from '../../service/indicadores.service';

describe('IndicadoresResumoComponent', () => {
  let component: IndicadoresResumoComponent;
  let fixture: ComponentFixture<IndicadoresResumoComponent>;
  let indicadoresService: jasmine.SpyObj<IndicadoresService>;

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('IndicadoresService', ['obterResumo']);
    serviceSpy.obterResumo.and.returnValue(Promise.resolve({
      totalApartamentos: 20,
      totalApartamentosAlugados: 12,
      totalApartamentosVagos: 8,
      somaAlugueisEmAberto: 1750,
      totalDebitoReal: 1100
    }));

    await TestBed.configureTestingModule({
      imports: [IndicadoresResumoComponent],
      providers: [{ provide: IndicadoresService, useValue: serviceSpy }]
    }).compileComponents();

    indicadoresService = TestBed.inject(IndicadoresService) as jasmine.SpyObj<IndicadoresService>;
    fixture = TestBed.createComponent(IndicadoresResumoComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar o resumo na inicialização', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(indicadoresService.obterResumo).toHaveBeenCalled();
    expect(component.resumo().totalApartamentos).toBe(20);
  }));

  it('deve formatar moeda em BRL', () => {
    expect(component.formatarMoeda(1234.56)).toContain('R$');
  });
});
