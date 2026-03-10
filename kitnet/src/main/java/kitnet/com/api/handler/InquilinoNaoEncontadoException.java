package kitnet.com.api.handler;

public class InquilinoNaoEncontadoException extends EntidadeNaoEncontradaException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public InquilinoNaoEncontadoException(String messagem) {
		super(messagem);
	}

	public InquilinoNaoEncontadoException(Long idInquilino) {
		this(String.format("Não existe cadastro de inquilino com o código %d", idInquilino));
	}

}
