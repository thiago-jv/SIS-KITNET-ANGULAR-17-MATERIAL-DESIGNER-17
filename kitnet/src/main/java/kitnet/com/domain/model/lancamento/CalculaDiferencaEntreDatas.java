package kitnet.com.domain.model.lancamento;

import kitnet.com.domain.model.ControleLancamento;
import org.springframework.stereotype.Component;

import java.time.temporal.ChronoUnit;

@Component
public class CalculaDiferencaEntreDatas {
	
	public Long calculaDia(ControleLancamento controleLancamento) {
		return ChronoUnit.DAYS.between(controleLancamento.getDataEntrada(), controleLancamento.getDataPagamento());
	}
}
