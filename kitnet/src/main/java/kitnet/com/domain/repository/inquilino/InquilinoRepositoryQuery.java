package kitnet.com.domain.repository.inquilino;

import kitnet.com.api.dto.inquilino.InquilinoFilterDTO;
import kitnet.com.domain.model.Inquilino;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface InquilinoRepositoryQuery {
	
	Page<Inquilino> filtrar(InquilinoFilterDTO inquilinoFilterDTO, Pageable pageable);

}
