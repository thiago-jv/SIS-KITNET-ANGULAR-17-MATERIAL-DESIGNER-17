package kitnet.com.api.dto.controleLancamento;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record RenovarLancamentoDTO(
    Long idLancamento,
    @NotNull(message = "Quantidade de meses é obrigatória")
    @Min(value = 1, message = "Quantidade de meses deve ser no mínimo 1")
    @Max(value = 24, message = "Quantidade de meses deve ser no máximo 24")
    Integer quantidadeMeses
) {}