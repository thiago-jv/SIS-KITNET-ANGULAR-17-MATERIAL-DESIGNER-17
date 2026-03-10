package kitnet.com.api.v1.controller;

import kitnet.com.api.dto.inquilino.InquilinoFilterDTO;
import kitnet.com.api.dto.inquilino.InquilinoPostDTO;
import kitnet.com.api.dto.inquilino.InquilinoPutDTO;
import kitnet.com.api.dto.inquilino.InquilinoResponseDTO;
import kitnet.com.domain.service.InquilinoService;
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
import org.springframework.lang.NonNull;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Testes do InquilinoController")
class InquilinoControllerTest {

    @Mock
    private InquilinoService inquilinoService;

    @InjectMocks
    private InquilinoController inquilinoController;

    private InquilinoResponseDTO inquilinoResponseDTO;
    private InquilinoPostDTO inquilinoPostDTO;
    private InquilinoPutDTO inquilinoPutDTO;

    @BeforeEach
    void setUp() {
        inquilinoResponseDTO = new InquilinoResponseDTO(
            1L, "João Silva", "JS", "joao@email.com", "11999999999", "ATIVO", "M", "12345678901", "1234567"
        );

        inquilinoPostDTO = new InquilinoPostDTO(
            1L, "João Silva", "JS", "joao@email.com", "11999999999", "ATIVO", "M", "12345678901", "1234567"
        );

        inquilinoPutDTO = new InquilinoPutDTO(
            1L, "João Silva", "JS", "joao@email.com", "11999999999", "ATIVO", "M", "12345678901", "1234567"
        );
    }

    @Test
    @DisplayName("Deve criar um novo inquilino")
    void deveCriarInquilino() {
        when(inquilinoService.salvar(any(InquilinoPostDTO.class)))
                .thenReturn(inquilinoResponseDTO);

        InquilinoResponseDTO response = inquilinoController.criar(inquilinoPostDTO);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.nome()).isEqualTo("João Silva");
        verify(inquilinoService, times(1)).salvar(any(InquilinoPostDTO.class));
    }

    @Test
    @DisplayName("Deve buscar inquilino por ID")
    void deveBuscarInquilinoPorId() {
        when(inquilinoService.buscarOuFalhar(1L))
                .thenReturn(inquilinoResponseDTO);

        InquilinoResponseDTO response = inquilinoController.buscarPeloId(1L);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(1L);
        verify(inquilinoService, times(1)).buscarOuFalhar(1L);
    }

    @Test
    @DisplayName("Deve atualizar um inquilino")
    void deveAtualizarInquilino() {
        when(inquilinoService.atualizar(eq(1L), any(InquilinoPutDTO.class)))
                .thenReturn(inquilinoResponseDTO);

        InquilinoResponseDTO response = inquilinoController.atualizar(1L, inquilinoPutDTO);

        assertThat(response).isNotNull();
        verify(inquilinoService, times(1)).atualizar(eq(1L), any(InquilinoPutDTO.class));
    }

    @Test
    @DisplayName("Deve deletar um inquilino")
    void deveDeletearInquilino() {
        doNothing().when(inquilinoService).excluir(1L);

        inquilinoController.remover(1L);

        verify(inquilinoService, times(1)).excluir(1L);
    }

    @Test
    @DisplayName("Deve listar todos os inquilinos")
    void deveListarTodosInquilinos() {
        List<InquilinoResponseDTO> inquilinos = List.of(inquilinoResponseDTO);
        when(inquilinoService.listarTodos()).thenReturn(inquilinos);

        List<InquilinoResponseDTO> response = inquilinoController.listar();

        assertThat(response).isNotEmpty();
        assertThat(response).hasSize(1);
        verify(inquilinoService, times(1)).listarTodos();
    }

    @Test
    @DisplayName("Deve listar inquilinos ativos")
    void deveListarInquilianosAtivos() {
        List<InquilinoResponseDTO> inquilinos = List.of(inquilinoResponseDTO);
        when(inquilinoService.listarAtivos()).thenReturn(inquilinos);

        List<InquilinoResponseDTO> response = inquilinoController.listarAtivos();

        assertThat(response).isNotEmpty();
        assertThat(response).hasSize(1);
        verify(inquilinoService, times(1)).listarAtivos();
    }

    @Test
    @DisplayName("Deve filtrar inquilinos com paginação")
    void deveFiltrarInquilinos() {
        InquilinoFilterDTO filterDTO = new InquilinoFilterDTO("João Silva", "12345678901", "1234567", "ATIVO");
        @NonNull List<InquilinoResponseDTO> inquilinosPage = List.of(inquilinoResponseDTO);
        Page<InquilinoResponseDTO> page = new PageImpl<>(
            inquilinosPage,
            PageRequest.of(0, 10),
            1
        );

        when(inquilinoService.filtrar(any(InquilinoFilterDTO.class), any()))
                .thenReturn(page);

        ResponseEntity<Page<InquilinoResponseDTO>> response = 
                inquilinoController.filtrar(filterDTO, PageRequest.of(0, 10));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getContent()).hasSize(1);
        verify(inquilinoService, times(1)).filtrar(any(InquilinoFilterDTO.class), any());
    }
}
