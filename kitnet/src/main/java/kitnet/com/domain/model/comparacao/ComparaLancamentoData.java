package kitnet.com.domain.model.comparacao;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Objects;

@Getter
@Setter
public class ComparaLancamentoData {

    private LocalDate dataEntrada;
    private LocalDate dataPagamento;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ComparaLancamentoData that = (ComparaLancamentoData) o;
        return Objects.equals(dataEntrada, that.dataEntrada) && Objects.equals(dataPagamento, that.dataPagamento);
    }

    @Override
    public int hashCode() {
        return Objects.hash(dataEntrada, dataPagamento);
    }
}
