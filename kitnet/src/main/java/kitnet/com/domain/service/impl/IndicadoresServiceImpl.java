package kitnet.com.domain.service.impl;

import kitnet.com.api.dto.indicadores.IndicadoresResumoDTO;
import kitnet.com.api.dto.indicadores.StatusFiltroControle;
import kitnet.com.domain.repository.ApartamentoRepository;
import kitnet.com.domain.repository.ControleLancamentoRepository;
import kitnet.com.domain.service.IndicadoresService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
public class IndicadoresServiceImpl implements IndicadoresService {

    @Autowired
    private ApartamentoRepository apartamentoRepository;

    @Autowired
    private ControleLancamentoRepository controleLancamentoRepository;

    @Override
    public IndicadoresResumoDTO obterResumo(LocalDate dataInicio, LocalDate dataFim, StatusFiltroControle status) {
        long totalApartamentos = apartamentoRepository.count();
        
        Boolean statusControle = mapStatusToStatusControle(status);
        ControleLancamentoRepository.IndicadoresResumoProjection metricas =
                buscarMetricasConsolidadas(dataInicio, dataFim, statusControle);

        long totalAlugados = extrairTotalApartamentosAlugados(metricas);
        long totalVagos = calcularTotalApartamentosVagos(totalApartamentos, totalAlugados);
        
        BigDecimal receitaPrevista = extrairReceitaPrevista(metricas);
        BigDecimal totalRecebido = extrairTotalRecebido(metricas);
        BigDecimal totalDebito = extrairTotalDebito(metricas);
        
        long totalPagamentos = extrairTotalPagamentos(metricas);
        long pagamentosVencidos = extrairPagamentosVencidos(metricas);

        Double taxaOcupacao = calcularTaxaOcupacao(totalApartamentos, totalAlugados);
        Double taxaInadimplencia = calcularTaxaInadimplencia(receitaPrevista, totalDebito);
        Double taxaPagamento = calcularTaxaPagamento(receitaPrevista, totalRecebido);

        return construirResumoDTO(
                totalApartamentos, totalAlugados, totalVagos,
                receitaPrevista, totalRecebido, totalDebito,
                taxaOcupacao, taxaInadimplencia, taxaPagamento,
                totalPagamentos, pagamentosVencidos
        );
    }

    private ControleLancamentoRepository.IndicadoresResumoProjection buscarMetricasConsolidadas(
            LocalDate dataInicio, LocalDate dataFim, Boolean statusControle) {
        return controleLancamentoRepository.obterResumoConsolidado(dataInicio, dataFim, statusControle);
    }

    private long extrairTotalApartamentosAlugados(ControleLancamentoRepository.IndicadoresResumoProjection metricas) {
        return metricas != null && metricas.getTotalApartamentosAlugados() != null
                ? metricas.getTotalApartamentosAlugados()
                : 0L;
    }

    private long calcularTotalApartamentosVagos(long totalApartamentos, long totalAlugados) {
        return Math.max(totalApartamentos - totalAlugados, 0);
    }

    private BigDecimal extrairReceitaPrevista(ControleLancamentoRepository.IndicadoresResumoProjection metricas) {
        return metricas != null && metricas.getReceitaPrevista() != null
                ? metricas.getReceitaPrevista()
                : BigDecimal.ZERO;
    }

    private BigDecimal extrairTotalRecebido(ControleLancamentoRepository.IndicadoresResumoProjection metricas) {
        return metricas != null && metricas.getTotalRecebido() != null
                ? metricas.getTotalRecebido()
                : BigDecimal.ZERO;
    }

    private BigDecimal extrairTotalDebito(ControleLancamentoRepository.IndicadoresResumoProjection metricas) {
        return metricas != null && metricas.getTotalDebito() != null
                ? metricas.getTotalDebito()
                : BigDecimal.ZERO;
    }

    private long extrairTotalPagamentos(ControleLancamentoRepository.IndicadoresResumoProjection metricas) {
        return metricas != null && metricas.getTotalPagamentos() != null
                ? metricas.getTotalPagamentos()
                : 0L;
    }

    private long extrairPagamentosVencidos(ControleLancamentoRepository.IndicadoresResumoProjection metricas) {
        return metricas != null && metricas.getPagamentosVencidos() != null
                ? metricas.getPagamentosVencidos()
                : 0L;
    }

    private Double calcularTaxaOcupacao(long totalApartamentos, long totalAlugados) {
        return totalApartamentos > 0 
                ? (totalAlugados * 100.0) / totalApartamentos 
                : 0.0;
    }

    private Double calcularTaxaInadimplencia(BigDecimal receitaPrevista, BigDecimal totalDebito) {
        return receitaPrevista.compareTo(BigDecimal.ZERO) > 0
                ? totalDebito.multiply(BigDecimal.valueOf(100))
                        .divide(receitaPrevista, 2, java.math.RoundingMode.HALF_UP)
                        .doubleValue()
                : 0.0;
    }

    private Double calcularTaxaPagamento(BigDecimal receitaPrevista, BigDecimal totalRecebido) {
        return receitaPrevista.compareTo(BigDecimal.ZERO) > 0
                ? totalRecebido.multiply(BigDecimal.valueOf(100))
                        .divide(receitaPrevista, 2, java.math.RoundingMode.HALF_UP)
                        .doubleValue()
                : 0.0;
    }

    private IndicadoresResumoDTO construirResumoDTO(
            long totalApartamentos, long totalAlugados, long totalVagos,
            BigDecimal receitaPrevista, BigDecimal totalRecebido, BigDecimal totalDebito,
            Double taxaOcupacao, Double taxaInadimplencia, Double taxaPagamento,
            long totalPagamentos, long pagamentosVencidos) {
        
        return new IndicadoresResumoDTO(
                totalApartamentos,
                totalAlugados,
                totalVagos,
                receitaPrevista,
                totalRecebido,
                totalDebito,
                totalDebito,
                taxaOcupacao,
                taxaInadimplencia,
                taxaPagamento,
                totalPagamentos,
                pagamentosVencidos,
                receitaPrevista,
                totalDebito
        );
    }

    private Boolean mapStatusToStatusControle(StatusFiltroControle status) {
        if (status == null || status == StatusFiltroControle.AMBOS) {
            return null;
        }
        return status == StatusFiltroControle.ABERTO;
    }
}
