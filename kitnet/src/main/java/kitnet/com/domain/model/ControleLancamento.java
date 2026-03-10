package kitnet.com.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@AllArgsConstructor
@ToString
@Table(name = "CONTROLE_LANCAMENTO", schema = "public",
	indexes = {
		@Index(name = "idx_controle_lancamento_idvalor", columnList = "IDVALOR"),
		@Index(name = "idx_controle_lancamento_idinquilino", columnList = "IDINQUILINO"),
		@Index(name = "idx_controle_lancamento_idapartamento", columnList = "IDAPARTAMENTO"),
		@Index(name = "idx_controle_lancamento_dataentrada", columnList = "DATAENTRADA"),
		@Index(name = "idx_controle_lancamento_datapagamento", columnList = "DATAPAGAMENTO"),
		@Index(name = "idx_controle_lancamento_status", columnList = "STATUSAPARTAMENTOPAGAMENTO"),
		@Index(name = "idx_controle_lancamento_statuscontrole", columnList = "STATUSCONTROLE")
	}
)
public class ControleLancamento implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "controle_lancamento_seq")
	@SequenceGenerator(name = "controle_lancamento_seq", sequenceName = "controle_lancamento_seq", initialValue = 1, allocationSize = 1)
	@Column(name = "ID", nullable = false, unique = true)
	private Long id;

	@Column(name = "DATALANCAMENTO", nullable = false)
	private LocalDate dataLancamento = LocalDate.now();

	@Column(name = "DATAENTRADA", nullable = false)
	private LocalDate dataEntrada;

	@Column(name = "DATAPAGAMENTO", nullable = false)
	private LocalDate dataPagamento;

	@Column(name = "OBSERVACAO")
	private String observacao;

	@Embedded
	private Status status;

	@Embedded
	private ValorRegra valores;


	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "IDVALOR", referencedColumnName = "ID", nullable = false)
	private Valor valor;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "IDINQUILINO", referencedColumnName = "ID", nullable = false)
	private Inquilino inquilino;


	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "IDAPARTAMENTO", referencedColumnName = "ID", nullable = false)
	private Apartamento apartamento;

	public ControleLancamento() {

	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ControleLancamento other = (ControleLancamento) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		return true;
	}

}
