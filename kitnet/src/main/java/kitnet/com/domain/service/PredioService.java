package kitnet.com.domain.service;

import kitnet.com.api.dto.predio.PredioFilterDTO;
import kitnet.com.api.dto.predio.PredioPostDTO;
import kitnet.com.api.dto.predio.PredioPutDTO;
import kitnet.com.api.dto.predio.PredioResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PredioService {

    Page<PredioResponseDTO> filtrar(PredioFilterDTO predioFilterDTO, Pageable pageable);

    PredioResponseDTO buscarOuFalhar(Long idPredio);

    PredioResponseDTO salvar(PredioPostDTO predioPostDTO);

    void excluir(Long idPredio);

    PredioResponseDTO atualizar(Long idPredio, PredioPutDTO predioPutDTO);

    List<PredioResponseDTO> todos();
}
