package kitnet.com.domain.repository;

import kitnet.com.domain.model.Inquilino;
import kitnet.com.domain.repository.inquilino.InquilinoRepositoryQuery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InquilinoRepository extends JpaRepository<Inquilino, Long>, InquilinoRepositoryQuery {

	@Query("select i from Inquilino i "
			+ "where i.status in('ATIVO')")
	List<Inquilino> listaInquilinosAtivos();
	
}
