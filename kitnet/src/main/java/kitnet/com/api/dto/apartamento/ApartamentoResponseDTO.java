package kitnet.com.api.dto.apartamento;

import kitnet.com.api.dto.predio.PredioId;

public record ApartamentoResponseDTO(
    Long id,
    String numeroApartamento,
    String descricao,
    String medidor,
    String statusApartamento,
    PredioId predio
) {}
