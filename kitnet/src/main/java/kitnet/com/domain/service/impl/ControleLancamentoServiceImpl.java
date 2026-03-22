
package kitnet.com.domain.service.impl;

import kitnet.com.api.dto.controleLancamento.*;
import kitnet.com.api.handler.ControleLancamentoNaoEncontadoException;
import kitnet.com.api.handler.EntidadeEmUsoException;
import kitnet.com.api.handler.PredioNaoEncontadoException;
import kitnet.com.api.mapper.ControleLancamentoMapper;
import kitnet.com.api.mapper.RelatorioGerencialMapper;
import kitnet.com.domain.model.*;
import kitnet.com.domain.model.lancamento.interfaces.CalculadoraDias;
import kitnet.com.domain.model.lancamento.interfaces.CalculadoraValorDiaria;
import kitnet.com.domain.model.lancamento.interfaces.CalculadoraValorPago;
import kitnet.com.domain.repository.ControleLancamentoRepository;
import kitnet.com.domain.service.ApartamentoService;
import kitnet.com.domain.service.ApartamentoStatusService;
import kitnet.com.domain.service.ControleLancamentoReportService;
import kitnet.com.domain.service.ControleLancamentoService;
import kitnet.com.domain.validator.ControleLancamentoValidator;
import kitnet.com.infra.utils.ApartamentoMessages;
import kitnet.com.infra.utils.Constantes;
import kitnet.com.infra.utils.ControleMessages;
import lombok.SneakyThrows;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
@RequiredArgsConstructor

@Service
public class ControleLancamentoServiceImpl implements ControleLancamentoService {

    private final ControleLancamentoRepository controleLancamentoRepository;
    private final ApartamentoService apartamentoService;
    private final CalculadoraDias calculaDias;
    private final CalculadoraValorPago calcularValorPago;
    private final ControleLancamentoMapper controleLancamentoMapper;
    private final RelatorioGerencialMapper relatorioGerencialMapper;
    private final CalculadoraValorDiaria calculaValoresDiaria;
    private final ControleLancamentoReportService controleLancamentoReportService;
    private final ControleLancamentoValidator controleLancamentoValidator;
    private final ControleLancamentoRenovacaoService controleLancamentoRenovacaoService;
    private final ControleLancamentoStatusService controleLancamentoStatusService;
    private final ApartamentoStatusService apartamentoStatusService;

    @Override
    public Page<ControleLancamentoResponseDTO> buscarComFiltro(ControleFilterDTO controleFilterDTO, Pageable pageable) {
        Page<ControleLancamento> controlePage = controleLancamentoRepository.filtrar(controleFilterDTO, pageable);
        Page<ControleLancamentoResponseDTO> controleResponse = controleLancamentoMapper.toPageControleResponse(controlePage);
        return controleResponse;
    }

    @Transactional
	@SneakyThrows
    @Override
    public ControleLancamentoResponseDTO salvar(ControleLancamentoPostDTO controleLancamentoPostDTO) {
        var controleLancamento = controleLancamentoMapper.toControleLancamento(controleLancamentoPostDTO);
        var apartamento = buscarApartamento(controleLancamento);
        controleLancamento.getStatus().setStatusApartamePagamento(Constantes.DEBITO);
        calculaDias.calculaDia(controleLancamento);
        calculaValoresDiaria.calculaDiaria(controleLancamento);
        calcularValorPago.calcularValorPagoApartamento(controleLancamento);
        controleLancamentoValidator.validaInquilinoEApartamentoPorDataDeEntrada(controleLancamento);

        controleLancamentoStatusService.ajustarStatusPorDebito(controleLancamento);

        controleLancamento.setDataLancamento(LocalDate.now());
        apartamentoStatusService.marcarComoOcupado(apartamento);
        var controleLancamentoSalvo = controleLancamentoRepository.save(controleLancamento);
        return controleLancamentoMapper.toControleLancamentoResponse(controleLancamentoSalvo);
    }

    @Override
    public ControleLancamentoResponseDTO buscarOuFalhar(Long idControle) {
        var controleLancamento = buscarEntidadeOuFalhar(idControle);
        return controleLancamentoMapper.toControleLancamentoResponse(controleLancamento);
    }

    private ControleLancamento buscarEntidadeOuFalhar(Long idControle) {
        return controleLancamentoRepository.findById(idControle)
                .orElseThrow(() -> new ControleLancamentoNaoEncontadoException(idControle));
    }

