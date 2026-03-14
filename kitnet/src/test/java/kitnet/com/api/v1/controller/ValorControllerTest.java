package kitnet.com.api.v1.controller;

import kitnet.com.api.dto.valor.ValorFilterDTO;
import kitnet.com.api.dto.valor.ValorPostDTO;
import kitnet.com.api.dto.valor.ValorPutDTO;
import kitnet.com.api.dto.valor.ValorResponseDTO;
import kitnet.com.domain.service.ValorService;
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

import java.math.BigDecimal;
import java.util.List;
import org.springframework.lang.NonNull;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Testes do ValorController")
@TestMethodOrder(OrderAnnotation.class)
class ValorControllerTest {

    @Mock
    private ValorService valorService;

    @InjectMocks
    private ValorController valorController;

    private ValorResponseDTO valorResponseDTO;
    private ValorPostDTO valorPostDTO;
    private ValorPutDTO valorPutDTO;

    @BeforeEach
    void setUp() {
        valorResponseDTO = new ValorResponseDTO(1L, new BigDecimal("1500.00"));
        valorPostDTO = new ValorPostDTO(new BigDecimal("1500.00"));
        valorPutDTO = new ValorPutDTO(1L, new BigDecimal("1500.00"));
    }

    @Test
    @Order(1)
    @DisplayName("Deve criar um novo valor")
    void deveCriarValor() {
        // Arrange (Preparação)
        when(valorService.salvar(any(ValorPostDTO.class)))
            .thenReturn(valorResponseDTO);

        // Act (Ação)
        ValorResponseDTO response = valorController.criar(valorPostDTO);

        // Assert (Verificação)
        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.valor()).isEqualByComparingTo(new BigDecimal("1500.00"));
        verify(valorService, times(1)).salvar(any(ValorPostDTO.class));
    }

    @Test
    @Order(2)
    @DisplayName("Deve buscar valor por ID")
    void deveBuscarValorPorId() {
        // Arrange (Preparação)
        when(valorService.buscarOuFalhar(1L))
            .thenReturn(valorResponseDTO);

        // Act (Ação)
        ValorResponseDTO response = valorController.buscarPeloId(1L);

        // Assert (Verificação)
        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(1L);
        verify(valorService, times(1)).buscarOuFalhar(1L);
    }

    @Test
    @Order(3)
    @DisplayName("Deve atualizar um valor")
    void deveAtualizarValor() {
        // Arrange (Preparação)
        when(valorService.atualizar(eq(1L), any(ValorPutDTO.class)))
            .thenReturn(valorResponseDTO);

        // Act (Ação)
        ValorResponseDTO response = valorController.atualizar(1L, valorPutDTO);

        // Assert (Verificação)
        assertThat(response).isNotNull();
        verify(valorService, times(1)).atualizar(eq(1L), any(ValorPutDTO.class));
    }

    @Test
    @Order(4)
    @DisplayName("Deve deletar um valor")
    void deveDeletearValor() {
        // Arrange (Preparação)
        doNothing().when(valorService).excluir(1L);

        // Act (Ação)
        valorController.remover(1L);

        // Assert (Verificação)
        verify(valorService, times(1)).excluir(1L);
    }

    @Test
    @Order(5)
    @DisplayName("Deve listar todos os valores")
    void deveListarTodosValores() {
        // Arrange (Preparação)
        List<ValorResponseDTO> valores = List.of(valorResponseDTO);
        when(valorService.listarTodos()).thenReturn(valores);

        // Act (Ação)
        List<ValorResponseDTO> response = valorController.listar();

        // Assert (Verificação)
        assertThat(response).isNotEmpty();
        assertThat(response).hasSize(1);
        verify(valorService, times(1)).listarTodos();
    }

    @Test
    @Order(6)
    @DisplayName("Deve filtrar valores com paginação")
    void deveFiltrarValores() {
        // Arrange (Preparação)
        ValorFilterDTO filterDTO = new ValorFilterDTO(new BigDecimal("1500.00"));
        List<ValorResponseDTO> valoresPage = List.of(valorResponseDTO);
        Page<ValorResponseDTO> page = new PageImpl<>(
            valoresPage,
            PageRequest.of(0, 10),
            1
        );
        when(valorService.filtrar(any(ValorFilterDTO.class), any()))
            .thenReturn(page);

        // Act (Ação)
        ResponseEntity<Page<ValorResponseDTO>> response = 
            valorController.filtrar(filterDTO, PageRequest.of(0, 10));

        // Assert (Verificação)
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getContent()).hasSize(1);
        verify(valorService, times(1)).filtrar(any(ValorFilterDTO.class), any());
    }
}
