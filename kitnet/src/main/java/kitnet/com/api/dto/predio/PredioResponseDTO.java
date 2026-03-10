package kitnet.com.api.dto.predio;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record PredioResponseDTO(
    Long id,
    String descricao,
    String cep,
    String logradouro,
    String complemento,
    String bairro,
    String uf,
    String localidade,
    String numero
) {}
