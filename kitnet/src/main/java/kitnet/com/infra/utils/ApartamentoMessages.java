package kitnet.com.infra.utils;

import java.io.Serializable;

public class ApartamentoMessages implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final String MSG_APARTAMENTO_EM_USO = "Apartamento de código %d não pode ser removida, pois está em uso.";
    public static final String MSG_APARTAMENTO_DEBITO = "Apartamento de código %d não pode ser fechado, pois está em débito.";

}

