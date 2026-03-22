package kitnet.com.infra.cors;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


/**
 * Configuração global de CORS.
 *
 * Permite requisições apenas de domínios confiáveis.
 * Altere o array de allowedOrigins para incluir os domínios do seu frontend em produção.
 * Exemplo:
 *   .allowedOrigins("https://meusite.com", "http://localhost:4200")
 */
@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins(
                        "http://localhost:4200", // Frontend local
                        "https://meusite.com"    // Produção: ajuste para seu domínio real
                    )
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}