package kitnet.com.domain.repository.valor;


import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import kitnet.com.api.dto.valor.ValorFilterDTO;
import kitnet.com.domain.model.Valor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class ValorRepositoryImpl implements ValorRepositoryQuery {

	@PersistenceContext
	private EntityManager manager;

	public Page<Valor> filtrar(ValorFilterDTO valorFilter, Pageable pageable) {

		CriteriaBuilder builder = manager.getCriteriaBuilder();
		CriteriaQuery<Valor> criteria = builder.createQuery(Valor.class);
		Root<Valor> root = criteria.from(Valor.class);
		
		criteria.orderBy(builder.asc(root.get("id")));

		Predicate[] predicates = criarRestricoes(valorFilter, builder, root);
		criteria.where(predicates);

		TypedQuery<Valor> query = manager.createQuery(criteria);
		adicionarRestricoesDePaginacao(query, pageable);

		List<Valor> result = query.getResultList();
		if (result == null) {
			result = java.util.Collections.emptyList();
		}
		return new PageImpl<>(result, pageable == null ? Pageable.unpaged() : pageable, total(valorFilter));
	}
	
	private Predicate[] criarRestricoes(ValorFilterDTO valorFilter, CriteriaBuilder builder,
			Root<Valor> root) {
		List<Predicate> predicates = new ArrayList<>();

		if (!Objects.isNull(valorFilter.valor())) {
			predicates.add(builder.equal((root.get("valor")), valorFilter.valor()));
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
	
	private Long total(ValorFilterDTO valorFilter) {
		CriteriaBuilder builder = manager.getCriteriaBuilder();
		CriteriaQuery<Long> criteria = builder.createQuery(Long.class);
		Root<Valor> root = criteria.from(Valor.class);

		Predicate[] predicates = criarRestricoes(valorFilter, builder, root);
		criteria.where(predicates);

		criteria.select(builder.count(root));
		return manager.createQuery(criteria).getSingleResult();
	}


}
