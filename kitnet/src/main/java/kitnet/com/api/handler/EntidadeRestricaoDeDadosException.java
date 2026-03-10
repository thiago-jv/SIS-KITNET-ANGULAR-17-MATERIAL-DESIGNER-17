package kitnet.com.api.handler;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/*
 * Essa classe é uma exception
 * Irá ser lançada quando houver algum tipo de conflito, por exemplo, remover um arquivo que já é utilizado ou referênciado
 */
@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class EntidadeRestricaoDeDadosException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public EntidadeRestricaoDeDadosException(String mensagem) {
		super(mensagem);
	}

}
