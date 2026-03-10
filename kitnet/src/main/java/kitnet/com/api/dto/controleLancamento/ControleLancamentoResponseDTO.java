package kitnet.com.api.dto.controleLancamento;

import kitnet.com.api.dto.apartamento.ApartamentoId;
import kitnet.com.api.dto.inquilino.InquilinoId;
import kitnet.com.api.dto.valor.ValorId;

import java.time.LocalDate;

public record ControleLancamentoResponseDTO(
    Long id,
    LocalDate dataLancamento,
    LocalDate dataEntrada,
    LocalDate dataPagamento,
    String observacao,
    StatusDTO status,
    ValorRegraDTO valores,
    ValorId valor,
    InquilinoId inquilino,
    ApartamentoId apartamento,
    String nomeInquilino,
    String numeroApartamento
) {}
