package kitnet.com.domain.model.lancamento;

import kitnet.com.domain.model.ControleLancamento;
import kitnet.com.domain.model.lancamento.interfaces.CalculadoraValorPago;
import kitnet.com.infra.utils.Constantes;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.MathContext;
import java.util.Objects;

@Component
public class CalcularValorPago implements CalculadoraValorPago {
	@Override

	public ControleLancamento calcularValorPagoApartamento(ControleLancamento controleLancamento) {
		if (validaValorPagoApartamento(controleLancamento)) {

			if(controleLancamento.getValores().getValorDebitoApartamento() == null){
				controleLancamento.getValores().setValorDebitoApartamento(new BigDecimal(BigInteger.ZERO));
			}

			controleLancamento.getValores()
					.setValorDebitoApartamento(controleLancamento.getValores().getValorTotalDiaria().subtract(
							controleLancamento.getValores().getValorPagoApartamento(), MathContext.DECIMAL128));
			modificaStatusApartamento(controleLancamento);
		}
		return controleLancamento;
	}
	
	public Boolean validaValorPagoApartamento(ControleLancamento controleLancamento) {
		return Objects.nonNull(controleLancamento.getValores().getValorTotalDiaria())
				&&  Objects.nonNull(controleLancamento.getValores().getValorPagoApartamento());
	}
	
	private ControleLancamento modificaStatusApartamento(ControleLancamento controleLancamento) {
		if (validaStatusApartamento(controleLancamento)) {
			controleLancamento.getStatus().setStatusApartamePagamento(Constantes.PAGO);
		} else {
			controleLancamento.getStatus().setStatusApartamePagamento(Constantes.DEBITO);
		}
		return controleLancamento;
	}
	
	public Boolean validaStatusApartamento(ControleLancamento controleLancamento) {
		return controleLancamento.getValores().getValorDebitoApartamento().compareTo(BigDecimal.ZERO) <= 0;
	}
	
}
