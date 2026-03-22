
package kitnet.com.api.dto.controleLancamento;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RelatorioGerencialDTO {
    // Informações do Inquilino
    private Long inquilinoId;
    private String nomeInquilino;
    private String cpfInquilino;
    private String contatoInquilino;
    private String emailInquilino;
    private String statusInquilino;

    // Informações do Apartamento
    private Long apartamentoId;
    private String numeroApartamento;
    private String descricaoApartamento;
    private String statusApartamento;

    // Informações do Prédio
    private Long predioId;
    private String nomePredio;
    private String numeroPredio;
    private String enderecoPredio; // Logradouro completo
    private String bairroPredio;
    private String cidadePredio;
    private String ufPredio;
    private String cepPredio;

    // Informações do Lançamento/Controle
    private Long lancamentoId;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataEntrada;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataPagamento;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataLancamento;

    private Long diasLocacao;
    private String observacao;

    // Informações Financeiras
    private BigDecimal valorApartamento; // Total a receber
    private BigDecimal valorPagoApartamento; // Total já recebido
    private BigDecimal valorDebitoApartamento; // Saldo devedor
    private BigDecimal valorDiaria;
    private BigDecimal valorTotalDiaria;
    private BigDecimal percentualAdimplencia; // Calculado: (valorPago / valorTotal) * 100

    // Status e Controle
    private String statusPagamento; // PAGO, DEBITO
    private Boolean statusControle; // Ativo/Inativo
    private Boolean pagamentoVencido; // Se dataPagamento < hoje e status = DEBITO
    private Long diasAtraso; // Dias de atraso caso vencido

    private String statusPagamentoDescricao;
}
