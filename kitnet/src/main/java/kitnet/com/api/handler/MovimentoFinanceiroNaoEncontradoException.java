package kitnet.com.api.handler;

public class MovimentoFinanceiroNaoEncontradoException extends EntidadeNaoEncontradaException {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	public MovimentoFinanceiroNaoEncontradoException(String messagem) {
		super(messagem);
	}

	public MovimentoFinanceiroNaoEncontradoException(Long idMovimentoFinanceiro) {
		this(String.format("Não existe cadastro de movimento fincanceiro com o código %d", idMovimentoFinanceiro));
	}

}
