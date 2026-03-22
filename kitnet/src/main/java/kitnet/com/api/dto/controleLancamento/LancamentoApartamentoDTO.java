package kitnet.com.api.dto.controleLancamento;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LancamentoApartamentoDTO {
    private Long idLancamento;
    private String dataEntrada;
    private String nomeInquilino;
    private String valor;
    private String predio;
    private String numeroQuarto;
    private String cep;
    private String bairro;
    private String uf;
    private String localidade;
    private String logradouro;
}
