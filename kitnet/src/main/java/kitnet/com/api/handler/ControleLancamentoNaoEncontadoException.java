package kitnet.com.api.handler;

public class ControleLancamentoNaoEncontadoException extends EntidadeNaoEncontradaException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public ControleLancamentoNaoEncontadoException(String messagem) {
		super(messagem);
	}

	public ControleLancamentoNaoEncontadoException(Long idControleLancamento) {
		this(String.format("Não existe cadastro de controleLancamento com o código %d", idControleLancamento));
	}

}
