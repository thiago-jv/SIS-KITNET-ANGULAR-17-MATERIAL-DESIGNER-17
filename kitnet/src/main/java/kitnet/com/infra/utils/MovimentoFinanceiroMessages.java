package kitnet.com.infra.utils;

import java.io.Serializable;

public class MovimentoFinanceiroMessages implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final String MSG_MOVIMENTO_EM_USO = "Movimento financeito de código %d não pode ser removida, pois está em uso.";
}

