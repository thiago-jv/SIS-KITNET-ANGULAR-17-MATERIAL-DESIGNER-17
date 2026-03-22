package kitnet.com.infra.openapi;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIDocs {

    @Bean
    public OpenAPI docs() {
        return new OpenAPI()
            .info(new Info()
                .title("KITNET")
                .version("1.0.0")
                .description("API para gestão de kitnets, prédios, inquilinos e lançamentos.\n\n"
                )
                .contact(new io.swagger.v3.oas.models.info.Contact()
                    .name("Equipe KITNET")
                    .email("contato@kitnet.com"))
                .license(new io.swagger.v3.oas.models.info.License()
                    .name("TH License")
                    .url("https://www.linkedin.com/in/thiago-melo-045950b6/"))
            )
            .addServersItem(new io.swagger.v3.oas.models.servers.Server()
                .url("http://localhost:8089")
                .description("Servidor local"))
            .components(new Components()
                .addSecuritySchemes("bearer-key",
                    new io.swagger.v3.oas.models.security.SecurityScheme()
                        .type(io.swagger.v3.oas.models.security.SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                )
            )
            .addTagsItem(new io.swagger.v3.oas.models.tags.Tag().name("Inquilinos").description("Operações relacionadas a inquilinos"))
            .addTagsItem(new io.swagger.v3.oas.models.tags.Tag().name("Prédios").description("Operações relacionadas a prédios"))
            .addTagsItem(new io.swagger.v3.oas.models.tags.Tag().name("Apartamentos").description("Operações relacionadas a apartamentos"))
            .addTagsItem(new io.swagger.v3.oas.models.tags.Tag().name("Valores").description("Operações relacionadas a valores"))
            .addTagsItem(new io.swagger.v3.oas.models.tags.Tag().name("Lançamentos").description("Operações relacionadas a lançamentos"))
            .addTagsItem(new io.swagger.v3.oas.models.tags.Tag().name("Indicadores").description("Indicadores e relatórios"))
            .addSecurityItem(new io.swagger.v3.oas.models.security.SecurityRequirement().addList("bearer-key"));
    }
}
