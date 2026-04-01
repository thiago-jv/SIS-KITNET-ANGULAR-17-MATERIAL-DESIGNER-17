package kitnet.com.security;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LimitadorTentativasLoginTest {

    @Test
    void deveBloquearAposExcederLimiteDeTentativas() {
        LimitadorTentativasLogin limitador = new LimitadorTentativasLogin();
        String chave = "127.0.0.1";

        for (int i = 0; i < 6; i++) {
            limitador.registrarTentativa(chave);
        }

        assertTrue(limitador.estaBloqueado(chave));
    }

    @Test
    void deveLimparTentativasAposSucesso() {
        LimitadorTentativasLogin limitador = new LimitadorTentativasLogin();
        String chave = "127.0.0.1";

        for (int i = 0; i < 6; i++) {
            limitador.registrarTentativa(chave);
        }

        assertTrue(limitador.estaBloqueado(chave));

        limitador.limparTentativas(chave);

        assertFalse(limitador.estaBloqueado(chave));
    }
}
