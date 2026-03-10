package kitnet.com.api.handler;

public class PredioNaoEncontadoException extends EntidadeNaoEncontradaException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public PredioNaoEncontadoException(String messagem) {
		super(messagem);
	}

	public PredioNaoEncontadoException(Long idPredio) {
		this(String.format("Não existe cadastro de predio com o código %d", idPredio));
	}

}
