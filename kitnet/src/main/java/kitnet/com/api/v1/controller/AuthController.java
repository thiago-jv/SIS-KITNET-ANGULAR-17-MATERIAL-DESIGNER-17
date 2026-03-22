package kitnet.com.api.v1.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import kitnet.com.api.dto.auth.AuthRequestDTO;
import kitnet.com.api.dto.auth.AuthResponseDTO;
import kitnet.com.security.AuthService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/v1/auth")
@Tag(name = "Auth", description = "Auth da aplicação")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
   
    @Operation(
        summary = "Autenticação de usuário",
        description = "Realiza login e retorna um token JWT se as credenciais estiverem corretas."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login realizado com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = AuthResponseDTO.class)
            )
        ),
        @ApiResponse(responseCode = "401", description = "Credenciais inválidas"),
        @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
    })
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(
        @jakarta.validation.Valid @RequestBody AuthRequestDTO request,
        HttpServletRequest httpRequest
    ) {
        String ipCliente = httpRequest.getRemoteAddr();
        AuthResponseDTO response = authService.autenticar(request, ipCliente);
        return ResponseEntity.ok(response);
    }
}