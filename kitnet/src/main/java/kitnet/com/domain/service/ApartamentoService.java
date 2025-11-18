package kitnet.com.domain.service;

import kitnet.com.api.dto.apartamento.ApartamentoFilterDTO;
import kitnet.com.api.dto.apartamento.ApartamentoPostDTO;
import kitnet.com.api.dto.apartamento.ApartamentoPutDTO;
import kitnet.com.api.dto.apartamento.ApartamentoResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ApartamentoService {

    ApartamentoResponseDTO create(ApartamentoPostDTO apartamentoPost);

    Page<ApartamentoResponseDTO> filter(ApartamentoFilterDTO apartamentoFilter, Pageable pageable);

    void remove(Long id);

    ApartamentoResponseDTO findById(Long id);

    ApartamentoResponseDTO update(ApartamentoPutDTO apartamentoPut, Long id);

}
