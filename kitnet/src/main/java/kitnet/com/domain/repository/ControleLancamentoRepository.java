package kitnet.com.domain.repository;

import kitnet.com.domain.model.ControleLancamento;
import kitnet.com.domain.repository.controle.ControleLancamentoRepositoryQuery;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ControleLancamentoRepository extends JpaRepository<ControleLancamento, Long>, ControleLancamentoRepositoryQuery {

	interface IndicadoresResumoProjection {
		Long getTotalApartamentosAlugados();
		BigDecimal getReceitaPrevista();
		BigDecimal getTotalRecebido();
		BigDecimal getTotalDebito();
		Long getTotalPagamentos();
		Long getPagamentosVencidos();
	}

	@Query("select "
			+ "count(distinct c.apartamento.id) as totalApartamentosAlugados, "
			+ "coalesce(sum(c.valores.valorApartamento), 0) as receitaPrevista, "
			+ "coalesce(sum(c.valores.valorPagoApartamento), 0) as totalRecebido, "
			+ "coalesce(sum(c.valores.valorDebitoApartamento), 0) as totalDebito, "
			+ "count(c.id) as totalPagamentos, "
			+ "coalesce(sum(case when c.dataPagamento < CURRENT_DATE and c.status.statusApartamePagamento = 'DEBITO' then 1 else 0 end), 0) as pagamentosVencidos "
			+ "from ControleLancamento c "
			+ "where c.dataPagamento >= :dataInicio and c.dataPagamento <= :dataFim "
			+ "and (:statusControle is null or c.status.statusControle = :statusControle)")
	IndicadoresResumoProjection obterResumoConsolidado(@Param("dataInicio") LocalDate dataInicio,
			@Param("dataFim") LocalDate dataFim,
			@Param("statusControle") Boolean statusControle);
	
	/**
	 * Busca ControleLancamento por ID com @EntityGraph para evitar N+1 queries.
	 * 
	 * SEM @EntityGraph: 5 queries (1 + 4 relacionamentos)
	 * COM @EntityGraph: 1 query (LEFT JOINs automáticos)
	 * 
	 * attributePaths: relacionamentos carregados de uma vez
	 * - "inquilino": carrega ManyToOne Inquilino
	 * - "apartamento": carrega ManyToOne Apartamento  
	 * - "apartamento.predio": carrega Predio do Apartamento (relacionamento aninhado)
	 * - "valor": carrega ManyToOne Valor
	 *
	 */
	@EntityGraph(attributePaths = {"inquilino", "apartamento", "apartamento.predio", "valor"})
	@Override
	@NonNull
	Optional<ControleLancamento> findById(@NonNull Long id);
	
	@Query("select a from ControleLancamento a inner join fetch a.inquilino i inner join fetch a.apartamento p "
			+ "where a.status.statusControle = true and p.id = :pIdApartamento and a.dataEntrada <= :pDataFim and a.dataPagamento >= :pDataInico")
	List<ControleLancamento> listaControleLancamentosPorDataDeEntrada(@Param("pIdApartamento") Long pIdApartamento, @Param("pDataInico") LocalDate pDataInico, @Param("pDataFim") LocalDate pDataFim);

	@Query("select c from ControleLancamento c inner join fetch c.inquilino i inner join fetch c.apartamento a inner join fetch a.predio p inner join fetch c.valor where c.id = :pIdLancamento")
	List<ControleLancamento> listaControleLancamentosPorId(@Param("pIdLancamento") Long pIdLancamento);

	/**
	 * Busca dados consolidados para relatório gerencial
	 * Retorna todos os lançamentos com informações completas de inquilino, apartamento e prédio
	 */
	@Query("select c from ControleLancamento c "
			+ "inner join fetch c.inquilino i "
			+ "inner join fetch c.apartamento a "
			+ "inner join fetch a.predio p "
			+ "inner join fetch c.valor v "
			+ "where 1=1 "
			+ "and (cast(:predioId as long) is null or p.id = :predioId) "
			+ "and (cast(:apartamentoId as long) is null or a.id = :apartamentoId) "
			+ "and (cast(:inquilinoId as long) is null or i.id = :inquilinoId) "
			+ "and (cast(:dataInicio as date) is null or c.dataPagamento >= :dataInicio) "
			+ "and (cast(:dataFim as date) is null or c.dataPagamento <= :dataFim) "
			+ "and (cast(:statusPagamento as string) is null or c.status.statusApartamePagamento = :statusPagamento) "
			+ "order by p.descricao, a.numeroApartamento, c.dataPagamento desc")
	List<ControleLancamento> buscarDadosRelatorioGerencial(
			@Param("predioId") Long predioId,
			@Param("apartamentoId") Long apartamentoId,
			@Param("inquilinoId") Long inquilinoId,
			@Param("dataInicio") LocalDate dataInicio,
			@Param("dataFim") LocalDate dataFim,
			@Param("statusPagamento") String statusPagamento);

}
