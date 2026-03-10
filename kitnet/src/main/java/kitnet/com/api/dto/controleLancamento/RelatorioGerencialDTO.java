package kitnet.com.api.dto.controleLancamento;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
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
    
    public RelatorioGerencialDTO() {
    }
    
    /**
     * Calcula o percentual de adimplência baseado no valor pago vs valor total
     */
    public void calcularPercentualAdimplencia() {
        if (valorApartamento != null && valorApartamento.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal percentual = valorPagoApartamento
                    .divide(valorApartamento, 4, java.math.RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
            this.percentualAdimplencia = percentual.setScale(2, java.math.RoundingMode.HALF_UP);
        } else {
            this.percentualAdimplencia = BigDecimal.ZERO;
        }
    }
    
    /**
     * Verifica se o pagamento está vencido
     */
    public void verificarVencimento() {
        if (dataPagamento != null && statusPagamento != null) {
            LocalDate hoje = LocalDate.now();
            this.pagamentoVencido = dataPagamento.isBefore(hoje) && "DEBITO".equals(statusPagamento);
            
            if (this.pagamentoVencido) {
                this.diasAtraso = java.time.temporal.ChronoUnit.DAYS.between(dataPagamento, hoje);
            } else {
                this.diasAtraso = 0L;
            }
        }
    }
    
    /**
     * Monta o endereço completo do prédio
     */
    public String getEnderecoCompleto() {
        StringBuilder endereco = new StringBuilder();
        if (enderecoPredio != null && !enderecoPredio.isEmpty()) {
            endereco.append(enderecoPredio);
        }
        if (numeroPredio != null && !numeroPredio.isEmpty()) {
            endereco.append(", ").append(numeroPredio);
        }
        if (bairroPredio != null && !bairroPredio.isEmpty()) {
            endereco.append(" - ").append(bairroPredio);
        }
        if (cidadePredio != null && !cidadePredio.isEmpty()) {
            endereco.append(" - ").append(cidadePredio);
        }
        if (ufPredio != null && !ufPredio.isEmpty()) {
            endereco.append("/").append(ufPredio);
        }
        if (cepPredio != null && !cepPredio.isEmpty()) {
            endereco.append(" - CEP: ").append(cepPredio);
        }
        return endereco.toString();
    }
    
    /**
     * Retorna descrição amigável do status de pagamento
     */
    public String getStatusPagamentoDescricao() {
        if (pagamentoVencido != null && pagamentoVencido) {
            return "VENCIDO (" + diasAtraso + " dias)";
        }
        if ("DEBITO".equals(statusPagamento)) {
            return "PENDENTE";
        }
        if ("PAGO".equals(statusPagamento)) {
            return "PAGO";
        }
        if (statusPagamento == null || statusPagamento.isEmpty()) {
            return "SEM STATUS";
        }
        return statusPagamento;
    }
}