    @Transactional
	@Override
    public void excluir(Long idControle) {
        try {
            var lancamento = buscarEntidadeOuFalhar(idControle);
            apartamentoStatusService.marcarComoDisponivelPorId(lancamento.getApartamento().getId());
            controleLancamentoRepository.deleteById(idControle);
            controleLancamentoRepository.flush();
        } catch (EmptyResultDataAccessException e) {
            throw new PredioNaoEncontadoException(idControle);
        } catch (DataIntegrityViolationException e) {
            throw new EntidadeEmUsoException(String.format(ControleMessages.MSG_CONTROLE_EM_USO, idControle));
        }
    }

    @Transactional
	@Override
    public void alternarStatusControle(Long id) {

        var controleSalva = buscarEntidadeOuFalhar(id);
        var apartamento = buscarApartamento(controleSalva);
        var status = controleSalva.getStatus();

        if (status == null) {
            throw new EntidadeEmUsoException("Status do lançamento não informado");
        }

        if (!Constantes.PAGO.equals(status.getStatusApartamePagamento())) {
            throw new EntidadeEmUsoException(String.format(ApartamentoMessages.MSG_APARTAMENTO_DEBITO, apartamento.getId()));
        }

        boolean novoStatusControle = !status.isStatusControle();
        status.setStatusControle(novoStatusControle);

        apartamentoStatusService.alternarStatus(apartamento, novoStatusControle);
        controleLancamentoRepository.save(controleSalva);
    }

    private Apartamento buscarApartamento(ControleLancamento controleLancamento) {
        Long codigoApartamento = controleLancamento.getApartamento().getId();
        return apartamentoService.buscarOuFalhar(codigoApartamento);
    }

    @Transactional
	@Override
    public ControleLancamentoResponseDTO atualizar(Long idControle, ControleLancamentoPutDTO controleLancamentoPutDTO) {
        var controleLancamento = controleLancamentoMapper.toControleLancamento(controleLancamentoPutDTO);
        ControleLancamento controleLancamentoSalva = this.controleLancamentoRepository.findById(idControle)
                .orElseThrow(() -> new EmptyResultDataAccessException(1));
        BeanUtils.copyProperties(controleLancamento, controleLancamentoSalva, "id");
        calculaDias.calculaDia(controleLancamentoSalva);
        calculaValoresDiaria.calculaDiaria(controleLancamentoSalva);
        calcularValorPago.calcularValorPagoApartamento(controleLancamentoSalva);

        controleLancamentoStatusService.ajustarStatusPorDebito(controleLancamentoSalva);

        var controleAtualizado = this.controleLancamentoRepository.save(controleLancamentoSalva);
        return controleLancamentoMapper.toControleLancamentoResponse(controleAtualizado);
    }

    @Override
    public byte[] gerarRelatorioPdf(Long idLancamento) {
        return controleLancamentoReportService.relatorioDeLancamentos(idLancamento);
    }

    @Transactional
	@Override
    public List<ControleLancamentoResponseDTO> renovarLancamento(Long idLancamento, Integer quantidadeMeses) {
        var renovados = controleLancamentoRenovacaoService.renovarLancamento(idLancamento, quantidadeMeses);
        return controleLancamentoMapper.toListControleLancamentoResponse(renovados);
    }

        private List<RelatorioGerencialDTO> gerarRelatorioGerencial(
            Long predioId,
            Long apartamentoId,
            Long inquilinoId,
            LocalDate dataInicio,
            LocalDate dataFim,
            String statusPagamento) {

        List<ControleLancamento> lancamentos = controleLancamentoRepository.buscarDadosRelatorioGerencial(
            predioId, apartamentoId, inquilinoId, dataInicio, dataFim, statusPagamento);

        return lancamentos.stream()
            .map(relatorioGerencialMapper::toDto)
            .collect(java.util.stream.Collectors.toList());
        }

    @Override
    public byte[] gerarRelatorioGerencialPdf(
            Long predioId,
            Long apartamentoId,
            Long inquilinoId,
            LocalDate dataInicio,
            LocalDate dataFim,
            String statusPagamento) {

        var dados = gerarRelatorioGerencial(predioId, apartamentoId, inquilinoId, dataInicio, dataFim, statusPagamento);

        return controleLancamentoReportService.gerarRelatorioGerencialPdf(
                dados, predioId, apartamentoId, inquilinoId, dataInicio, dataFim, statusPagamento);
    }

    @Override
    public List<ControleLancamentoResponseDTO> listarTodos() {
        return controleLancamentoMapper.toListControleLancamentoResponse(controleLancamentoRepository.findAll());
    }
  
}
