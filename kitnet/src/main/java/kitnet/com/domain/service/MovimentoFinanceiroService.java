
package kitnet.com.domain.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import kitnet.com.api.dto.financeiro.MovimentoFinanceiroFilterDTO;

import kitnet.com.api.dto.financeiro.MovimentoFinanceiroPostDTO;
import kitnet.com.api.dto.financeiro.MovimentoFinanceiroPutDTO;
import kitnet.com.api.dto.financeiro.MovimentoFinanceiroResponseDTO;
import java.util.List;

public interface MovimentoFinanceiroService {

    Page<MovimentoFinanceiroResponseDTO> filtrar(MovimentoFinanceiroFilterDTO filterDTO, Pageable pageable);

    MovimentoFinanceiroResponseDTO criar(MovimentoFinanceiroPostDTO dto);

    List<MovimentoFinanceiroResponseDTO> listarTodosDTO();

    MovimentoFinanceiroResponseDTO buscarPorIdDTO(Long id);

    MovimentoFinanceiroResponseDTO atualizar(MovimentoFinanceiroPutDTO dto, Long id);

    void remover(Long id);
}
