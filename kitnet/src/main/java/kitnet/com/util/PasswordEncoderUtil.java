package kitnet.com.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordEncoderUtil {
   public static void main(String[] args) {
    String senha = (args.length == 0) ? "usuario" : args[0];
    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    String hash = encoder.encode(senha);
    System.out.println("Hash gerado: " + hash);
}
}
