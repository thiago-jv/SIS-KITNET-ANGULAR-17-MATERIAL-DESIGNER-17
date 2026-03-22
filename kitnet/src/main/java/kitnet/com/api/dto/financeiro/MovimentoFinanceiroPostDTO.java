
package kitnet.com.api.dto.financeiro;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public record MovimentoFinanceiroPostDTO(
    @NotBlank(message = "Tipo é obrigatório.")
    @Size(max = 30, message = "Tipo deve ter no máximo 30 caracteres.")
    String tipo,

    @NotBlank(message = "Categoria é obrigatória.")
    @Size(max = 50, message = "Categoria deve ter no máximo 50 caracteres.")
    String categoria,

    @Size(max = 255, message = "Descrição deve ter no máximo 255 caracteres.")
    String descricao,

    @NotNull(message = "Valor é obrigatório.")
    BigDecimal valor,

    @NotNull(message = "Data é obrigatória.")
    LocalDate data,

    Long apartamentoId,
    Long inquilinoId,
    Long lancamentoId
) {}
