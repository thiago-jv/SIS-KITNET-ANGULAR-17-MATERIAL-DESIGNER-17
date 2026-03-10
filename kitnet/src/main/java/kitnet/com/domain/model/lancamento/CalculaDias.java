package kitnet.com.domain.model.lancamento;

import kitnet.com.api.mapper.ComparaDataMapper;
import kitnet.com.domain.model.ControleLancamento;
import kitnet.com.domain.model.lancamento.interfaces.CalculadoraDias;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CalculaDias implements CalculadoraDias {

	@Autowired
	private CalculaDiferencaEntreDatas diferencaDias;

	@Autowired
	private ComparaDataMapper comparaDataMapper;
	@Override

	public ControleLancamento calculaDia(ControleLancamento controleLancamento) {
		var comparaLancamentoData = comparaDataMapper.toComparaLancamentoData(controleLancamento);

		if(diferencaDias.calculaDia(controleLancamento) > 0) {
			controleLancamento.getValores().setDia(diferencaDias.calculaDia(controleLancamento));
		}

		if(comparaLancamentoData.getDataEntrada().equals(comparaLancamentoData.getDataPagamento())){
			controleLancamento.getValores().setDia( Long.valueOf(1));
		}
		return controleLancamento;
	}
}
