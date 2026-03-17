package kitnet.com.api.v1.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import kitnet.com.api.dto.financeiro.MovimentoFinanceiroPutDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import kitnet.com.api.dto.financeiro.MovimentoFinanceiroResponseDTO;
import kitnet.com.api.dto.financeiro.MovimentoFinanceiroFilterDTO;
import kitnet.com.api.dto.ApiErrorDTO;

import kitnet.com.api.dto.financeiro.MovimentoFinanceiroPostDTO;
import kitnet.com.domain.service.MovimentoFinanceiroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping(value = "/v1/financeiro/movimentos", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Movimento Financeiro", description = "Movimentos financeiros relacionados a receitas e despesas do condominio.")
public class MovimentoFinanceiroController {

    @Autowired
    private MovimentoFinanceiroService service;

    @Operation(summary = "Filtrar movimentos financeiros", description = "Filtra movimentos financeiros por data e retorna paginação.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Página de movimentos retornada com sucesso"),
        @ApiResponse(responseCode = "400", description = "Requisição inválida", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @GetMapping("/filter")
    public ResponseEntity<Page<MovimentoFinanceiroResponseDTO>> filtrar(
            @Parameter(description = "Filtros para busca de movimentos financeiros") MovimentoFinanceiroFilterDTO filterDTO,
            @Parameter(description = "Informações de paginação e ordenação") Pageable pageable) {
        Page<MovimentoFinanceiroResponseDTO> page = service.filtrar(filterDTO, pageable);
        return ResponseEntity.status(HttpStatus.OK).body(page);
    }
    

    @Operation(summary = "Criar movimento financeiro", description = "Cria um novo movimento financeiro.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Movimento criado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @PostMapping
    public ResponseEntity<MovimentoFinanceiroResponseDTO> criar(@RequestBody MovimentoFinanceiroPostDTO dto) {
        MovimentoFinanceiroResponseDTO response = service.criar(dto);
        return ResponseEntity.ok(response);
    }


    @Operation(summary = "Listar todos movimentos financeiros", description = "Lista todos os movimentos financeiros.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de movimentos retornada com sucesso"),
        @ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @GetMapping
    public ResponseEntity<List<MovimentoFinanceiroResponseDTO>> listarTodos() {
        List<MovimentoFinanceiroResponseDTO> dtos = service.listarTodosDTO();
        return ResponseEntity.ok(dtos);
    }


    @Operation(summary = "Buscar movimento financeiro por ID", description = "Busca um movimento financeiro pelo ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Movimento encontrado com sucesso"),
        @ApiResponse(responseCode = "404", description = "Movimento não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<MovimentoFinanceiroResponseDTO> buscarPorId(@PathVariable Long id) {
        MovimentoFinanceiroResponseDTO dto = service.buscarPorIdDTO(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }


    @Operation(summary = "Deletar movimento financeiro", description = "Remove um movimento financeiro pelo ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Movimento removido com sucesso"),
        @ApiResponse(responseCode = "404", description = "Movimento não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.remover(id);
        return ResponseEntity.noContent().build();
    }

        @Operation(summary = "Atualizar movimento financeiro", description = "Atualiza um movimento financeiro pelo ID.")
        @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Movimento atualizado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
            @ApiResponse(responseCode = "404", description = "Movimento não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
            @ApiResponse(responseCode = "409", description = "Conflito de dados", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
            @ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
        })
        @PutMapping("/{id}")
        public ResponseEntity<MovimentoFinanceiroResponseDTO> atualizar(@PathVariable Long id, @RequestBody MovimentoFinanceiroPutDTO dto) {
            MovimentoFinanceiroResponseDTO atualizado = service.atualizar(dto, id);
            return ResponseEntity.ok(atualizado);
        }
}
