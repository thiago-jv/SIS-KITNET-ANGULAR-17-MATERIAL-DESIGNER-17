package kitnet.com.api.handler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import io.swagger.v3.oas.annotations.Hidden;
import kitnet.com.api.dto.ApiErrorDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
@Hidden // Oculta do Swagger, mas padroniza resposta de erro
public class ExepectionHandler {

    private static final Logger logger = LoggerFactory.getLogger(ExepectionHandler.class);

    @ExceptionHandler(EntidadeNaoEncontradaException.class)
    public ResponseEntity<ApiErrorDTO> handlerEntidadeNaoEncontradaException(EntidadeNaoEncontradaException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiErrorDTO(exception.getMessage()));
    }

    @ExceptionHandler(NegocioException.class)
    public ResponseEntity<ApiErrorDTO> handlerBusinessException(NegocioException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiErrorDTO(exception.getMessage()));
    }

    @ExceptionHandler(EntidadeEmUsoException.class)
    public ResponseEntity<ApiErrorDTO> handlerEntidadeEmUsoException(EntidadeEmUsoException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ApiErrorDTO(exception.getMessage()));
    }

    @ExceptionHandler(EntidadeRestricaoDeDadosException.class)
    public ResponseEntity<ApiErrorDTO> handlerEntidadeRestricaoDeDadosException(EntidadeRestricaoDeDadosException exception) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiErrorDTO(exception.getMessage()));
    }

    @ExceptionHandler(ReportException.class)
    public ResponseEntity<ApiErrorDTO> handlerReportException(ReportException exception) {
        logger.error("Report generation error", exception);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiErrorDTO("Erro ao gerar relatório: " + exception.getMessage()));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiErrorDTO> handlerDataIntegrityViolationException(DataIntegrityViolationException exception) {
        logger.warn("Data integrity violation", exception);
        String mensagem = exception.getMessage();
        if (mensagem != null && mensagem.toLowerCase().contains("unique constraint")) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiErrorDTO("Já existe um registro com os dados informados, não pode haver duplicidade."));
        }
        if (mensagem != null && mensagem.toLowerCase().contains("foreign key constraint")) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiErrorDTO("Não é possível executar esta operação. O registro está vinculado a outros dados."));
        }
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ApiErrorDTO("Erro ao salvar os dados. Verifique as informações e tente novamente."));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorDTO> handleValidationExceptions(MethodArgumentNotValidException exception) {
        Map<String, String> errors = new HashMap<>();
        exception.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiErrorDTO(errors.toString()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorDTO> handlerAllException(Exception exception) {
        logger.error("Unexpected error caught by global handler", exception);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiErrorDTO("Erro ao processar sua solicitação. Por favor, tente novamente mais tarde."));
    }

}