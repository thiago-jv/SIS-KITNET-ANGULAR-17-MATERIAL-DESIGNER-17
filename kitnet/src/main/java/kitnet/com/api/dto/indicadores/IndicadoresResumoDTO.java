package kitnet.com.api.dto.indicadores;

import java.math.BigDecimal;

public record IndicadoresResumoDTO(
    Long totalApartamentos,
    Long totalApartamentosAlugados,
    Long totalApartamentosVagos,
    BigDecimal receitaPrevista,
    BigDecimal totalRecebido,
    BigDecimal totalDebito,
    BigDecimal totalEmAberto,
    Double taxaOcupacao,
    Double taxaInadimplencia,
    Double taxaPagamento,
    Long totalPagamentos,
    Long pagamentosVencidos,
    BigDecimal somaAlugueisEmAberto,
    BigDecimal totalDebitoReal
) {}
