package kitnet.com.domain.repository;

import kitnet.com.domain.model.Valor;
import kitnet.com.domain.repository.valor.ValorRepositoryQuery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ValorRepository extends JpaRepository<Valor, Long>, ValorRepositoryQuery {

    @Query("select v from Valor v")
    List<Valor> listaValores();
}
