package kitnet.com.domain.service;

import kitnet.com.api.dto.apartamento.ApartamentoPostDTO;
import kitnet.com.api.dto.apartamento.ApartamentoResponseDTO;

public interface ApartamentoService {

    ApartamentoResponseDTO create(ApartamentoPostDTO apartamentoPost);
}
