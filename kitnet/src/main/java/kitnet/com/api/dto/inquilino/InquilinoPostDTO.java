package kitnet.com.api.dto.inquilino;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record InquilinoPostDTO(
    Long id,
    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 255, message = "Nome deve ter no máximo 255 caracteres")
    String nome,
    @Size(max = 100, message = "Nome abreviado deve ter no máximo 100 caracteres")
    String nomeAbreviado,
    @Email(message = "Email deve ser válido")
    @Size(max = 255, message = "Email deve ter no máximo 255 caracteres")
    String email,
    @Size(max = 50, message = "Contato deve ter no máximo 50 caracteres")
    String contato,
    String status,
    String genero,
    String cpf,
    @Size(max = 20, message = "RG deve ter no máximo 20 caracteres")
    String rg
) {}
