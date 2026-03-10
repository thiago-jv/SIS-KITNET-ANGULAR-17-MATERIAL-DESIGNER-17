package kitnet.com.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
@Table(name = "PREDIO", schema = "public",
	indexes = {
		@Index(name = "idx_predio_descricao", columnList = "DESCRICAO"),
		@Index(name = "idx_predio_cep", columnList = "CEP")
	}
)
public class Predio implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "predio_seq")
	@SequenceGenerator(name = "predio_seq", sequenceName = "predio_seq", initialValue = 1, allocationSize = 1)
	@Column(name = "ID", nullable = false, unique = true)
	private Long id;

	@NotNull
	@Size(min = 3, max = 90)
	@Column(name = "DESCRICAO", nullable = false, unique = true)
	private String descricao;

	@Column(name = "CEP", length = 8, nullable = false)
	private String cep;

	@Column(name = "LOGRADOURO")
	private String logradouro;

	@Column(name = "COMPLEMENTO")
	private String complemento;

	@Column(name = "BAIRRO")
	private String bairro;

	@Column(name = "UF")
	private String uf;

	@Column(name = "LOCALIDADE")
	private String localidade;

	@Column(name = "NUMERO")
	private String numero;

	public Predio() {

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
		Predio other = (Predio) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		return true;
	}

}
