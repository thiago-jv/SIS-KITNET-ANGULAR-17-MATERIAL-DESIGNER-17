package kitnet.com.domain.service;

import kitnet.com.api.dto.valor.ValorFilterDTO;
import kitnet.com.api.dto.valor.ValorPostDTO;
import kitnet.com.api.dto.valor.ValorPutDTO;
import kitnet.com.api.dto.valor.ValorResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ValorService {

    Page<ValorResponseDTO> filtrar(ValorFilterDTO valorFilterDTO, Pageable pageable);

    List<ValorResponseDTO> listarTodos();

    ValorResponseDTO buscarOuFalhar(Long idValor);

    ValorResponseDTO salvar(ValorPostDTO valorPostDTO);

    void excluir(Long idValor);

    ValorResponseDTO atualizar(Long idValor, ValorPutDTO valorPutDTO);
}
