package kitnet.com.domain.repository;

import kitnet.com.domain.model.Apartamento;
import kitnet.com.domain.repository.apartamento.ApartamentoRepositoryQuery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApartamentoRepository extends JpaRepository<Apartamento, Long>, ApartamentoRepositoryQuery {
}
