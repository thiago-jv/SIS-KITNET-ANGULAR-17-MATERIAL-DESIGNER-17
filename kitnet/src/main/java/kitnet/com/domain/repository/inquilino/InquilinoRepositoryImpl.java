package kitnet.com.domain.repository.inquilino;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import kitnet.com.api.dto.inquilino.InquilinoFilterDTO;
import kitnet.com.domain.model.Inquilino;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.lang.NonNull;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class InquilinoRepositoryImpl implements InquilinoRepositoryQuery{

	@PersistenceContext
	private EntityManager manager;
	
	@Override
	public @NonNull Page<Inquilino> filtrar(@NonNull InquilinoFilterDTO inquilinoFilter, @NonNull Pageable pageable) {
		CriteriaBuilder builder = manager.getCriteriaBuilder();
		CriteriaQuery<Inquilino> criteria = builder.createQuery(Inquilino.class);
		Root<Inquilino> root = criteria.from(Inquilino.class);
        
		criteria.orderBy(builder.asc(root.get("id")));

		Predicate[] predicates = criarRestricoes(inquilinoFilter, builder, root);
		criteria.where(predicates);

		TypedQuery<Inquilino> query = manager.createQuery(criteria);
		adicionarRestricoesDePaginacao(query, pageable);

		List<Inquilino> result = query.getResultList();
		if (result == null) {
			result = java.util.Collections.emptyList();
		}
		return new PageImpl<>(result, pageable == null ? Pageable.unpaged() : pageable, total(inquilinoFilter));
	}
	
	private Predicate[] criarRestricoes(InquilinoFilterDTO inquilinoFilter, CriteriaBuilder builder,
			Root<Inquilino> root) {
		List<Predicate> predicates = new ArrayList<>();

		if (!Objects.isNull(inquilinoFilter.nome())) {
			
			predicates.add(builder.like((root.get("nome")),
					"%" + inquilinoFilter.nome() + "%"));
		}
		
        if (!Objects.isNull(inquilinoFilter.cpf())) {
			
			predicates.add(builder.like((root.get("cpf")),
					"%" + inquilinoFilter.cpf() + "%"));
		}

        if (!Objects.isNull(inquilinoFilter.rg())) {

			predicates.add(builder.like((root.get("rg")),
					"%" + inquilinoFilter.rg() + "%"));
		}
        
        if (!Objects.isNull(inquilinoFilter.status())) {

			predicates.add(builder.equal((root.get("status")), inquilinoFilter.status()));
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
	
	private Long total(InquilinoFilterDTO inquilinoFilter) {
		CriteriaBuilder builder = manager.getCriteriaBuilder();
		CriteriaQuery<Long> criteria = builder.createQuery(Long.class);
		Root<Inquilino> root = criteria.from(Inquilino.class);

		Predicate[] predicates = criarRestricoes(inquilinoFilter, builder, root);
		criteria.where(predicates);

		criteria.select(builder.count(root));
		return manager.createQuery(criteria).getSingleResult();
	}


}

