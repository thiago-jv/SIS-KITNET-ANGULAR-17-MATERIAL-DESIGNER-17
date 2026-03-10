package kitnet.com.api.dto.controleLancamento;

import kitnet.com.domain.model.Inquilino;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

public record ControleFilterDTO(
	String statusApartamePagamento,
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	LocalDate dataPagamentoDe,
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	LocalDate dataPagamentoAte,
	Inquilino inquilino,
	Long inquilinoId,
	Long apartamentoId,
	Long predioId
) {}
