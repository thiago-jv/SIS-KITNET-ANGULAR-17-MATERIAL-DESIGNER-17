package kitnet.com.api.dto.apartamento;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ApartamentoResponseDTO {

    private Long id;
    private String descricao;
    private String numero;

}
