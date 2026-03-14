package kitnet.com.api.v1.controller;

import kitnet.com.api.dto.indicadores.IndicadoresResumoDTO;
import kitnet.com.api.dto.indicadores.StatusFiltroControle;
import kitnet.com.domain.service.IndicadoresService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Testes do IndicadoresController")
@TestMethodOrder(OrderAnnotation.class)
class IndicadoresControllerTest {

    @Mock
    private IndicadoresService indicadoresService;

    @InjectMocks
    private IndicadoresController indicadoresController;

    private IndicadoresResumoDTO indicadoresResumoDTO;

    @BeforeEach
    void setUp() {
        indicadoresResumoDTO = new IndicadoresResumoDTO(
                10L, 8L, 2L,
                new BigDecimal("12000.00"), new BigDecimal("10000.00"), new BigDecimal("2000.00"),
                new BigDecimal("2000.00"), 80.0, 16.67, 83.33,
                10L, 1L,
                new BigDecimal("12000.00"), new BigDecimal("2000.00")
        );
    }

    @Test
        @Order(1)
        @DisplayName("Deve obter resumo de indicadores")
        void deveObterResumoIndicadores() {
        // Arrange (Preparação)
        LocalDate dataInicio = LocalDate.of(2026, 1, 1);
        LocalDate dataFim = LocalDate.of(2026, 3, 9);
        when(indicadoresService.obterResumo(dataInicio, dataFim, StatusFiltroControle.AMBOS))
                .thenReturn(indicadoresResumoDTO);

        // Act (Ação)
        ResponseEntity<IndicadoresResumoDTO> response = 
                indicadoresController.resumo(dataInicio, dataFim, StatusFiltroControle.AMBOS);

        // Assert (Verificação)
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().totalApartamentos()).isEqualTo(10L);
        assertThat(response.getBody().totalApartamentosAlugados()).isEqualTo(8L);
        verify(indicadoresService, times(1)).obterResumo(any(LocalDate.class), any(LocalDate.class), any());
    }

    @Test
        @Order(2)
        @DisplayName("Deve obter resumo com status ABERTO")
        void deveObterResumoComStatusAberto() {
        // Arrange (Preparação)
        LocalDate dataInicio = LocalDate.of(2026, 1, 1);
        LocalDate dataFim = LocalDate.of(2026, 3, 9);
        when(indicadoresService.obterResumo(dataInicio, dataFim, StatusFiltroControle.ABERTO))
                .thenReturn(indicadoresResumoDTO);

        // Act (Ação)
        ResponseEntity<IndicadoresResumoDTO> response = 
                indicadoresController.resumo(dataInicio, dataFim, StatusFiltroControle.ABERTO);

        // Assert (Verificação)
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        verify(indicadoresService, times(1)).obterResumo(any(LocalDate.class), any(LocalDate.class), any());
    }

    @Test
        @Order(3)
        @DisplayName("Deve obter resumo com status FECHADO")
        void deveObterResumoComStatusFechado() {
        // Arrange (Preparação)
        LocalDate dataInicio = LocalDate.of(2026, 1, 1);
        LocalDate dataFim = LocalDate.of(2026, 3, 9);
        when(indicadoresService.obterResumo(dataInicio, dataFim, StatusFiltroControle.FECHADO))
                .thenReturn(indicadoresResumoDTO);

        // Act (Ação)
        ResponseEntity<IndicadoresResumoDTO> response = 
                indicadoresController.resumo(dataInicio, dataFim, StatusFiltroControle.FECHADO);

        // Assert (Verificação)
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        verify(indicadoresService, times(1)).obterResumo(any(LocalDate.class), any(LocalDate.class), any());
    }
}
