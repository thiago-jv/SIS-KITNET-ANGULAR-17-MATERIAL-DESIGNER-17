package kitnet.com.domain.service;

import kitnet.com.api.dto.indicadores.IndicadoresResumoDTO;
import kitnet.com.api.dto.indicadores.StatusFiltroControle;

import java.time.LocalDate;

public interface IndicadoresService {

    IndicadoresResumoDTO obterResumo(LocalDate dataInicio, LocalDate dataFim, StatusFiltroControle status);
}
