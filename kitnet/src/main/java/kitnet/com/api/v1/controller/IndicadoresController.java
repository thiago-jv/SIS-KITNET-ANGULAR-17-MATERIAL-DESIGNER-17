package kitnet.com.api.v1.controller;

import kitnet.com.api.dto.indicadores.IndicadoresResumoDTO;
import kitnet.com.api.dto.indicadores.StatusFiltroControle;
import kitnet.com.domain.service.IndicadoresService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import kitnet.com.api.dto.ApiErrorDTO;

import java.time.LocalDate;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping(value = "/v1/indicadores", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Indicadores", description = "Indicadores e relatórios gerenciais")
public class IndicadoresController {

    @Autowired
    private IndicadoresService indicadoresService;

    @Operation(summary = "Resumo de indicadores", description = "Obtém o resumo de indicadores para um período e status.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Resumo retornado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Requisição inválida", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @GetMapping("/resumo")
    public ResponseEntity<IndicadoresResumoDTO> resumo(
            @Parameter(description = "Data de início do período", example = "2024-01-01")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @Parameter(description = "Data de fim do período", example = "2024-12-31")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim,
            @Parameter(description = "Status do filtro de controle", example = "AMBOS")
            @RequestParam(required = false, defaultValue = "AMBOS") StatusFiltroControle status
    ) {
        return ResponseEntity.ok(indicadoresService.obterResumo(dataInicio, dataFim, status));
    }
}
