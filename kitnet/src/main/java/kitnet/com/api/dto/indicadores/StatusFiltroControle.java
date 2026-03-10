package kitnet.com.api.dto.indicadores;

public enum StatusFiltroControle {
    ABERTO("Contratos Abertos"),
    FECHADO("Contratos Fechados"),
    AMBOS("Contratos Abertos e Fechados");

    private final String descricao;

    StatusFiltroControle(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
