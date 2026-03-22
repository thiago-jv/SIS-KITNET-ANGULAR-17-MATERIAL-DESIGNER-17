package kitnet.com.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.crypto.SecretKey;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends org.springframework.web.filter.OncePerRequestFilter {

    @Value("${jwt.secret:defaultsecretkeydefaultsecretkey}")
    private String jwtSecret;

    @Override
        protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        String token = parseJwt(request);
        if (token != null) {
            try {
                SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
                Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
                String username = claims.getSubject();
                List<SimpleGrantedAuthority> authorities = new java.util.ArrayList<>();
                // Recupera roles
                List<?> rawRoles = claims.get("roles", List.class);
                if (rawRoles != null) {
                    for (Object role : rawRoles) {
                        if (role instanceof String) {
                            authorities.add(new SimpleGrantedAuthority((String) role));
                        }
                    }
                }
                // Recupera permissions
                List<?> rawPermissions = claims.get("permissions", List.class);
                if (rawPermissions != null) {
                    for (Object perm : rawPermissions) {
                        if (perm instanceof String) {
                            authorities.add(new SimpleGrantedAuthority((String) perm));
                        }
                    }
                }
                if (username != null) {
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        username, null, authorities
                    );
                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } catch (Exception e) {
                // Token inválido, não autentica
            }
        }
        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }
}
