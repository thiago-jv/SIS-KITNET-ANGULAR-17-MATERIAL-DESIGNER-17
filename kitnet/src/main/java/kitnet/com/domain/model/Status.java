package kitnet.com.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import kitnet.com.infra.utils.Constantes;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Embeddable
public class Status implements Serializable {

	@Column(name = "STATUSAPARTAMENTOPAGAMENTO", length = 20, nullable = false)
	private String statusApartamePagamento = Constantes.PAGO;

	@Column(name = "STATUSCONTROLE", nullable = false)
	private boolean statusControle = true;

}
