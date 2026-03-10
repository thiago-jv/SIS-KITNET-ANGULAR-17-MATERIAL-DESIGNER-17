package kitnet.com.domain.repository.predio;

import kitnet.com.api.dto.predio.PredioFilterDTO;
import kitnet.com.domain.model.Predio;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PredioRepositoryQuery {

	Page<Predio> filtrar(PredioFilterDTO predioFilterDTO, Pageable pageable);
	
}
