package kitnet.com.api.dto.inquilino;

public record InquilinoFilterDTO(
    String nome,
    String cpf,
    String rg,
    String status
) {}
