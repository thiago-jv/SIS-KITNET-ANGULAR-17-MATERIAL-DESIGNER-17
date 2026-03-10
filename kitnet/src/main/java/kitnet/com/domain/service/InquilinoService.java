package kitnet.com.domain.service;

import kitnet.com.api.dto.inquilino.InquilinoFilterDTO;
import kitnet.com.api.dto.inquilino.InquilinoPostDTO;
import kitnet.com.api.dto.inquilino.InquilinoPutDTO;
import kitnet.com.api.dto.inquilino.InquilinoResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface InquilinoService {

    Page<InquilinoResponseDTO> filtrar(InquilinoFilterDTO inquilinoFilterDTO, Pageable pageable);

    List<InquilinoResponseDTO> listarTodos();

    List<InquilinoResponseDTO> listarAtivos();

    InquilinoResponseDTO buscarOuFalhar(Long idInquilino);

    InquilinoResponseDTO salvar(InquilinoPostDTO inquilinoPostDTO);

    void excluir(Long idInquilino);

    InquilinoResponseDTO atualizar(Long idInquilino, InquilinoPutDTO inquilinoPutDTO);
}
