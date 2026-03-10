package kitnet.com.api.dto.valor;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ValorPostDTO(
    @NotNull(message = "Valor é obrigatório")
    @DecimalMin(value = "0.0", inclusive = true, message = "Valor não pode ser negativo")
    BigDecimal valor
) {}
