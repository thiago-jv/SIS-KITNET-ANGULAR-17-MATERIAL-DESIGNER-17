package kitnet.com.api.dto.apartamento;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import kitnet.com.api.dto.predio.PredioId;

public record ApartamentoPutDTO(
    Long id,
    @NotBlank(message = "Número do apartamento é obrigatório")
    @Size(max = 20, message = "Número do apartamento deve ter no máximo 20 caracteres")
    String numeroApartamento,
    @Size(max = 255, message = "Descrição deve ter no máximo 255 caracteres")
    String descricao,
    @Size(max = 50, message = "Medidor deve ter no máximo 50 caracteres")
    String medidor,
    String statusApartamento,
    @NotNull(message = "Prédio é obrigatório")
    PredioId predio
) {}
