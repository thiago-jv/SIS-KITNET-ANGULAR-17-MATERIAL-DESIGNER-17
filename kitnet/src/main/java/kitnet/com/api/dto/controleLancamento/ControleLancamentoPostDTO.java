package kitnet.com.api.dto.controleLancamento;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import kitnet.com.api.dto.apartamento.ApartamentoId;
import kitnet.com.api.dto.inquilino.InquilinoId;
import kitnet.com.api.dto.valor.ValorId;
import java.time.LocalDate;

public record ControleLancamentoPostDTO(
    @NotNull(message = "Data de entrada é obrigatória")
    LocalDate dataEntrada,
    LocalDate dataPagamento,
    @Size(max = 500, message = "Observação deve ter no máximo 500 caracteres")
    String observacao,
    @Valid
    StatusDTO status,
    @Valid
    ValorRegraDTO valores,
    @NotNull(message = "Valor é obrigatório")
    ValorId valor,
    @NotNull(message = "Inquilino é obrigatório")
    InquilinoId inquilino,
    @NotNull(message = "Apartamento é obrigatório")
    ApartamentoId apartamento
) {}
