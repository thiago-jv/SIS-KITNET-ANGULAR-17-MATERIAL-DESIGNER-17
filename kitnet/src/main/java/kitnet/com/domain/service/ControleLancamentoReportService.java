package kitnet.com.domain.service;

import kitnet.com.api.dto.controleLancamento.RelatorioGerencialDTO;

import java.util.List;

public interface ControleLancamentoReportService {

    byte[] relatorioDeLancamentos(Long idLancamento);

    byte[] gerarRelatorioGerencialPdf(
            List<RelatorioGerencialDTO> dados,
            Long predioId,
            Long apartamentoId,
            Long inquilinoId,
            java.time.LocalDate dataInicio,
            java.time.LocalDate dataFim,
            String statusPagamento);
}
