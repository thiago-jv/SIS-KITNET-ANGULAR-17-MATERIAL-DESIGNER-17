package kitnet.com.api.dto.valor;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.math.BigDecimal;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ValorResponseDTO(
    Long id,
    BigDecimal valor
) {}
