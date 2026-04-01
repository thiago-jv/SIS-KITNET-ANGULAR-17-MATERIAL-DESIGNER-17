package kitnet.com.security;

import kitnet.com.api.dto.auth.AuthRequestDTO;
import kitnet.com.api.dto.auth.AuthResponseDTO;
import kitnet.com.domain.model.Usuario;
import kitnet.com.domain.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private LimitadorTentativasLogin limitadorTentativasLogin;

    @InjectMocks
    private AuthService authService;

    @Test
    void deveLimparTentativasQuandoLoginForBemSucedido() {
        AuthRequestDTO request = new AuthRequestDTO("user@mail.com", "senha123");
        Usuario usuario = new Usuario();
        usuario.setEmail("user@mail.com");
        usuario.setSenha("hash");

        when(limitadorTentativasLogin.estaBloqueado("10.0.0.1")).thenReturn(false);
        when(usuarioRepository.findByEmail("user@mail.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("senha123", "hash")).thenReturn(true);
        when(jwtService.generateToken(usuario, "user@mail.com")).thenReturn("token-jwt");

        AuthResponseDTO response = authService.autenticar(request, "10.0.0.1");

        assertNotNull(response);
        assertEquals("token-jwt", response.token());
        verify(limitadorTentativasLogin, times(1)).limparTentativas("10.0.0.1");
        verify(limitadorTentativasLogin, never()).registrarTentativa("10.0.0.1");
    }

    @Test
    void deveRegistrarUmaTentativaQuandoSenhaForInvalida() {
        AuthRequestDTO request = new AuthRequestDTO("user@mail.com", "senhaErrada");
        Usuario usuario = new Usuario();
        usuario.setEmail("user@mail.com");
        usuario.setSenha("hash");

        when(limitadorTentativasLogin.estaBloqueado("10.0.0.1")).thenReturn(false);
        when(usuarioRepository.findByEmail("user@mail.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("senhaErrada", "hash")).thenReturn(false);

        assertThrows(BadCredentialsException.class, () -> authService.autenticar(request, "10.0.0.1"));

        verify(limitadorTentativasLogin, times(1)).registrarTentativa("10.0.0.1");
        verify(limitadorTentativasLogin, never()).limparTentativas("10.0.0.1");
    }

    @Test
    void deveRegistrarTentativaQuandoUsuarioNaoExiste() {
        AuthRequestDTO request = new AuthRequestDTO("inexistente@mail.com", "senha123");

        when(limitadorTentativasLogin.estaBloqueado("10.0.0.1")).thenReturn(false);
        when(usuarioRepository.findByEmail("inexistente@mail.com")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> authService.autenticar(request, "10.0.0.1"));

        verify(limitadorTentativasLogin, times(1)).registrarTentativa("10.0.0.1");
        verify(limitadorTentativasLogin, never()).limparTentativas("10.0.0.1");
    }
}
