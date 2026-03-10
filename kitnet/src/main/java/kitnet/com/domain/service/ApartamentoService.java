package kitnet.com.domain.service;

import kitnet.com.api.dto.apartamento.ApartamentoFilterDTO;
import kitnet.com.api.dto.apartamento.ApartamentoPostDTO;
import kitnet.com.api.dto.apartamento.ApartamentoPutDTO;
import kitnet.com.api.dto.apartamento.ApartamentoResponseDTO;
import kitnet.com.domain.model.Apartamento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ApartamentoService {

    Page<ApartamentoResponseDTO> filtrar(ApartamentoFilterDTO apartamentoFilter, Pageable pageable);

    void remover(Long id);

    Apartamento buscarOuFalhar(Long id);

    ApartamentoResponseDTO buscarPorId(Long id);

    ApartamentoResponseDTO salvar(ApartamentoPostDTO apartamentoPostDTO);

    ApartamentoResponseDTO atualizar(ApartamentoPutDTO apartamentoPut, Long id);

    List<ApartamentoResponseDTO> listarTodos();


}
