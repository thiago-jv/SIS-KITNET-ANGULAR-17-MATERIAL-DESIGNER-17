package kitnet.com.domain.service.impl;

import kitnet.com.api.handler.ControleLancamentoNaoEncontadoException;
import kitnet.com.api.handler.EntidadeEmUsoException;
import kitnet.com.domain.model.Apartamento;
import kitnet.com.domain.model.ControleLancamento;
import kitnet.com.domain.model.Status;
import kitnet.com.domain.model.ValorRegra;
import kitnet.com.domain.model.lancamento.interfaces.CalculadoraDias;
import kitnet.com.domain.model.lancamento.interfaces.CalculadoraValorDiaria;
import kitnet.com.domain.model.lancamento.interfaces.CalculadoraValorPago;
import kitnet.com.domain.repository.ControleLancamentoRepository;
import kitnet.com.domain.service.ApartamentoService;
import kitnet.com.domain.service.ApartamentoStatusService;
import kitnet.com.domain.validator.ControleLancamentoValidator;
import kitnet.com.infra.utils.Constantes;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
public class ControleLancamentoRenovacaoService {

    @Autowired
    private ControleLancamentoRepository controleLancamentoRepository;

    @Autowired
    private ApartamentoService apartamentoService;

    @Autowired
    private CalculadoraDias calculaDias;

    @Autowired
    private CalculadoraValorPago calcularValorPago;

    @Autowired
    private CalculadoraValorDiaria calculaValoresDiaria;

    @Autowired
    private ControleLancamentoValidator controleLancamentoValidator;

    @Autowired
    private ControleLancamentoStatusService controleLancamentoStatusService;

    @Autowired
    private ApartamentoStatusService apartamentoStatusService;

    public List<ControleLancamento> renovarLancamento(Long idLancamento, Integer quantidadeMeses) {
        validarQuantidadeMeses(quantidadeMeses);
        
        ControleLancamento lancamentoOriginal = buscarOuFalhar(idLancamento);
        validarInquilinoEApartamento(lancamentoOriginal);
        
        ControleLancamento novoLancamento = criarNovoLancamento(lancamentoOriginal);
        
        validarECalcularLancamento(novoLancamento);
        
        ControleLancamento lancamentoSalvo = salvarLancamento(novoLancamento);
        
        return List.of(lancamentoSalvo);
    }

    private void validarQuantidadeMeses(Integer quantidadeMeses) {
        if (quantidadeMeses == null || quantidadeMeses != 1) {
            throw new EntidadeEmUsoException("A renovação permite apenas o próximo mês (quantidadeMeses = 1)");
        }
    }

    private void validarInquilinoEApartamento(ControleLancamento lancamento) {
        if (Objects.isNull(lancamento.getInquilino()) || Objects.isNull(lancamento.getApartamento())) {
            throw new EntidadeEmUsoException("Inquilino ou apartamento não encontrado");
        }
    }

    private ControleLancamento criarNovoLancamento(ControleLancamento lancamentoOriginal) {
        ControleLancamento novoLancamento = new ControleLancamento();
        
        configurarInquilinoEApartamento(novoLancamento, lancamentoOriginal);
        configurarValor(novoLancamento, lancamentoOriginal);
        configurarDatas(novoLancamento, lancamentoOriginal);
        configurarStatus(novoLancamento, lancamentoOriginal);
        configurarValores(novoLancamento, lancamentoOriginal);
        
        return novoLancamento;
    }

    private void configurarInquilinoEApartamento(ControleLancamento novoLancamento, 
                                                  ControleLancamento lancamentoOriginal) {
        novoLancamento.setInquilino(lancamentoOriginal.getInquilino());
        
        Apartamento apartamentoAtual = buscaApartamentos(lancamentoOriginal);
        apartamentoStatusService.marcarComoOcupado(apartamentoAtual);
        novoLancamento.setApartamento(apartamentoAtual);
    }

    private void configurarValor(ControleLancamento novoLancamento, ControleLancamento lancamentoOriginal) {
        novoLancamento.setValor(lancamentoOriginal.getValor());
    }

    private void configurarDatas(ControleLancamento novoLancamento, ControleLancamento lancamentoOriginal) {
        LocalDate novaDataEntrada = lancamentoOriginal.getDataEntrada().plusMonths(1);
        LocalDate novaDataPagamento = lancamentoOriginal.getDataPagamento().plusMonths(1);
        
        novoLancamento.setDataEntrada(novaDataEntrada);
        novoLancamento.setDataPagamento(novaDataPagamento);
        novoLancamento.setDataLancamento(LocalDate.now());
        novoLancamento.setObservacao(null);
    }

    private void configurarStatus(ControleLancamento novoLancamento, ControleLancamento lancamentoOriginal) {
        Status novoStatus = new Status();
        BeanUtils.copyProperties(lancamentoOriginal.getStatus(), novoStatus, "id");
        novoStatus.setStatusApartamePagamento(Constantes.DEBITO);
        novoStatus.setStatusControle(true);
        novoLancamento.setStatus(novoStatus);
    }

    private void configurarValores(ControleLancamento novoLancamento, ControleLancamento lancamentoOriginal) {
        ValorRegra novoValores = new ValorRegra();
        novoValores.setValorApartamento(lancamentoOriginal.getValores().getValorApartamento());
        novoValores.setValorPagoApartamento(BigDecimal.ZERO);
        novoValores.setValorDebitoApartamento(BigDecimal.ZERO);
        novoLancamento.setValores(novoValores);
    }

    private void validarECalcularLancamento(ControleLancamento novoLancamento) {
        controleLancamentoValidator.validaInquilinoEApartamentoPorDataDeEntrada(novoLancamento);
        
        executarCalculos(novoLancamento);
        
        controleLancamentoStatusService.ajustarStatusPorDebito(novoLancamento);
    }

    private void executarCalculos(ControleLancamento novoLancamento) {
        calculaDias.calculaDia(novoLancamento);
        calculaValoresDiaria.calculaDiaria(novoLancamento);
        calcularValorPago.calcularValorPagoApartamento(novoLancamento);
    }

    private ControleLancamento salvarLancamento(ControleLancamento novoLancamento) {
        return controleLancamentoRepository.save(novoLancamento);
    }

    public ControleLancamento buscarOuFalhar(Long idControle) {
        return controleLancamentoRepository.findById(idControle)
                .orElseThrow(() -> new ControleLancamentoNaoEncontadoException(idControle));
    }

    private Apartamento buscaApartamentos(ControleLancamento controleSalva) {
        Long codigoApartamento = controleSalva.getApartamento().getId();
        return apartamentoService.buscarOuFalhar(codigoApartamento);
    }

}
