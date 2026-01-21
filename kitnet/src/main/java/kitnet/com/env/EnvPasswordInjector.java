package kitnet.com.env;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.MutablePropertySources;
import org.springframework.core.env.PropertySource;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * EnvironmentPostProcessor que injeta o SPRING_DATASOURCE_PASSWORD a partir do ambiente
 * e substitui quaisquer valores de propriedades iguais ao placeholder "FIXED_SECRET"
 * (ou que o contenham), antes do Spring Boot iniciar. Também imprime uma prova
 * mascarada de que o segredo foi injetado.
 */

public class EnvPasswordInjector implements EnvironmentPostProcessor, Ordered {
    private static final String PLACEHOLDER = "FIXED_SECRET";
    private static final String ENV_NAME = "SPRING_DATASOURCE_PASSWORD";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String secret = System.getenv(ENV_NAME);
        if (secret == null || secret.isEmpty()) {
            secret = environment.getProperty(ENV_NAME);
        }
        if (secret == null || secret.isEmpty()) {
            System.out.println("[env-injector] No " + ENV_NAME + " provided; no substitution performed.");
            return;
        }

        MutablePropertySources sources = environment.getPropertySources();
        boolean replaced = false;

        for (PropertySource<?> ps : sources) {
            if (ps instanceof MapPropertySource) {
                Map<String, Object> original = new LinkedHashMap<>(((MapPropertySource) ps).getSource());
                Map<String, Object> copy = new LinkedHashMap<>(original);
                boolean changed = false;

                for (Map.Entry<String, Object> e : original.entrySet()) {
                    Object v = e.getValue();
                    if (v instanceof String) {
                        String s = (String) v;
                        if (PLACEHOLDER.equals(s)) {
                            copy.put(e.getKey(), secret);
                            changed = true;
                        } else if (s.contains(PLACEHOLDER)) {
                            copy.put(e.getKey(), s.replace(PLACEHOLDER, secret));
                            changed = true;
                        }
                    }
                }

                if (changed) {
                    MapPropertySource injected = new MapPropertySource(ps.getName() + "-injected", copy);
                    sources.replace(ps.getName(), injected);
                    replaced = true;
                }
            }
        }

        // Ensure explicit datasource password is present (helps cases where properties used a placeholder)
        String current = environment.getProperty("spring.datasource.password");
        if (current == null || PLACEHOLDER.equals(current) || (current != null && current.contains(PLACEHOLDER))) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("spring.datasource.password", secret);
            sources.addFirst(new MapPropertySource("env-injected-datasource-password", map));
            replaced = true;
        }

        String masked = mask(secret);
        System.out.println("[env-injector] SPRING_DATASOURCE_PASSWORD injected (masked): " + masked + " (replaced=" + replaced + ")");
    }

    private String mask(String s) {
        if (s == null) return "(null)";
        if (s.length() <= 4) return "****";
        return "****" + s.substring(s.length() - 4);
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }
}
