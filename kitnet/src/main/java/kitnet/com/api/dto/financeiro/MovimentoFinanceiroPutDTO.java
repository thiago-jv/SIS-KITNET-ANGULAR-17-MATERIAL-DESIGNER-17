
package kitnet.com.api.dto.financeiro;

import java.math.BigDecimal;
import java.time.LocalDate;

public record MovimentoFinanceiroPutDTO(
    Long id,
    String tipo,
    String categoria,
    String descricao,
    BigDecimal valor,
    LocalDate data,
    Long apartamentoId,
    Long inquilinoId,
    Long lancamentoId
) {}
