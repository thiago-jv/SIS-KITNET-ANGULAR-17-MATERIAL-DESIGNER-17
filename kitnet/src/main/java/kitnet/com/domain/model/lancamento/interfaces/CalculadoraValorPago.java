package kitnet.com.domain.model.lancamento.interfaces;

import kitnet.com.domain.model.ControleLancamento;

/**
 * Interface para cálculo de valor pago e débito.
 */
public interface CalculadoraValorPago {

    ControleLancamento calcularValorPagoApartamento(ControleLancamento controleLancamento);
}
