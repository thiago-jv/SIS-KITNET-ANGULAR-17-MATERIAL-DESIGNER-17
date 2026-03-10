package kitnet.com.domain.model.lancamento.interfaces;

import kitnet.com.domain.model.ControleLancamento;

/**
 * Interface para cálculo de valor de diária proporcional.
 */
public interface CalculadoraValorDiaria {

    ControleLancamento calculaDiaria(ControleLancamento controleLancamento);
}
