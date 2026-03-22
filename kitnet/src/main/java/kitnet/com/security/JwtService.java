package kitnet.com.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import kitnet.com.domain.model.Usuario;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {
    // Sobrecarga para aceitar email explicitamente
    public String generateToken(Usuario usuario, String email) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        java.util.List<String> roles = new java.util.ArrayList<>();
        java.util.List<String> permissions = new java.util.ArrayList<>();
        if (usuario.getPermissoes() != null) {
            for (var p : usuario.getPermissoes()) {
                if (p.getDescricao().startsWith("ROLE_")) {
                    roles.add(p.getDescricao());
                } else if (p.getDescricao().startsWith("PERM_")) {
                    permissions.add(p.getDescricao());
                }
            }
        }
        return Jwts.builder()
                .setSubject(usuario.getEmail())
                .claim("roles", roles)
                .claim("permissions", permissions)
                .claim("email", email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    @Value("${jwt.secret:defaultsecretkeydefaultsecretkey}")
    private String jwtSecret;

    @Value("${jwt.expiration:3600000}") // 1 hora padrão
    private long jwtExpirationMs;

    public String generateToken(Usuario usuario) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        // Separar roles e permissions
        java.util.List<String> roles = new java.util.ArrayList<>();
        java.util.List<String> permissions = new java.util.ArrayList<>();
        if (usuario.getPermissoes() != null) {
            for (var p : usuario.getPermissoes()) {
                if (p.getDescricao().startsWith("ROLE_")) {
                    roles.add(p.getDescricao());
                } else if (p.getDescricao().startsWith("PERM_")) {
                    permissions.add(p.getDescricao());
                }
            }
        }
        return Jwts.builder()
                .setSubject(usuario.getEmail())
                .claim("roles", roles)
                .claim("permissions", permissions)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

}
