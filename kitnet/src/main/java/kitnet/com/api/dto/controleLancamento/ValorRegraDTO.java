package kitnet.com.api.dto.controleLancamento;

import java.math.BigDecimal;

public record ValorRegraDTO(
	BigDecimal valorTotalDiaria,
	BigDecimal valorDiaria,
	BigDecimal valorPagoApartamento,
	BigDecimal valorApartamento,
	BigDecimal valorDebitoApartamento,
	Long dia
) {}
