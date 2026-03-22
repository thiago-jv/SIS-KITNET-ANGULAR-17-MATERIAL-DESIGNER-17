package kitnet.com.api.v1.controller;

import jakarta.validation.Valid;
import kitnet.com.api.dto.apartamento.ApartamentoFilterDTO;
import kitnet.com.api.dto.apartamento.ApartamentoPostDTO;
import kitnet.com.api.dto.apartamento.ApartamentoPutDTO;
import kitnet.com.api.dto.apartamento.ApartamentoResponseDTO;
import kitnet.com.domain.service.ApartamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import kitnet.com.api.dto.error.ApiErrorDTO;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping(value = "apartamentos", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Apartamentos", description = "Operações relacionadas a apartamentos")
public class ApartamentoController {
    private static final Logger logger = LoggerFactory.getLogger(ApartamentoController.class);

    @Autowired
    private ApartamentoService apartamentoService;

    @Operation(summary = "Criar novo apartamento", description = "Cadastra um novo apartamento.")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Apartamento criado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "409", description = "Conflito de dados", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @PostMapping
    @PreAuthorize("hasAuthority('PERM_APARTAMENTO_CREATE')")
    public ResponseEntity<ApartamentoResponseDTO> criar(@Valid @RequestBody ApartamentoPostDTO apartamentoPost) {
        ApartamentoResponseDTO apartamento = apartamentoService.salvar(apartamentoPost);
        return ResponseEntity.status(HttpStatus.CREATED).body(apartamento);
    }

    @Operation(summary = "Filtrar apartamentos", description = "Filtra apartamentos por critérios e retorna paginação.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Página de apartamentos retornada com sucesso"),
        @ApiResponse(responseCode = "400", description = "Requisição inválida", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @GetMapping("/filter")
    @PreAuthorize("hasAuthority('PERM_APARTAMENTO_LIST')")
    public ResponseEntity<Page<ApartamentoResponseDTO>> filtrar(
            @Parameter(description = "Filtros para busca de apartamentos") ApartamentoFilterDTO apartamentoFilterDTO,
            @Parameter(description = "Informações de paginação e ordenação") Pageable pageable) {
        Page<ApartamentoResponseDTO> apartamentoPage = apartamentoService.filtrar(apartamentoFilterDTO, pageable);
        return ResponseEntity.status(HttpStatus.OK).body(apartamentoPage);
    }

    @Operation(summary = "Remover apartamento", description = "Remove um apartamento pelo ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Apartamento removido com sucesso"),
        @ApiResponse(responseCode = "404", description = "Apartamento não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "409", description = "Conflito de dados", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('PERM_APARTAMENTO_DELETE')")
    public void remover(@PathVariable Long id) {
        apartamentoService.remover(id);
    }

    @Operation(summary = "Buscar apartamento por ID", description = "Busca um apartamento pelo seu identificador único.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Apartamento encontrado com sucesso"),
        @ApiResponse(responseCode = "404", description = "Apartamento não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_APARTAMENTO_LIST')")
    public ResponseEntity<ApartamentoResponseDTO> buscarPorId(@PathVariable Long id) throws Exception {
        return ResponseEntity.status(HttpStatus.OK).body(apartamentoService.buscarPorId(id));
    }

    @Operation(summary = "Atualizar apartamento", description = "Atualiza os dados de um apartamento pelo ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Apartamento atualizado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "404", description = "Apartamento não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "409", description = "Conflito de dados", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_APARTAMENTO_UPDATE')")
    public ResponseEntity<ApartamentoResponseDTO> atualizar(@PathVariable Long id, @Valid @RequestBody ApartamentoPutDTO apartamentoPut) {
        ApartamentoResponseDTO apartamentoAtualizado = apartamentoService.atualizar(apartamentoPut, id);
        return ResponseEntity.status(HttpStatus.OK).body(apartamentoAtualizado);
    }

    @Operation(summary = "Listar todos os apartamentos", description = "Retorna todos os apartamentos cadastrados.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de apartamentos retornada com sucesso"),
        @ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @GetMapping("/todos")
    @PreAuthorize("hasAuthority('PERM_APARTAMENTO_LIST')")
    public List<ApartamentoResponseDTO> listar() {
        return apartamentoService.listarTodos();
    }
}
