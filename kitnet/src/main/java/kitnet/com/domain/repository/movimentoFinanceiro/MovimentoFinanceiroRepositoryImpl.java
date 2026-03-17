package kitnet.com.domain.repository.movimentoFinanceiro;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import kitnet.com.api.dto.financeiro.MovimentoFinanceiroFilterDTO;
import kitnet.com.domain.model.MovimentoFinanceiro;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.NonNull;

import java.util.ArrayList;
import java.util.List;

public class MovimentoFinanceiroRepositoryImpl implements MovimentoFinanceiroRepositoryQuery {

	@PersistenceContext
	private EntityManager manager;
	
	@Override
	public @NonNull Page<MovimentoFinanceiro> filtrar(@NonNull MovimentoFinanceiroFilterDTO movimentoFinanceiroFilterDTO, @NonNull Pageable pageable) {

		CriteriaBuilder builder = manager.getCriteriaBuilder();
		CriteriaQuery<MovimentoFinanceiro> criteria = builder.createQuery(MovimentoFinanceiro.class);
		Root<MovimentoFinanceiro> root = criteria.from(MovimentoFinanceiro.class);
		// Evita N+1: faz fetch join nos relacionamentos LAZY
		root.fetch("apartamento", jakarta.persistence.criteria.JoinType.LEFT);
		root.fetch("inquilino", jakarta.persistence.criteria.JoinType.LEFT);
		root.fetch("lancamento", jakarta.persistence.criteria.JoinType.LEFT);
        
		criteria.orderBy(builder.asc(root.get("id")));

		Predicate[] predicates = criarRestricoes(movimentoFinanceiroFilterDTO, builder, root);
		criteria.where(predicates);

		TypedQuery<MovimentoFinanceiro> query = manager.createQuery(criteria);
		adicionarRestricoesDePaginacao(query, pageable);

		List<MovimentoFinanceiro> result = query.getResultList();
		if (result == null) result = List.of();

		return new PageImpl<>(result, pageable == null ? Pageable.unpaged() : pageable, total(movimentoFinanceiroFilterDTO));
	}
	
	private Predicate[] criarRestricoes(MovimentoFinanceiroFilterDTO movimentoFinanceiroFilterDTO, CriteriaBuilder builder,
			Root<MovimentoFinanceiro> root) {
		List<Predicate> predicates = new ArrayList<>();

		if (movimentoFinanceiroFilterDTO.dataInicio() != null) {
			predicates.add(builder.greaterThanOrEqualTo(root.get("data"),
					movimentoFinanceiroFilterDTO.dataInicio()));
		}

		if (movimentoFinanceiroFilterDTO.dataFim() != null) {
			predicates.add(builder.lessThanOrEqualTo(root.get("data"),
					movimentoFinanceiroFilterDTO.dataFim()));
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
	
	private Long total(MovimentoFinanceiroFilterDTO movimentoFinanceiroFilterDTO) {
		CriteriaBuilder builder = manager.getCriteriaBuilder();
		CriteriaQuery<Long> criteria = builder.createQuery(Long.class);
		Root<MovimentoFinanceiro> root = criteria.from(MovimentoFinanceiro.class);

		Predicate[] predicates = criarRestricoes(movimentoFinanceiroFilterDTO, builder, root);
		criteria.where(predicates);

		criteria.select(builder.count(root));
		return manager.createQuery(criteria).getSingleResult();
	}


}

