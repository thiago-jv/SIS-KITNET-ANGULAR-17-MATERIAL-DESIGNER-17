package kitnet.com.api.v1.controller;

import kitnet.com.api.dto.predio.PredioFilterDTO;
import kitnet.com.api.dto.predio.PredioPostDTO;
import kitnet.com.api.dto.predio.PredioPutDTO;
import kitnet.com.api.dto.predio.PredioResponseDTO;
import kitnet.com.domain.service.PredioService;
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
@DisplayName("Testes do PredioController")
@TestMethodOrder(OrderAnnotation.class)
class PredioControllerTest {

    @Mock
    private PredioService predioService;

    @InjectMocks
    private PredioController predioController;

    private PredioResponseDTO predioResponseDTO;
    private PredioPostDTO predioPostDTO;
    private PredioPutDTO predioPutDTO;

    @BeforeEach
    void setUp() {
        predioResponseDTO = new PredioResponseDTO(
                1L, "Prédio Centro", "12345678", "Rua Principal", "Apto 101", "Centro", 
                "SP", "São Paulo", "01310100"
        );

        predioPostDTO = new PredioPostDTO(
                "Prédio Centro", "12345678", "Rua Principal", "Apto 101", "Centro", 
                "SP", "São Paulo", "01310100"
        );

        predioPutDTO = new PredioPutDTO(
                1L, "Prédio Centro", "12345678", "Rua Principal", "Apto 101", "Centro", 
                "SP", "São Paulo", "01310100"
        );
    }

    @Test
        @Order(1)
        @DisplayName("Deve criar um novo prédio")
        void deveCriarPredio() {
        // Arrange (Preparação)
        when(predioService.salvar(any(PredioPostDTO.class)))
                .thenReturn(predioResponseDTO);

        // Act (Ação)
        PredioResponseDTO response = predioController.criar(predioPostDTO);

        // Assert (Verificação)
        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.descricao()).isEqualTo("Prédio Centro");
        verify(predioService, times(1)).salvar(any(PredioPostDTO.class));
    }

    @Test
        @Order(2)
        @DisplayName("Deve buscar prédio por ID")
        void deveBuscarPredioPorId() {
        // Arrange (Preparação)
        when(predioService.buscarOuFalhar(1L))
                .thenReturn(predioResponseDTO);

        // Act (Ação)
        PredioResponseDTO response = predioController.buscarPeloId(1L);

        // Assert (Verificação)
        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(1L);
        verify(predioService, times(1)).buscarOuFalhar(1L);
    }

    @Test
        @Order(3)
        @DisplayName("Deve atualizar um prédio")
        void deveAtualizarPredio() {
        // Arrange (Preparação)
        when(predioService.atualizar(eq(1L), any(PredioPutDTO.class)))
                .thenReturn(predioResponseDTO);

        // Act (Ação)
        PredioResponseDTO response = predioController.atualizar(1L, predioPutDTO);

        // Assert (Verificação)
        assertThat(response).isNotNull();
        verify(predioService, times(1)).atualizar(eq(1L), any(PredioPutDTO.class));
    }

    @Test
        @Order(4)
        @DisplayName("Deve deletar um prédio")
        void deveDeletearPredio() {
                // Arrange (Preparação)
                doNothing().when(predioService).excluir(1L);

                // Act (Ação)
                predioController.remover(1L);

                // Assert (Verificação)
                verify(predioService, times(1)).excluir(1L);
    }

    @Test
        @Order(5)
        @DisplayName("Deve listar todos os prédios")
        void deveListarTodosPredios() {
                // Arrange (Preparação)
                List<PredioResponseDTO> predios = List.of(predioResponseDTO);
                when(predioService.todos()).thenReturn(predios);

                // Act (Ação)
                ResponseEntity<List<PredioResponseDTO>> response = predioController.todos();

                // Assert (Verificação)
                assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
                assertThat(response.getBody()).isNotEmpty();
                assertThat(response.getBody()).hasSize(1);
                verify(predioService, times(1)).todos();
    }

    @Test
        @Order(6)
        @DisplayName("Deve filtrar prédios com paginação")
        void deveFiltrarPredios() {
        // Arrange (Preparação)
        PredioFilterDTO filterDTO = new PredioFilterDTO("Prédio Centro", "1");
        List<PredioResponseDTO> prediosPage = List.of(predioResponseDTO);
        Page<PredioResponseDTO> page = new PageImpl<>(
                (List<PredioResponseDTO>) prediosPage,
                PageRequest.of(0, 10),
                1
        );
        when(predioService.filtrar(any(PredioFilterDTO.class), any()))
                .thenReturn(page);

        // Act (Ação)
        ResponseEntity<Page<PredioResponseDTO>> response = 
                predioController.filtrar(filterDTO, PageRequest.of(0, 10));

        // Assert (Verificação)
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getContent()).hasSize(1);
        verify(predioService, times(1)).filtrar(any(PredioFilterDTO.class), any());
    }
}
