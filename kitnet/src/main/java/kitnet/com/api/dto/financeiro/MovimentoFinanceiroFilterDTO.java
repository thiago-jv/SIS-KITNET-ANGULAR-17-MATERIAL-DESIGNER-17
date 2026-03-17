package kitnet.com.api.dto.financeiro;

import java.time.LocalDate;

public record MovimentoFinanceiroFilterDTO(
    LocalDate dataInicio,
    LocalDate dataFim
) {}
