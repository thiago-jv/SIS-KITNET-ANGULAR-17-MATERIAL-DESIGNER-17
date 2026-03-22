package kitnet.com.api.v1.controller;

import org.springframework.security.access.prepost.PreAuthorize;

import jakarta.validation.Valid;
import kitnet.com.api.dto.predio.PredioFilterDTO;
import kitnet.com.api.dto.predio.PredioPostDTO;
import kitnet.com.api.dto.predio.PredioPutDTO;
import kitnet.com.api.dto.predio.PredioResponseDTO;
import kitnet.com.api.handler.EntidadeNaoEncontradaException;
import kitnet.com.api.handler.EntidadeRestricaoDeDadosException;
import kitnet.com.api.handler.NegocioException;
import kitnet.com.domain.service.PredioService;
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
@RequestMapping(value = "/v1/predios", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Prédios", description = "Operações relacionadas a prédios")
public class PredioController {

	@Autowired
	private PredioService predioService;

	@Operation(summary = "Listar todos os prédios", description = "Retorna todos os prédios cadastrados.")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "Lista de prédios retornada com sucesso"),
		@ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
	})
	@GetMapping("/todos")
	@PreAuthorize("hasAuthority('PERM_PREDIO_LIST')")
	public ResponseEntity<List<PredioResponseDTO>> todos() {
		return ResponseEntity.status(HttpStatus.OK).body(predioService.todos());
	}

	@Operation(summary = "Filtrar prédios", description = "Filtra prédios por critérios e retorna paginação.")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "Página de prédios retornada com sucesso"),
		@ApiResponse(responseCode = "400", description = "Requisição inválida", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
		@ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
	})
	@GetMapping("/filter")
	@PreAuthorize("hasAuthority('PERM_PREDIO_LIST')")
	public ResponseEntity<Page<PredioResponseDTO>> filtrar(
			@Parameter(description = "Filtros para busca de prédios") PredioFilterDTO predioFilterDTO,
			@Parameter(description = "Informações de paginação e ordenação") Pageable pageable) {
		Page<PredioResponseDTO> predioPage = predioService.filtrar(predioFilterDTO, pageable);
		return ResponseEntity.status(HttpStatus.OK).body(predioPage);
	}

	@Operation(summary = "Criar novo prédio", description = "Cadastra um novo prédio.")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "Prédio criado com sucesso"),
		@ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
		@ApiResponse(responseCode = "409", description = "Conflito de dados", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
		@ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
	})
	@PostMapping
	@PreAuthorize("hasAuthority('PERM_PREDIO_CREATE')")
	public PredioResponseDTO criar(@Valid @RequestBody PredioPostDTO predioPostDTO) {
		try {
			return predioService.salvar(predioPostDTO);
		} catch (EntidadeNaoEncontradaException | EntidadeRestricaoDeDadosException e) {
			throw new NegocioException(e.getMessage());
		}
	}

	@Operation(summary = "Remover prédio", description = "Remove um prédio pelo ID.")
	@ApiResponses({
		@ApiResponse(responseCode = "204", description = "Prédio removido com sucesso"),
		@ApiResponse(responseCode = "404", description = "Prédio não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
		@ApiResponse(responseCode = "409", description = "Conflito de dados", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
		@ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
	})
	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasAuthority('PERM_PREDIO_DELETE')")
	public void remover(@PathVariable Long id) {
		predioService.excluir(id);
	}

	@Operation(summary = "Atualizar prédio", description = "Atualiza os dados de um prédio pelo ID.")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "Prédio atualizado com sucesso"),
		@ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
		@ApiResponse(responseCode = "404", description = "Prédio não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
		@ApiResponse(responseCode = "409", description = "Conflito de dados", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
		@ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
	})
	@PutMapping("/{id}")
	@PreAuthorize("hasAuthority('PERM_PREDIO_UPDATE')")
	public PredioResponseDTO atualizar(@PathVariable Long id, @Valid @RequestBody PredioPutDTO predioPutDTO) {
		return this.predioService.atualizar(id, predioPutDTO);
	}

	@Operation(summary = "Buscar prédio por ID", description = "Busca um prédio pelo seu identificador único.")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "Prédio encontrado com sucesso"),
		@ApiResponse(responseCode = "404", description = "Prédio não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
		@ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
	})
	@GetMapping("/{id}")
	@PreAuthorize("hasAuthority('PERM_PREDIO_LIST')")
	public PredioResponseDTO buscarPeloId(@PathVariable Long id) {
		return predioService.buscarOuFalhar(id);
	}

}
