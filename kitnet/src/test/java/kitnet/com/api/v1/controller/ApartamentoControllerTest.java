package kitnet.com.api.v1.controller;

import kitnet.com.api.dto.apartamento.ApartamentoFilterDTO;
import kitnet.com.api.dto.apartamento.ApartamentoPostDTO;
import kitnet.com.api.dto.apartamento.ApartamentoPutDTO;
import kitnet.com.api.dto.apartamento.ApartamentoResponseDTO;
import kitnet.com.api.dto.predio.PredioId;
import kitnet.com.domain.service.ApartamentoService;
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

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Testes do ApartamentoController")
class ApartamentoControllerTest {

    @Mock
    private ApartamentoService apartamentoService;

    @InjectMocks
    private ApartamentoController apartamentoController;

        // private MockMvc mockMvc; // Removido campo não utilizado

    private ApartamentoResponseDTO apartamentoResponseDTO;
    private ApartamentoPostDTO apartamentoPostDTO;
    private ApartamentoPutDTO apartamentoPutDTO;

    @BeforeEach
    void setUp() {
        // mockMvc removido: não utilizado

        apartamentoResponseDTO = new ApartamentoResponseDTO(
                1L, "101", "Apartamento 101", "MED001", "DISPONÍVEL", new PredioId(1L)
        );

        apartamentoPostDTO = new ApartamentoPostDTO(
                "101", "Apartamento 101", "MED001", "DISPONÍVEL", new PredioId(1L)
        );

        apartamentoPutDTO = new ApartamentoPutDTO(
                1L, "101", "Apartamento 101", "MED001", "DISPONÍVEL", new PredioId(1L)
        );
    }

    @Test
    @DisplayName("Deve criar um novo apartamento")
    void deveCriarApartamento() {
        when(apartamentoService.salvar(any(ApartamentoPostDTO.class)))
                .thenReturn(apartamentoResponseDTO);

        ResponseEntity<ApartamentoResponseDTO> response = apartamentoController.criar(apartamentoPostDTO);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().id()).isEqualTo(1L);
        verify(apartamentoService, times(1)).salvar(any(ApartamentoPostDTO.class));
    }

    @Test
    @DisplayName("Deve buscar apartamento por ID")
    void deveBuscarApartamentoPorId() throws Exception {
        when(apartamentoService.buscarPorId(1L))
                .thenReturn(apartamentoResponseDTO);

        ResponseEntity<ApartamentoResponseDTO> response = apartamentoController.buscarPorId(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().id()).isEqualTo(1L);
        verify(apartamentoService, times(1)).buscarPorId(1L);
    }

    @Test
    @DisplayName("Deve atualizar um apartamento")
    void deveAtualizarApartamento() {
        when(apartamentoService.atualizar(any(ApartamentoPutDTO.class), eq(1L)))
                .thenReturn(apartamentoResponseDTO);

        ResponseEntity<ApartamentoResponseDTO> response = apartamentoController.atualizar(1L, apartamentoPutDTO);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        verify(apartamentoService, times(1)).atualizar(any(ApartamentoPutDTO.class), eq(1L));
    }

    @Test
    @DisplayName("Deve deletar um apartamento")
    void deveDeletearApartamento() {
        doNothing().when(apartamentoService).remover(1L);

        apartamentoController.remover(1L);

        verify(apartamentoService, times(1)).remover(1L);
    }

    @Test
    @DisplayName("Deve listar todos os apartamentos")
    void deveListarTodosApartamentos() {
        List<ApartamentoResponseDTO> apartamentos = List.of(apartamentoResponseDTO);
        when(apartamentoService.listarTodos()).thenReturn(apartamentos);

        List<ApartamentoResponseDTO> response = apartamentoController.listar();

        assertThat(response).isNotEmpty();
        assertThat(response).hasSize(1);
        verify(apartamentoService, times(1)).listarTodos();
    }

    @Test
    @DisplayName("Deve filtrar apartamentos com paginação")
    void deveFiltrarApartamentos() {
        ApartamentoFilterDTO filterDTO = new ApartamentoFilterDTO("Apartamento 101", "101", "DISPONÍVEL");
        Page<ApartamentoResponseDTO> page = new PageImpl<>(
                List.of(apartamentoResponseDTO),
                PageRequest.of(0, 10),
                1
        );

        when(apartamentoService.filtrar(any(ApartamentoFilterDTO.class), any()))
                .thenReturn(page);

        ResponseEntity<Page<ApartamentoResponseDTO>> response = 
                apartamentoController.filtrar(filterDTO, PageRequest.of(0, 10));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getContent()).hasSize(1);
        verify(apartamentoService, times(1)).filtrar(any(ApartamentoFilterDTO.class), any());
    }
}
