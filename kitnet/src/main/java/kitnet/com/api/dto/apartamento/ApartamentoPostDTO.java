package kitnet.com.api.dto.apartamento;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApartamentoPostDTO {

    @NotNull
    @NotBlank
    @Size(max=100)
    private String descricao;

    @NotNull
    @NotBlank
    @Size(max=5)
    private String numero;


}
