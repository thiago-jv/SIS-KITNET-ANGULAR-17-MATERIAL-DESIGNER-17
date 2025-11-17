package kitnet.com.domain.repository.apartamento;

import kitnet.com.api.dto.apartamento.ApartamentoFilterDTO;
import kitnet.com.domain.model.Apartamento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ApartamentoRepositoryQuery {

    Page<Apartamento> filter(ApartamentoFilterDTO apartamentoFilter, Pageable pageable);
}
