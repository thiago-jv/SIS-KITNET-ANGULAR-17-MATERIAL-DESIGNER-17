package kitnet.com.domain.repository.apartamento;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

public class ApartamentoRepositoryImpl implements ApartamentoRepositoryQuery {

    @PersistenceContext
    private EntityManager manager;
}
