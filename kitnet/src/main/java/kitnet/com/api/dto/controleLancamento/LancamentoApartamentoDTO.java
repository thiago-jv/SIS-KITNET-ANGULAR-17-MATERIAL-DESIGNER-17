package kitnet.com.api.dto.controleLancamento;

public record LancamentoApartamentoDTO(
    Long idLancamento,
    String dataEntrada,
    String nomeInquilino,
    String valor,
    String predio,
    String numeroQuarto,
    String cep,
    String bairro,
    String uf,
    String localidade,
    String logradouro
) {}
