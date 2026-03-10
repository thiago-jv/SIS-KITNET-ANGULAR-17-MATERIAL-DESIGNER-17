package kitnet.com.domain.repository;

import jakarta.transaction.Transactional;
import kitnet.com.domain.model.Apartamento;
import kitnet.com.domain.repository.apartamento.ApartamentoRepositoryQuery;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApartamentoRepository extends JpaRepository<Apartamento, Long>, ApartamentoRepositoryQuery {

    /**
     * Busca Apartamento por ID com @EntityGraph para evitar N+1 queries.
     * 
     * SEM @EntityGraph: 2 queries (apartamento + prédio)
     * COM @EntityGraph: 1 query (LEFT JOIN predio)
     * 
     * attributePaths = {"predio"}: carrega ManyToOne Predio junto
     */
    @EntityGraph(attributePaths = {"predio"})
    @Override
    @NonNull
    Optional<Apartamento> findById(@NonNull Long id);

    /**
     * Lista todos os apartamentos com @EntityGraph.
     * 
     * SEM @EntityGraph: 1 + N queries (lista + 1 query por apartamento para buscar prédio)
     * COM @EntityGraph: 1 query (LEFT JOIN predio)
     * 
     * Exemplo: 20 apartamentos = 21 queries → 1 query = 21x mais rápido!
     */
    @EntityGraph(attributePaths = {"predio"})
    @Override
    @NonNull
    List<Apartamento> findAll();

    @Modifying
    @Transactional
    @Query("DELETE FROM Apartamento a WHERE a.id = :id")
    void deleteById(@NonNull Long id);

}
