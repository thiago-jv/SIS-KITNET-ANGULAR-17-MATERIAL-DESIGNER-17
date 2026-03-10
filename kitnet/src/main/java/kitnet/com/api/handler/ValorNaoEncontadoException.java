package kitnet.com.api.handler;

public class ValorNaoEncontadoException extends EntidadeNaoEncontradaException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public ValorNaoEncontadoException(String messagem) {
		super(messagem);
	}

	public ValorNaoEncontadoException(Long idValor) {
		this(String.format("Não existe cadastro de valor com o código %d", idValor));
	}

}
