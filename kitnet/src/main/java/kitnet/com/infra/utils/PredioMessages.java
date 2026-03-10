package kitnet.com.infra.utils;

import java.io.Serializable;

public class PredioMessages implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final String MSG_PREDIO_EM_USO = "Predio de código %d não pode ser removida, pois está em uso.";
    public static final String MSG_PREDIO_NAO_ENCONTRADO = "Predio de código %d não encontrado";
}

