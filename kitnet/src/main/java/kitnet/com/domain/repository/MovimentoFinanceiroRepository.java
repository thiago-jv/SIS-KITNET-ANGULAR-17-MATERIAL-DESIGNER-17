package kitnet.com.domain.repository;

import kitnet.com.domain.repository.movimentoFinanceiro.MovimentoFinanceiroRepositoryQuery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import kitnet.com.domain.model.MovimentoFinanceiro;

@Repository
public interface MovimentoFinanceiroRepository extends JpaRepository<MovimentoFinanceiro, Long>, MovimentoFinanceiroRepositoryQuery {
}
