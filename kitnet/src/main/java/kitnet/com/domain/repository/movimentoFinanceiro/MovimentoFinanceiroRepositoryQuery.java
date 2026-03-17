package kitnet.com.domain.repository.movimentoFinanceiro;

import kitnet.com.api.dto.financeiro.MovimentoFinanceiroFilterDTO;
import kitnet.com.domain.model.MovimentoFinanceiro;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MovimentoFinanceiroRepositoryQuery {
	
	Page<MovimentoFinanceiro> filtrar(MovimentoFinanceiroFilterDTO movimentoFinanceiroFilterDTO, Pageable pageable);

}
