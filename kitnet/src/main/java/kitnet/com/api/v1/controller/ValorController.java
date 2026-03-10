package kitnet.com.api.v1.controller;

import jakarta.validation.Valid;
import kitnet.com.api.dto.valor.ValorFilterDTO;
import kitnet.com.api.dto.valor.ValorPostDTO;
import kitnet.com.api.dto.valor.ValorPutDTO;
import kitnet.com.api.dto.valor.ValorResponseDTO;
import kitnet.com.api.handler.EntidadeNaoEncontradaException;
import kitnet.com.api.handler.EntidadeRestricaoDeDadosException;
import kitnet.com.api.handler.NegocioException;
import kitnet.com.domain.service.ValorService;
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
import kitnet.com.api.dto.ApiErrorDTO;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping(value = "/v1/valores", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Valores", description = "Operações relacionadas a valores")
public class ValorController {

    @Autowired
    private ValorService valorService;

    @Operation(summary = "Filtrar valores", description = "Filtra valores por critérios e retorna paginação.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Página de valores retornada com sucesso"),
        @ApiResponse(responseCode = "400", description = "Requisição inválida", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @GetMapping("/filter")
    public ResponseEntity<Page<ValorResponseDTO>> filtrar(
            @Parameter(description = "Filtros para busca de valores") ValorFilterDTO valorFilterDTO,
            @Parameter(description = "Informações de paginação e ordenação") Pageable pageable) {
        Page<ValorResponseDTO> valorPage = valorService.filtrar(valorFilterDTO, pageable);
        return ResponseEntity.status(HttpStatus.OK).body(valorPage);
    }

    @Operation(summary = "Listar todos os valores", description = "Retorna todos os valores cadastrados.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de valores retornada com sucesso"),
        @ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @GetMapping("/todos")
    public List<ValorResponseDTO> listar() {
        return valorService.listarTodos();
    }

    @Operation(summary = "Buscar valor por ID", description = "Busca um valor pelo seu identificador único.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Valor encontrado com sucesso"),
        @ApiResponse(responseCode = "404", description = "Valor não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @GetMapping("/{id}")
    public ValorResponseDTO buscarPeloId(@PathVariable Long id) {
        return valorService.buscarOuFalhar(id);
    }

    @Operation(summary = "Criar novo valor", description = "Cadastra um novo valor.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Valor criado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "409", description = "Conflito de dados", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @PostMapping
    public ValorResponseDTO criar(@Valid @RequestBody ValorPostDTO valorPostDTO) {
        try {
            return valorService.salvar(valorPostDTO);
        } catch (EntidadeNaoEncontradaException | EntidadeRestricaoDeDadosException e) {
            throw new NegocioException(e.getMessage());
        }
    }

    @Operation(summary = "Atualizar valor", description = "Atualiza os dados de um valor pelo ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Valor atualizado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "404", description = "Valor não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "409", description = "Conflito de dados", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @PutMapping("/{id}")
    public ValorResponseDTO atualizar(@PathVariable Long id, @Valid @RequestBody ValorPutDTO valorPutDTO) {
        return this.valorService.atualizar(id, valorPutDTO);
    }

    @Operation(summary = "Remover valor", description = "Remove um valor pelo ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Valor removido com sucesso"),
        @ApiResponse(responseCode = "404", description = "Valor não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "409", description = "Conflito de dados", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@PathVariable Long id) {
        valorService.excluir(id);
    }
}
