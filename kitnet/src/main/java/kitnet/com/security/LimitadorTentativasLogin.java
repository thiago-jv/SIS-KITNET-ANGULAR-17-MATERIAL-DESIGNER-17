
package kitnet.com.security;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Componente responsável por limitar tentativas de login consecutivas por IP ou chave.
 * Bloqueia temporariamente após várias tentativas inválidas para evitar ataques de força bruta.
 *
 * - Limite: 5 tentativas em 10 minutos.
 * - Bloqueio: 15 minutos após exceder o limite.
 *
 * Uso recomendado para endpoints de autenticação.
 */
@Component
public class LimitadorTentativasLogin {
    
    private static final int MAXIMO_TENTATIVAS = 5;
    private static final long TEMPO_BLOQUEIO_MS = 15 * 60 * 1000; // 15 minutos
    private static final long JANELA_MS = 10 * 60 * 1000; // 10 minutos

    private static class Tentativa {
        int quantidade;
        long primeiroMomento;
        long bloqueadoAte;
    }

    private final Map<String, Tentativa> tentativas = new ConcurrentHashMap<>();

    /**
     * Verifica se a chave (ex: IP) está temporariamente bloqueada por excesso de tentativas.
     * @param chave Identificador único (ex: IP do cliente)
     * @return true se bloqueado, false caso contrário
     */
    public boolean estaBloqueado(String chave) {
        Tentativa tentativa = tentativas.get(chave);
        if (tentativa == null) return false;
        long agora = Instant.now().toEpochMilli();
        if (tentativa.bloqueadoAte > agora) return true;
        if (agora - tentativa.primeiroMomento > JANELA_MS) {
            tentativas.remove(chave);
            return false;
        }
        return false;
    }

    /**
     * Registra uma tentativa de login para a chave informada.
     * Se exceder o limite, inicia o bloqueio temporário.
     * @param chave Identificador único (ex: IP do cliente)
     */
    public void registrarTentativa(String chave) {
        long agora = Instant.now().toEpochMilli();
        Tentativa tentativa = tentativas.computeIfAbsent(chave, k -> new Tentativa());
        if (agora - tentativa.primeiroMomento > JANELA_MS) {
            tentativa.quantidade = 1;
            tentativa.primeiroMomento = agora;
            tentativa.bloqueadoAte = 0;
        } else {
            tentativa.quantidade++;
            if (tentativa.quantidade > MAXIMO_TENTATIVAS) {
                tentativa.bloqueadoAte = agora + TEMPO_BLOQUEIO_MS;
            }
        }
    }

    /**
     * Remove o histórico de tentativas para a chave informada.
     * Deve ser usado após login bem-sucedido para evitar bloqueio indevido.
     * @param chave Identificador único (ex: IP do cliente)
     */
    public void limparTentativas(String chave) {
        tentativas.remove(chave);
    }
}
