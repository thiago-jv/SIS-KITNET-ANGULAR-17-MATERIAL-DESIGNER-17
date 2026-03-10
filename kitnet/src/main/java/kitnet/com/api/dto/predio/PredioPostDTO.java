package kitnet.com.api.dto.predio;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record PredioPostDTO(
    @NotBlank(message = "Descrição é obrigatória")
    @Size(max = 255, message = "Descrição deve ter no máximo 255 caracteres")
    String descricao,
    @Pattern(regexp = "\\d{8}", message = "CEP deve conter 8 dígitos")
    String cep,
    @Size(max = 255, message = "Logradouro deve ter no máximo 255 caracteres")
    String logradouro,
    @Size(max = 255, message = "Complemento deve ter no máximo 255 caracteres")
    String complemento,
    @Size(max = 100, message = "Bairro deve ter no máximo 100 caracteres")
    String bairro,
    @Size(min = 2, max = 2, message = "UF deve ter 2 caracteres")
    String uf,
    @Size(max = 100, message = "Localidade deve ter no máximo 100 caracteres")
    String localidade,
    @Size(max = 20, message = "Número deve ter no máximo 20 caracteres")
    String numero
) {
    public String getCep() {
       if(this.cep != null){
          return this.cep.replaceAll("\\D", "");
       }
        return null;
    }
}
