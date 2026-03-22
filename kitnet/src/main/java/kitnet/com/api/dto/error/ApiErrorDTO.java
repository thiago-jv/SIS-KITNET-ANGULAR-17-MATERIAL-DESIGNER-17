package kitnet.com.api.dto.error;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "ApiError", description = "Resposta padrão de erro da API")
public class ApiErrorDTO {

    @Schema(description = "Mensagem de erro detalhada", example = "Recurso não encontrado")
    private String message;

    public ApiErrorDTO() {}
    public ApiErrorDTO(String message) { this.message = message; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
