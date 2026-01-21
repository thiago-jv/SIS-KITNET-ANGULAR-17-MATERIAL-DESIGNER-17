package kitnet.com.api.handler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ExepectionHandler {

    private static final Logger logger = LoggerFactory.getLogger(ExepectionHandler.class);

    @ExceptionHandler(BusinnesException.class)
    public ResponseEntity<String> handlerBusinessException(BusinnesException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(exception.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handlerAllException(Exception exception) {
        // Log full stacktrace for diagnostics (do not expose details to client)
        logger.error("Unexpected error caught by global handler", exception);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erro ao processar sua solicitação. Por favor, tente novamente mais tarde.");
    }

}