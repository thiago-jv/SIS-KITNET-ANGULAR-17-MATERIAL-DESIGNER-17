package kitnet.com.domain.model;

import jakarta.persistence.*;
import kitnet.com.infra.utils.Constantes;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

@Getter
@Setter
@Entity
@AllArgsConstructor
@ToString
@Table(name = "INQUILINO", schema = "public",
	indexes = {
		@Index(name = "idx_inquilino_status", columnList = "STATUS"),
		@Index(name = "idx_inquilino_cpf", columnList = "CPF"),
		@Index(name = "idx_inquilino_rg", columnList = "RG"),
		@Index(name = "idx_inquilino_nome", columnList = "NOME")
	}
)
public class Inquilino implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "inquilino_seq")
	@SequenceGenerator(name = "inquilino_seq", sequenceName = "inquilino_seq", initialValue = 1, allocationSize = 1)
	@Column(name = "ID", nullable = false, unique = true)
	private Long id;

	@Column(name = "NOME", length = 90, nullable = false)
	private String nome;

	@Column(name = "NOMEABREVIADO", length = 20)
	private String nomeAbreviado;

	@Column(name = "EMAIL", length = 90)
	private String email;

	@Column(name = "CONTATO", length = 15)
	private String contato;

	@Column(name = "STATUS", length = 20)
	private String status = Constantes.ATIVO;

	@Column(name = "GENERO", length = 20)
	private String genero = Constantes.MASCULINO;

	@Column(name = "CPF", length = 11, unique = true)
	private String cpf;

	@Column(name = "RG", length = 20)
	private String rg;

	public Inquilino() {

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
		Inquilino other = (Inquilino) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		return true;
	}

}
