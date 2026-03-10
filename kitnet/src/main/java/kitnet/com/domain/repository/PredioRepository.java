package kitnet.com.domain.repository;

import kitnet.com.domain.model.Predio;
import kitnet.com.domain.repository.predio.PredioRepositoryQuery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
	
@Repository
public interface PredioRepository extends JpaRepository<Predio, Long>, PredioRepositoryQuery {
	
}
