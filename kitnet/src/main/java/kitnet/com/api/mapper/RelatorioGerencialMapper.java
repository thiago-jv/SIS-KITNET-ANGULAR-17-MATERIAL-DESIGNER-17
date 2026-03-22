package kitnet.com.api.mapper;

import kitnet.com.api.dto.controleLancamento.RelatorioGerencialDTO;
import kitnet.com.domain.model.ControleLancamento;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class RelatorioGerencialMapper {

    public RelatorioGerencialDTO toDto(ControleLancamento lancamento) {
        var inquilino = lancamento.getInquilino();
        var apartamento = lancamento.getApartamento();
        var predio = apartamento.getPredio();
        var valores = lancamento.getValores();
        var status = lancamento.getStatus();

        BigDecimal percentualAdimplencia = calcularPercentualAdimplencia(valores.getValorApartamento(), valores.getValorPagoApartamento());
        VencimentoInfo vencimentoInfo = calcularVencimento(lancamento.getDataPagamento(), status.getStatusApartamePagamento());
        String statusPagamento = status.getStatusApartamePagamento();
        String statusDescricao = descreverStatusPagamento(statusPagamento, vencimentoInfo.pagamentoVencido(), vencimentoInfo.diasAtraso());

        return new RelatorioGerencialDTO(
            inquilino.getId(),
            inquilino.getNome(),
            inquilino.getCpf(),
            inquilino.getContato(),
            inquilino.getEmail(),
            inquilino.getStatus(),

            apartamento.getId(),
            apartamento.getNumeroApartamento(),
            apartamento.getDescricao(),
            apartamento.getStatusApartamento(),

            predio.getId(),
            predio.getDescricao(),
            predio.getNumero(),
            predio.getLogradouro(),
            predio.getBairro(),
            predio.getLocalidade(),
            predio.getUf(),
            predio.getCep(),

            lancamento.getId(),
            lancamento.getDataEntrada(),
            lancamento.getDataPagamento(),
            lancamento.getDataLancamento(),
            valores.getDia(),
            lancamento.getObservacao(),

            valores.getValorApartamento(),
            valores.getValorPagoApartamento(),
            valores.getValorDebitoApartamento(),
            valores.getValorDiaria(),
            valores.getValorTotalDiaria(),
            percentualAdimplencia,

            statusPagamento,
            status.isStatusControle(),
            vencimentoInfo.pagamentoVencido(),
            vencimentoInfo.diasAtraso(),
            statusDescricao
        );
    }

    private BigDecimal calcularPercentualAdimplencia(BigDecimal valorApartamento, BigDecimal valorPagoApartamento) {
        if (valorApartamento != null && valorApartamento.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal percentual = valorPagoApartamento
                    .divide(valorApartamento, 4, java.math.RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
            return percentual.setScale(2, java.math.RoundingMode.HALF_UP);
        } else {
            return BigDecimal.ZERO;
        }
    }

    private record VencimentoInfo(Boolean pagamentoVencido, Long diasAtraso) {}

    private VencimentoInfo calcularVencimento(LocalDate dataPagamento, String statusPagamento) {
        if (dataPagamento != null && statusPagamento != null) {
            LocalDate hoje = LocalDate.now();
            boolean vencido = dataPagamento.isBefore(hoje) && "DEBITO".equals(statusPagamento);
            long dias = vencido ? java.time.temporal.ChronoUnit.DAYS.between(dataPagamento, hoje) : 0L;
            return new VencimentoInfo(vencido, dias);
        }
        return new VencimentoInfo(null, null);
    }

    private String descreverStatusPagamento(String statusPagamento, Boolean pagamentoVencido, Long diasAtraso) {
        if (Boolean.TRUE.equals(pagamentoVencido)) {
            return "VENCIDO (" + diasAtraso + " dias)";
        } else if ("DEBITO".equals(statusPagamento)) {
            return "PENDENTE";
        } else if ("PAGO".equals(statusPagamento)) {
            return "PAGO";
        } else if (statusPagamento == null || statusPagamento.isEmpty()) {
            return "SEM STATUS";
        } else {
            return statusPagamento;
        }
    }
}
