package kitnet.com.api.v1.controller;

import org.springframework.security.access.prepost.PreAuthorize;

import jakarta.validation.Valid;
import kitnet.com.api.dto.inquilino.InquilinoFilterDTO;
import kitnet.com.api.dto.inquilino.InquilinoPostDTO;
import kitnet.com.api.dto.inquilino.InquilinoPutDTO;
import kitnet.com.api.dto.inquilino.InquilinoResponseDTO;
import kitnet.com.api.handler.EntidadeNaoEncontradaException;
import kitnet.com.api.handler.EntidadeRestricaoDeDadosException;
import kitnet.com.api.handler.NegocioException;
import kitnet.com.domain.service.InquilinoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import kitnet.com.api.dto.error.ApiErrorDTO;

import java.util.List;

@RestController
@RequestMapping(value = "/v1/inquilinos", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Inquilinos", description = "Operações relacionadas a inquilinos")
public class InquilinoController {

    @Autowired
    private InquilinoService inquilinoService;

    @Operation(summary = "Filtrar inquilinos", description = "Filtra inquilinos por critérios e retorna paginação.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Página de inquilinos retornada com sucesso"),
        @ApiResponse(responseCode = "400", description = "Requisição inválida", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @GetMapping("/filter")
    @PreAuthorize("hasAuthority('PERM_INQUILINO_LIST')")
    public ResponseEntity<Page<InquilinoResponseDTO>> filtrar(
            @Parameter(description = "Filtros para busca de inquilinos") InquilinoFilterDTO inquilinoFilterDTO,
            @Parameter(description = "Informações de paginação e ordenação") Pageable pageable) {
        Page<InquilinoResponseDTO> inquilinoPage = inquilinoService.filtrar(inquilinoFilterDTO, pageable);
        return ResponseEntity.status(HttpStatus.OK).body(inquilinoPage);
    }

    @Operation(summary = "Listar todos os inquilinos", description = "Retorna todos os inquilinos cadastrados.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de inquilinos retornada com sucesso"),
        @ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @GetMapping("/todos")
    @PreAuthorize("hasAuthority('PERM_INQUILINO_LIST')")
    public List<InquilinoResponseDTO> listar() {
        return inquilinoService.listarTodos();
    }

    @Operation(summary = "Listar inquilinos ativos", description = "Retorna todos os inquilinos ativos.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de inquilinos ativos retornada com sucesso"),
        @ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @GetMapping("/todos/ativos")
    @PreAuthorize("hasAuthority('PERM_INQUILINO_LIST')")
    public List<InquilinoResponseDTO> listarAtivos() {
        return inquilinoService.listarAtivos();
    }

    @Operation(summary = "Criar novo inquilino", description = "Cadastra um novo inquilino.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Inquilino criado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "409", description = "Conflito de dados", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @PostMapping
    @PreAuthorize("hasAuthority('PERM_INQUILINO_CREATE')")
    public InquilinoResponseDTO criar(@Valid @RequestBody InquilinoPostDTO inquilinoPostDTO) {
        try {
            return inquilinoService.salvar(inquilinoPostDTO);
        } catch (EntidadeNaoEncontradaException | EntidadeRestricaoDeDadosException e) {
            throw new NegocioException(e.getMessage());
        }
    }

    @Operation(summary = "Remover inquilino", description = "Remove um inquilino pelo ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Inquilino removido com sucesso"),
        @ApiResponse(responseCode = "404", description = "Inquilino não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "409", description = "Conflito de dados", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('PERM_INQUILINO_DELETE')")
    public void remover(@PathVariable Long id) {
        inquilinoService.excluir(id);
    }

    @Operation(summary = "Atualizar inquilino", description = "Atualiza os dados de um inquilino pelo ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Inquilino atualizado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "404", description = "Inquilino não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "409", description = "Conflito de dados", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_INQUILINO_UPDATE')")
    public InquilinoResponseDTO atualizar(@PathVariable Long id, @Valid @RequestBody InquilinoPutDTO inquilinoPutDTO) {
        return this.inquilinoService.atualizar(id, inquilinoPutDTO);
    }

    @Operation(summary = "Buscar inquilino por ID", description = "Busca um inquilino pelo seu identificador único.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Inquilino encontrado com sucesso"),
        @ApiResponse(responseCode = "404", description = "Inquilino não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_INQUILINO_LIST')")
    public InquilinoResponseDTO buscarPeloId(@PathVariable Long id) {
        return inquilinoService.buscarOuFalhar(id);
    }

}

