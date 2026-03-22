
package kitnet.com.api.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AuthRequestDTO(
    @NotBlank(message = "O e-mail é obrigatório.")
    @Email(message = "E-mail inválido.")
    @Size(max = 100, message = "O e-mail deve ter no máximo 100 caracteres.")
    String email,

    @NotBlank(message = "A senha é obrigatória.")
    @Size(min = 5, max = 64, message = "A senha deve ter entre 5 e 64 caracteres.")
    String senha
) {}
