package kitnet.com.domain.repository;

import jakarta.transaction.Transactional;
import kitnet.com.domain.model.Apartamento;
import kitnet.com.domain.repository.apartamento.ApartamentoRepositoryQuery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ApartamentoRepository extends JpaRepository<Apartamento, Long>, ApartamentoRepositoryQuery {

    @Modifying
    @Transactional
    @Query("DELETE FROM Apartamento a WHERE a.id = :id")
    void deleteById(Long id);

}
