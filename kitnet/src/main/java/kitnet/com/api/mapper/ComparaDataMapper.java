package kitnet.com.api.mapper;

import kitnet.com.domain.model.ControleLancamento;
import kitnet.com.domain.model.comparacao.ComparaLancamentoData;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ComparaDataMapper {

    ComparaLancamentoData toComparaLancamentoData(ControleLancamento controleLancamento);

}
