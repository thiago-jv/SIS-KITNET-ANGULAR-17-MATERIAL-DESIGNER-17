package kitnet.com.domain.repository.apartamento;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import kitnet.com.api.dto.apartamento.ApartamentoFilterDTO;
import kitnet.com.domain.model.Apartamento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.lang.NonNull;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class ApartamentoRepositoryImpl implements ApartamentoRepositoryQuery {

    @PersistenceContext
    private EntityManager manager;

    @Override
    public @NonNull Page<Apartamento> filtrar(@NonNull ApartamentoFilterDTO apartamentoFilter, @NonNull Pageable pageable) {
        CriteriaBuilder builder = manager.getCriteriaBuilder();
        CriteriaQuery<Apartamento> criteria = builder.createQuery(Apartamento.class);
        Root<Apartamento> root = criteria.from(Apartamento.class);

        criteria.orderBy(builder.asc(root.get("id")));

        Predicate[] predicates = criarRestricoes(apartamentoFilter, builder, root);
        criteria.where(predicates);

        TypedQuery<Apartamento> query = manager.createQuery(criteria);
        adicionarRestricoesDePaginacao(query, pageable);

        List<Apartamento> apartamentos = query.getResultList();
        if (apartamentos == null) apartamentos = List.of();

        return new PageImpl<>(apartamentos, pageable == null ? Pageable.unpaged() : pageable, total(apartamentoFilter));
    }


    private Predicate[] criarRestricoes(ApartamentoFilterDTO apartamentoFilter, CriteriaBuilder builder,
                                        Root<Apartamento> root) {
        List<Predicate> predicates = new ArrayList<>();

        if (!Objects.isNull(apartamentoFilter.numeroApartamento())) {
            predicates.add(builder.equal((root.get("numeroApartamento")), apartamentoFilter.numeroApartamento()));
        }

        if (!Objects.isNull(apartamentoFilter.descricao())) {
            predicates.add(
                    builder.like(
                            builder.lower(root.get("descricao")),
                            "%" + apartamentoFilter.descricao().toLowerCase() + "%"
                    )
            );
        }

        return predicates.toArray(new Predicate[predicates.size()]);
    }

    private void adicionarRestricoesDePaginacao(TypedQuery<?> query, Pageable pageable) {
        int paginaAtual = pageable.getPageNumber();
        int totalRegistrosPorPagina = pageable.getPageSize();
        int primeiroRegistroDaPagina = paginaAtual * totalRegistrosPorPagina;

        query.setFirstResult(primeiroRegistroDaPagina);
        query.setMaxResults(totalRegistrosPorPagina);
    }

    private Long total(ApartamentoFilterDTO apartamentoFilter) {
        CriteriaBuilder builder = manager.getCriteriaBuilder();
        CriteriaQuery<Long> criteria = builder.createQuery(Long.class);
        Root<Apartamento> root = criteria.from(Apartamento.class);

        Predicate[] predicates = criarRestricoes(apartamentoFilter, builder, root);
        criteria.where(predicates);

        criteria.select(builder.count(root));
        return manager.createQuery(criteria).getSingleResult();
    }

}
