package kitnet.com.api.dto.controleLancamento;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.io.Serializable;

@JsonIgnoreProperties(ignoreUnknown = true)
public record StatusDTO(
	String statusApartamePagamento,
	boolean statusControle
) implements Serializable {}
