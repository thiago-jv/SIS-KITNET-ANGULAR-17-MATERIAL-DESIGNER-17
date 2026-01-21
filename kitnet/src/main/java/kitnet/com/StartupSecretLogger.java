package kitnet.com;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.util.Base64;

@Component
public class StartupSecretLogger {

    @EventListener(ApplicationReadyEvent.class)
    public void onReady() {
        String secret = System.getenv("SPRING_DATASOURCE_PASSWORD");
        if (secret == null || secret.isEmpty()) {
            try {
                Path p = Paths.get("/run/secrets/db_password");
                if (Files.exists(p)) {
                    secret = Files.readString(p).trim();
                }
            } catch (Exception ignored) {
            }
        }

        if (secret == null || secret.isEmpty()) {
            System.out.println("[startup-secret] Secret not provided at runtime.");
            return;
        }

        System.out.println("[startup-secret] Secret provided (masked): " + mask(secret));
        System.out.println("[startup-secret] Secret fingerprint (SHA-256, base64): " + sha256Base64(secret));
    }

    private String mask(String s) {
        if (s.length() <= 4) return "****";
        String tail = s.substring(s.length() - 4);
        return "****" + tail;
    }

    private String sha256Base64(String s) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] d = md.digest(s.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(d);
        } catch (Exception e) {
            return "<hash-error>";
        }
    }
}
