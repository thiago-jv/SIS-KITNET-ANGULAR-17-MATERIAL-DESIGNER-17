package kitnet.com.domain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;

@Getter
@Setter
@Embeddable
public class ValorRegra implements Serializable {

	@Column(name = "VALORTOTALDIARIA", nullable = false)
	private BigDecimal valorTotalDiaria = BigDecimal.ZERO;

	@Column(name = "VALORDIARIA", nullable = false)
	private BigDecimal valorDiaria = BigDecimal.ZERO;

	@Column(name = "VALORPAGOAPARTAMENTO", nullable = false)
	private BigDecimal valorPagoApartamento = BigDecimal.ZERO;

	@Column(name = "VALORAPARTAMENTO", nullable = false)
	private BigDecimal valorApartamento = BigDecimal.ZERO;

	@Column(name = "VALORDEBITOAPARTAMENTO")
	private BigDecimal valorDebitoApartamento = BigDecimal.ZERO;

	@Column(name = "DIA", nullable = false)
	private Long dia;

}
