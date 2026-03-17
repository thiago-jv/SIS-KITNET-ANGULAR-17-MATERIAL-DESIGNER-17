package kitnet.com.domain.repository.controle;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import kitnet.com.api.dto.controleLancamento.ControleFilterDTO;
import kitnet.com.domain.model.ControleLancamento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.lang.NonNull;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class ControleLancamentoRepositoryImpl implements ControleLancamentoRepositoryQuery{

	@PersistenceContext
	private EntityManager manager;
	
	@Override
	public @NonNull Page<ControleLancamento> filtrar(@NonNull ControleFilterDTO controleFilter, @NonNull Pageable pageable) {
		CriteriaBuilder builder = manager.getCriteriaBuilder();
		CriteriaQuery<ControleLancamento> criteria = builder.createQuery(ControleLancamento.class);
		Root<ControleLancamento> root = criteria.from(ControleLancamento.class);
		// Evita N+1: faz fetch join nos relacionamentos LAZY
		root.fetch("valor", jakarta.persistence.criteria.JoinType.LEFT);
		root.fetch("inquilino", jakarta.persistence.criteria.JoinType.LEFT);
		root.fetch("apartamento", jakarta.persistence.criteria.JoinType.LEFT);
        
		criteria.orderBy(builder.asc(root.get("status").get("statusControle")));
        
		Predicate[] predicates = criarRestricoes(controleFilter, builder, root);
		criteria.where(predicates);
        

		TypedQuery<ControleLancamento> query = manager.createQuery(criteria);
		adicionarRestricoesDePaginacao(query, pageable);

		List<ControleLancamento> result = query.getResultList();
		if (result == null) {
			result = java.util.Collections.emptyList();
		}
		return new PageImpl<>(result, pageable == null ? Pageable.unpaged() : pageable, total(controleFilter));
	}

	private static String DATA_PAGAMENTO = "dataPagamento";
	
	private Predicate[] criarRestricoes(ControleFilterDTO controleFilter, CriteriaBuilder builder,
										Root<ControleLancamento> root) {
		List<Predicate> predicates = new ArrayList<>();
		
		if (controleFilter.dataPagamentoDe() != null) {
			predicates.add(builder.greaterThanOrEqualTo(root.get(DATA_PAGAMENTO),
					controleFilter.dataPagamentoDe()));
		}

		if (controleFilter.dataPagamentoAte() != null) {
			predicates.add(builder.lessThanOrEqualTo(root.get(DATA_PAGAMENTO),
					controleFilter.dataPagamentoAte()));
		}
		
		if (!Objects.isNull(controleFilter.statusApartamePagamento())) {
			predicates.add(builder.equal((root.get("status").get("statusApartamePagamento")), controleFilter.statusApartamePagamento()));
		}
		
		if (controleFilter.inquilinoId() != null) {
			predicates.add(builder.equal(root.get("inquilino").get("id"), controleFilter.inquilinoId()));
		}
		
		if (controleFilter.apartamentoId() != null) {
			predicates.add(builder.equal(root.get("apartamento").get("id"), controleFilter.apartamentoId()));
		}
		
		if (controleFilter.predioId() != null) {
			predicates.add(builder.equal(root.get("apartamento").get("predio").get("id"), controleFilter.predioId()));
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
	
	private Long total(ControleFilterDTO controleFilter) {
		CriteriaBuilder builder = manager.getCriteriaBuilder();
		CriteriaQuery<Long> criteria = builder.createQuery(Long.class);
		Root<ControleLancamento> root = criteria.from(ControleLancamento.class);

		Predicate[] predicates = criarRestricoes(controleFilter, builder, root);
		criteria.where(predicates);

		criteria.select(builder.count(root));
		return manager.createQuery(criteria).getSingleResult();
	}

}
