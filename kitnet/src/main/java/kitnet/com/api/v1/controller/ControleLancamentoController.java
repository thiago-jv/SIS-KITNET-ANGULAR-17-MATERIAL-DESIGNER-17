package kitnet.com.api.v1.controller;

import jakarta.validation.Valid;
import kitnet.com.api.dto.controleLancamento.*;
import kitnet.com.api.handler.EntidadeNaoEncontradaException;
import kitnet.com.api.handler.EntidadeRestricaoDeDadosException;
import kitnet.com.api.handler.NegocioException;
import kitnet.com.domain.service.ControleLancamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
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

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping(value = "/v1/controles", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Lançamentos", description = "Operações relacionadas a lançamentos de controle")
public class ControleLancamentoController {

	@Autowired
	private ControleLancamentoService controleLancamentoService;

	@Operation(summary = "Filtrar lançamentos de controle", description = "Filtra lançamentos por critérios e retorna paginação.")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "Página de lançamentos retornada com sucesso"),
		@ApiResponse(responseCode = "400", description = "Requisição inválida", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
		@ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
	})
	@GetMapping("/filter")
	@PreAuthorize("hasAuthority('PERM_LANCAMENTO_LIST')")
	public ResponseEntity<Page<ControleLancamentoResponseDTO>> filtrar(
			@Parameter(description = "Filtros para busca de lançamentos") ControleFilterDTO controleFilterDTO,
			@Parameter(description = "Informações de paginação e ordenação") Pageable pageable) {
		Page<ControleLancamentoResponseDTO> controlePage = controleLancamentoService.buscarComFiltro(controleFilterDTO, pageable);
		return ResponseEntity.status(HttpStatus.OK).body(controlePage);
	}

	@Operation(summary = "Criar novo lançamento de controle", description = "Cadastra um novo lançamento de controle.")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "Lançamento criado com sucesso"),
		@ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
		@ApiResponse(responseCode = "409", description = "Conflito de dados", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
		@ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
	})
	@PostMapping
	@PreAuthorize("hasAuthority('PERM_LANCAMENTO_CREATE')")
	public ControleLancamentoResponseDTO criar(@Valid @RequestBody ControleLancamentoPostDTO controleLancamento) {
		try {
			 return controleLancamentoService.salvar(controleLancamento);
		} catch (EntidadeNaoEncontradaException | EntidadeRestricaoDeDadosException e) {
			throw new NegocioException(e.getMessage());
		}
	}

	@Operation(summary = "Remover lançamento de controle", description = "Remove um lançamento de controle pelo ID.")
	@ApiResponses({
		@ApiResponse(responseCode = "204", description = "Lançamento removido com sucesso"),
		@ApiResponse(responseCode = "404", description = "Lançamento não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
		@ApiResponse(responseCode = "409", description = "Conflito de dados", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
		@ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
	})
	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasAuthority('PERM_LANCAMENTO_DELETE')")
	public void remover(@PathVariable Long id) {
		controleLancamentoService.excluir(id);
	}

	@Operation(summary = "Atualizar lançamento de controle", description = "Atualiza os dados de um lançamento de controle pelo ID.")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "Lançamento atualizado com sucesso"),
		@ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
		@ApiResponse(responseCode = "404", description = "Lançamento não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
		@ApiResponse(responseCode = "409", description = "Conflito de dados", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
		@ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
	})
	@PutMapping("/{id}")
	@PreAuthorize("hasAuthority('PERM_LANCAMENTO_UPDATE')")
	public ControleLancamentoResponseDTO atualizar(@PathVariable Long id,
			@Valid @RequestBody ControleLancamentoPutDTO controleLancamento) {
		return controleLancamentoService.atualizar(id, controleLancamento);
	}
	
	 @Operation(summary = "Atualizar status do lançamento", description = "Alterna o status de um lançamento de controle pelo ID.")
	 @ApiResponses({
		  @ApiResponse(responseCode = "200", description = "Status atualizado com sucesso"),
		  @ApiResponse(responseCode = "404", description = "Lançamento não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
		  @ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
	 })
	 @PutMapping("/{id}/status")
	 @PreAuthorize("hasAuthority('PERM_LANCAMENTO_UPDATE')")
	 public void atualizarStatus(@PathVariable Long id) {
		 this.controleLancamentoService.alternarStatusControle(id);
	 }
	
	@Operation(summary = "Buscar lançamento de controle por ID", description = "Busca um lançamento de controle pelo seu identificador único.")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "Lançamento encontrado com sucesso"),
		@ApiResponse(responseCode = "404", description = "Lançamento não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
		@ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
	})
	@GetMapping("/{id}")
	@PreAuthorize("hasAuthority('PERM_LANCAMENTO_LIST')")
	public ControleLancamentoResponseDTO buscarPeloId(@PathVariable Long id) {
		return controleLancamentoService.buscarOuFalhar(id);
	}
	
	@GetMapping(path = "/relatorio/por-controle-lancamento", produces = MediaType.APPLICATION_PDF_VALUE)
	@PreAuthorize("hasAuthority('PERM_LANCAMENTO_LIST')")
	public ResponseEntity<byte[]> relatorioPorLancamentoControlePdf(Long idLancamento) {
		byte[] bytesPdf = controleLancamentoService.gerarRelatorioPdf(idLancamento);
		
		var headers = new HttpHeaders();
		headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=controle-lancamento.pdf");
		
		return ResponseEntity.ok()
				.contentType(MediaType.APPLICATION_PDF)
				.headers(headers)
				.body(bytesPdf);
	}

	@PostMapping("/{id}/renovar")
	@PreAuthorize("hasAuthority('PERM_LANCAMENTO_CREATE')")
	public List<ControleLancamentoResponseDTO> renovar(
			@PathVariable Long id,
			@Valid @RequestBody RenovarLancamentoDTO renovarDTO) {
		try {
			return controleLancamentoService.renovarLancamento(id, renovarDTO.quantidadeMeses());
		} catch (EntidadeNaoEncontradaException | EntidadeRestricaoDeDadosException e) {
			throw new NegocioException(e.getMessage());
		}
	}

	@GetMapping(path = "/relatorio/gerencial/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
	@PreAuthorize("hasAuthority('PERM_LANCAMENTO_LIST')")
	public ResponseEntity<byte[]> relatorioGerencialPdf(
			@RequestParam(required = false) Long predioId,
			@RequestParam(required = false) Long apartamentoId,
			@RequestParam(required = false) Long inquilinoId,
			@RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate dataInicio,
			@RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate dataFim,
			@RequestParam(required = false) String statusPagamento) {

		String statusFiltro = (statusPagamento != null && statusPagamento.equalsIgnoreCase("TODOS")) 
			? null : statusPagamento;
		
		byte[] bytesPdf = controleLancamentoService.gerarRelatorioGerencialPdf(
				predioId, apartamentoId, inquilinoId, dataInicio, dataFim, statusFiltro);
		
		var headers = new HttpHeaders();
		headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio-gerencial.pdf");
		
		return ResponseEntity.ok()
				.contentType(MediaType.APPLICATION_PDF)
				.headers(headers)
				.body(bytesPdf);
	}

	@Operation(summary = "Listar todos os controles lançamentos", description = "Retorna todos os controles cadastrados.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Lista de controles retornada com sucesso"),
			@ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
	})
	@GetMapping("/todos")
	@PreAuthorize("hasAuthority('PERM_LANCAMENTO_LIST')")
	public List<ControleLancamentoResponseDTO> listar() {
		return controleLancamentoService.listarTodos();
	}
	
}
