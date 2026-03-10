package kitnet.com.domain.repository.valor;

import kitnet.com.api.dto.valor.ValorFilterDTO;
import kitnet.com.domain.model.Valor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ValorRepositoryQuery {

	Page<Valor> filtrar(ValorFilterDTO valorFilterDTO, Pageable pageable);
	
}
