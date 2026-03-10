package kitnet.com.domain.model.lancamento;

import kitnet.com.domain.model.ControleLancamento;
import kitnet.com.domain.model.lancamento.interfaces.CalculadoraValorDiaria;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.MathContext;

@Component
public class CalculaValorDiaria implements CalculadoraValorDiaria {
	@Override

	public ControleLancamento calculaDiaria(ControleLancamento controleLancamento) {
		BigDecimal dias = new BigDecimal(controleLancamento.getValores().getDia());
		int diasDoMes = controleLancamento.getDataEntrada().lengthOfMonth();
		BigDecimal valorApartamento = controleLancamento.getValores().getValorApartamento();

		// Calcula o total proporcional primeiro (evita perda por arredondamento no diário)
		BigDecimal total = valorApartamento.multiply(dias)
			.divide(BigDecimal.valueOf(diasDoMes), MathContext.DECIMAL128);
		total = total.setScale(2, java.math.RoundingMode.HALF_UP);
		controleLancamento.getValores().setValorTotalDiaria(total);

		// Valor diário resultante a partir do total (arredondado a 2 casas)
		BigDecimal valorDiaria = total.divide(dias, 2, java.math.RoundingMode.HALF_UP);
		controleLancamento.getValores().setValorDiaria(valorDiaria);

		return controleLancamento;
	}
}
