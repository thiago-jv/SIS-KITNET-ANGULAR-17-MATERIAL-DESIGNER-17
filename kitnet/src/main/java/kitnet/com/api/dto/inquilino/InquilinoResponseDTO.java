package kitnet.com.api.dto.inquilino;

public record InquilinoResponseDTO(
    Long id,
    String nome,
    String nomeAbreviado,
    String email,
    String contato,
    String status,
    String genero,
    String cpf,
    String rg
) {}
