package kitnet.com.domain.service.impl;

import kitnet.com.api.dto.controleLancamento.RelatorioGerencialDTO;
import kitnet.com.api.handler.ReportException;
import kitnet.com.api.mapper.ControleLancamentoMapper;
import kitnet.com.domain.repository.ControleLancamentoRepository;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;

@Service
public class ControleLancamentoReportServiceImpl implements kitnet.com.domain.service.ControleLancamentoReportService {

    @Autowired
    private ControleLancamentoRepository controleLancamentoRepository;

    @Autowired
    private ControleLancamentoMapper controleLancamentoMapper;

    public byte[] relatorioDeLancamentos(Long idLancamento) {
        try {
            var dados = controleLancamentoRepository.listaControleLancamentosPorId(idLancamento);
            var dataSource = new JRBeanCollectionDataSource(controleLancamentoMapper.toListLancamentoApartamentoDTO(dados));

            var parametros = new HashMap<String, Object>();
            parametros.put("ID_LANCAMENTO", idLancamento);
            parametros.put("REPORT_LOCALE", new Locale("pt", "BR"));

            var inputStream = this.getClass().getResourceAsStream("/relatorios/lancamentocontrolebyid.jasper");
            var jasperPrint = JasperFillManager.fillReport(inputStream, parametros, dataSource);

            return JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (Exception e) {
            throw new ReportException("Não foi possível emitir relatório", e);
        }
    }

    public byte[] gerarRelatorioGerencialPdf(
            List<RelatorioGerencialDTO> dados,
            Long predioId,
            Long apartamentoId,
            Long inquilinoId,
            java.time.LocalDate dataInicio,
            java.time.LocalDate dataFim,
            String statusPagamento) {
        try {
            var dataSource = new JRBeanCollectionDataSource(dados);

            var parametros = new HashMap<String, Object>();
            parametros.put("REPORT_LOCALE", new Locale("pt", "BR"));

            parametros.put("PREDIO_ID", predioId != null ? "Prédio: " + predioId : null);
            parametros.put("APARTAMENTO_ID", apartamentoId != null ? "Apartamento: " + apartamentoId : null);
            parametros.put("INQUILINO_ID", inquilinoId != null ? "Inquilino: " + inquilinoId : null);
            parametros.put("DATA_INICIO", dataInicio != null ? dataInicio.format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy")) : null);
            parametros.put("DATA_FIM", dataFim != null ? dataFim.format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy")) : null);
            parametros.put("STATUS_PAGAMENTO", statusPagamento != null && !statusPagamento.isEmpty() ? statusPagamento : null);
            parametros.put("TOTAL_REGISTROS", dados.size());

            var inputStream = this.getClass().getResourceAsStream("/relatorios/relatorio-gerencial.jasper");
            var jasperPrint = JasperFillManager.fillReport(inputStream, parametros, dataSource);

            return JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (Exception e) {
            throw new ReportException("Não foi possível emitir relatório gerencial", e);
        }
    }
}

