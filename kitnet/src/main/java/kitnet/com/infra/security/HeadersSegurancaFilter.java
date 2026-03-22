package kitnet.com.infra.security;

import org.springframework.stereotype.Component;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Filtro para adicionar headers de segurança HTTP em todas as respostas.
 * Protege contra XSS, clickjacking, detecção incorreta de tipo de conteúdo, etc.
 */
@Component
public class HeadersSegurancaFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        if (response instanceof HttpServletResponse) {
            HttpServletResponse res = (HttpServletResponse) response;
            res.setHeader("X-Frame-Options", "DENY");
            res.setHeader("X-Content-Type-Options", "nosniff");
            res.setHeader("X-XSS-Protection", "1; mode=block");
            res.setHeader("Referrer-Policy", "no-referrer");
            // Política básica de CSP (ajuste conforme necessidade do frontend)
            res.setHeader("Content-Security-Policy", "default-src 'self'");
        }
        chain.doFilter(request, response);
    }
}
