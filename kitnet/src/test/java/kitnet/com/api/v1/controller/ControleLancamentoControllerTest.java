package kitnet.com.api.v1.controller;

import kitnet.com.api.dto.apartamento.ApartamentoId;
import kitnet.com.api.dto.controleLancamento.*;
import kitnet.com.api.dto.inquilino.InquilinoId;
import kitnet.com.api.dto.valor.ValorId;
import kitnet.com.domain.service.ControleLancamentoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.springframework.lang.NonNull;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Testes do ControleLancamentoController")
class ControleLancamentoControllerTest {

    @Mock
    private ControleLancamentoService controleLancamentoService;

    @InjectMocks
    private ControleLancamentoController controleLancamentoController;

    private ControleLancamentoResponseDTO controleLancamentoResponseDTO;
    private ControleLancamentoPostDTO controleLancamentoPostDTO;
    private ControleLancamentoPutDTO controleLancamentoPutDTO;

    @BeforeEach
    void setUp() {
        StatusDTO statusDTO = new StatusDTO("PAGO", true);
        ValorRegraDTO valorRegraDTO = new ValorRegraDTO(
                new BigDecimal("3000.00"), new BigDecimal("100.00"),
                new BigDecimal("3000.00"), new BigDecimal("3000.00"),
                BigDecimal.ZERO, 30L
        );

        controleLancamentoResponseDTO = new ControleLancamentoResponseDTO(
                1L, LocalDate.now(), LocalDate.of(2026, 3, 1), LocalDate.of(2026, 4, 1),
                "Aluguel de março", statusDTO, valorRegraDTO,
                new ValorId(1L), new InquilinoId(1L), new ApartamentoId(1L),
                "João Silva", "101"
        );

        controleLancamentoPostDTO = new ControleLancamentoPostDTO(
                LocalDate.of(2026, 3, 1), LocalDate.of(2026, 4, 1),
                "Aluguel de março", statusDTO, valorRegraDTO,
                new ValorId(1L), new InquilinoId(1L), new ApartamentoId(1L)
        );

        controleLancamentoPutDTO = new ControleLancamentoPutDTO(
                1L, LocalDate.of(2026, 3, 1), LocalDate.of(2026, 4, 1),
                "Aluguel de março", statusDTO, valorRegraDTO,
                new ValorId(1L), new InquilinoId(1L), new ApartamentoId(1L)
        );
    }

    @Test
    @DisplayName("Deve criar um novo controle de lançamento")
    void deveCriarControleLancamento() {
        when(controleLancamentoService.salvar(any(ControleLancamentoPostDTO.class)))
                .thenReturn(controleLancamentoResponseDTO);

        ControleLancamentoResponseDTO response = controleLancamentoController.criar(controleLancamentoPostDTO);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(1L);
        verify(controleLancamentoService, times(1)).salvar(any(ControleLancamentoPostDTO.class));
    }

    @Test
    @DisplayName("Deve atualizar um controle de lançamento")
    void deveAtualizarControleLancamento() {
        when(controleLancamentoService.atualizar(eq(1L), any(ControleLancamentoPutDTO.class)))
                .thenReturn(controleLancamentoResponseDTO);

        ControleLancamentoResponseDTO response = 
                controleLancamentoController.atualizar(1L, controleLancamentoPutDTO);

        assertThat(response).isNotNull();
        verify(controleLancamentoService, times(1)).atualizar(eq(1L), any(ControleLancamentoPutDTO.class));
    }

    @Test
    @DisplayName("Deve deletar um controle de lançamento")
    void deveDeletearControleLancamento() {
        doNothing().when(controleLancamentoService).excluir(1L);

        controleLancamentoController.remover(1L);

        verify(controleLancamentoService, times(1)).excluir(1L);
    }

    @Test
    @DisplayName("Deve alternar status do controle")
    void deveAlternarStatusControle() {
        doNothing().when(controleLancamentoService).alternarStatusControle(1L);

        controleLancamentoController.atualizarStatus(1L);

        verify(controleLancamentoService, times(1)).alternarStatusControle(1L);
    }

    @Test
    @DisplayName("Deve filtrar controles de lançamento com paginação")
    void deveFiltrarControles() {
        ControleFilterDTO filterDTO = new ControleFilterDTO(
                "PAGO", null, null, null, null, null, null
        );
        @NonNull List<ControleLancamentoResponseDTO> controlesPage = List.of(controleLancamentoResponseDTO);
        Page<ControleLancamentoResponseDTO> page = new PageImpl<>(
                controlesPage,
                PageRequest.of(0, 10),
                1
        );

        when(controleLancamentoService.buscarComFiltro(any(ControleFilterDTO.class), any()))
                .thenReturn(page);

        ResponseEntity<Page<ControleLancamentoResponseDTO>> response = 
                controleLancamentoController.filtrar(filterDTO, PageRequest.of(0, 10));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getContent()).hasSize(1);
        verify(controleLancamentoService, times(1)).buscarComFiltro(any(ControleFilterDTO.class), any());
    }
}
