package kitnet.com.security;

import kitnet.com.domain.model.Usuario;
import kitnet.com.domain.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import kitnet.com.api.dto.auth.AuthRequestDTO;
import kitnet.com.api.dto.auth.AuthResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;

@Service
public class AuthService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final LimitadorTentativasLogin limitadorTentativasLogin;
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtService jwtService, LimitadorTentativasLogin limitadorTentativasLogin) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.limitadorTentativasLogin = limitadorTentativasLogin;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
        return User.builder()
                .username(usuario.getEmail())
                .password(usuario.getSenha())
                .authorities(usuario.getPermissoes().stream().map(p -> p.getDescricao()).toArray(String[]::new))
                .build();
    }

    public boolean validarSenha(String senhaCriptografada, String senhaInformada) {
        return passwordEncoder.matches(senhaInformada, senhaCriptografada);
    }

    public AuthResponseDTO autenticar(AuthRequestDTO request, String ipCliente) {
        if (limitadorTentativasLogin.estaBloqueado(ipCliente)) {
            logger.warn("[LOGIN] IP bloqueado por excesso de tentativas: {}", ipCliente);
            throw new BadCredentialsException("Muitas tentativas de login. Tente novamente em alguns minutos.");
        }
        try {
            Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow(() -> {
                    logger.warn("[LOGIN] Tentativa com usuário não encontrado: {} (IP: {})", request.email(), ipCliente);
                    return new UsernameNotFoundException("Usuário não encontrado");
                });
            if (!validarSenha(usuario.getSenha(), request.senha())) {
                logger.warn("[LOGIN] Senha inválida para usuário: {} (IP: {})", request.email(), ipCliente);
                throw new BadCredentialsException("Senha inválida");
            }
            // Login bem-sucedido: limpa tentativas
            limitadorTentativasLogin.limparTentativas(ipCliente);
            logger.info("[LOGIN] Sucesso para usuário: {} (IP: {})", request.email(), ipCliente);
            // Loga as authorities do usuário no login
            if (usuario.getPermissoes() != null && !usuario.getPermissoes().isEmpty()) {
                logger.info("[JWT] Authorities do usuário: {}", usuario.getPermissoes().stream().map(p -> p.getDescricao()).toList());
            } else {
                logger.info("[JWT] Usuário sem authorities/permissões.");
            }
            // Adiciona o email do usuário como claim no token
            String token = jwtService.generateToken(usuario, usuario.getEmail());
            return new AuthResponseDTO(token);
        } catch (BadCredentialsException | UsernameNotFoundException e) {
            limitadorTentativasLogin.registrarTentativa(ipCliente);
            throw e;
        }
    }
}
