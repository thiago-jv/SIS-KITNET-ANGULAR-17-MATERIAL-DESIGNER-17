package kitnet.com.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(
    name = "MOVIMENTO_FINANCEIRO",
    indexes = {
        @Index(name = "idx_tipo_movimento", columnList = "TIPO_MOVIMENTO"),
        @Index(name = "idx_categoria_financeira", columnList = "CATEGORIA_FINANCEIRA"),
        @Index(name = "idx_id_apartamento", columnList = "ID_APARTAMENTO"),
        @Index(name = "idx_id_inquilino", columnList = "ID_INQUILINO"),
        @Index(name = "idx_id_lancamento", columnList = "ID_LANCAMENTO")
    }
)
@AllArgsConstructor
@ToString
public class MovimentoFinanceiro implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "movimento_financeiro_seq")
    @SequenceGenerator(name = "movimento_financeiro_seq", sequenceName = "movimento_financeiro_seq", initialValue = 1, allocationSize = 1)
    @Column(name = "ID", nullable = false, unique = true)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "TIPO_MOVIMENTO", nullable = false)
    private TipoMovimento tipo;

    @Enumerated(EnumType.STRING)
    @Column(name = "CATEGORIA_FINANCEIRA", nullable = false)
    private CategoriaFinanceira categoria;

    @Column(name = "DESCRICAO")
    private String descricao;

    @Column(name = "VALOR")
    private BigDecimal valor;

    @Column(name = "DATA")
    private LocalDate data;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_APARTAMENTO", referencedColumnName = "ID")
    private Apartamento apartamento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_INQUILINO", referencedColumnName = "ID")
    private Inquilino inquilino;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_LANCAMENTO", referencedColumnName = "ID")
    private ControleLancamento lancamento;

    public MovimentoFinanceiro() {}

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        MovimentoFinanceiro other = (MovimentoFinanceiro) obj;
        if (id == null) {
            if (other.id != null)
                return false;
        } else if (!id.equals(other.id))
            return false;
        return true;
      }
    }