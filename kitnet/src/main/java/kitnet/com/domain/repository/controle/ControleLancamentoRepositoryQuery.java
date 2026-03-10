package kitnet.com.domain.repository.controle;

import kitnet.com.api.dto.controleLancamento.ControleFilterDTO;
import kitnet.com.domain.model.ControleLancamento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ControleLancamentoRepositoryQuery {


	Page<ControleLancamento> filtrar(ControleFilterDTO controleFilter, Pageable pageable);
	
}
