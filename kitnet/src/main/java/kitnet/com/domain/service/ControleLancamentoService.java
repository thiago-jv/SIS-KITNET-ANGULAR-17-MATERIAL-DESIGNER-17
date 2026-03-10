package kitnet.com.domain.service;

import kitnet.com.api.dto.controleLancamento.ControleFilterDTO;
import kitnet.com.api.dto.controleLancamento.ControleLancamentoPostDTO;
import kitnet.com.api.dto.controleLancamento.ControleLancamentoPutDTO;
import kitnet.com.api.dto.controleLancamento.ControleLancamentoResponseDTO;
import kitnet.com.domain.model.ControleLancamento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface ControleLancamentoService {

    Page<ControleLancamentoResponseDTO> buscarComFiltro(ControleFilterDTO controleFilterDTO, Pageable pageable);

    ControleLancamentoResponseDTO salvar(ControleLancamentoPostDTO controleLancamentoPostDTO);

    ControleLancamentoResponseDTO buscarOuFalhar(Long idControle);

    void excluir(Long idControle);

    void alternarStatusControle(Long id);

    ControleLancamentoResponseDTO atualizar(Long idControle, ControleLancamentoPutDTO controleLancamentoPutDTO);

    byte[] gerarRelatorioPdf(Long idLancamento);

    List<ControleLancamentoResponseDTO> renovarLancamento(Long idLancamento, Integer quantidadeMeses);

    byte[] gerarRelatorioGerencialPdf(
            Long predioId,
            Long apartamentoId,
            Long inquilinoId,
            LocalDate dataInicio,
            LocalDate dataFim,
            String statusPagamento);
}

