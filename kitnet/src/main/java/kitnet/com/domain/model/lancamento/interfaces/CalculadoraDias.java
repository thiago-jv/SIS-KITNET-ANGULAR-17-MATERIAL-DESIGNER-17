package kitnet.com.domain.model.lancamento.interfaces;

import kitnet.com.domain.model.ControleLancamento;

/**
 * Interface para cálculo de dias de locação.
 */
public interface CalculadoraDias {

    ControleLancamento calculaDia(ControleLancamento controleLancamento);
}
