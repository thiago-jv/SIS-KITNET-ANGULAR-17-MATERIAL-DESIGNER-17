package kitnet.com.domain.service.impl;

import kitnet.com.domain.model.ControleLancamento;
import kitnet.com.infra.utils.Constantes;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class ControleLancamentoStatusService {

    public void ajustarStatusPorDebito(ControleLancamento controleLancamento) {
        BigDecimal valorDebito = controleLancamento.getValores() != null
                ? controleLancamento.getValores().getValorDebitoApartamento() : null;

        if (valorDebito == null) {
            valorDebito = BigDecimal.ZERO;
            if (controleLancamento.getValores() != null) {
                controleLancamento.getValores().setValorDebitoApartamento(valorDebito);
            }
        }

        if (valorDebito.scale() > 2) {
            valorDebito = valorDebito.setScale(2, java.math.RoundingMode.HALF_UP);
            if (controleLancamento.getValores() != null) {
                controleLancamento.getValores().setValorDebitoApartamento(valorDebito);
            }
        }

        if (valorDebito.compareTo(BigDecimal.ZERO) <= 0) {
            controleLancamento.getStatus().setStatusApartamePagamento(Constantes.PAGO);
        } else {
            controleLancamento.getStatus().setStatusApartamePagamento(Constantes.DEBITO);
        }
    }
}
