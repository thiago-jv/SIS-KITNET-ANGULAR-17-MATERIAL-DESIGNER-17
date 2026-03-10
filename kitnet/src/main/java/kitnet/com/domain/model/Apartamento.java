package kitnet.com.domain.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import kitnet.com.infra.utils.Constantes;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@Entity
@AllArgsConstructor
@ToString
@Table(name = "APARTAMENTO", schema = "public",
    indexes = {
        @Index(name = "idx_apartamento_idpredio", columnList = "IDPREDIO"),
        @Index(name = "idx_apartamento_status", columnList = "STATUSAPARTAMENTO"),
        @Index(name = "idx_apartamento_numero", columnList = "NUMEROAPARTAMENTO")
    }
)
public class Apartamento implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "apartamento_seq")
    @SequenceGenerator(name = "apartamento_seq", sequenceName = "apartamento_seq", initialValue = 1, allocationSize = 1)
    @Column(name = "ID", nullable = false, unique = true)
    private Long id;

    @NotNull
    @Size(min = 1, max = 10)
    @Column(name = "NUMEROAPARTAMENTO", nullable = false, unique = true)
    private String numeroApartamento;

    @NotNull
    @Size(min = 1, max = 90)
    @Column(name = "DESCRICAO", nullable = false, unique = true)
    private String descricao;

    @Size(min = 1, max = 10)
    @Column(name = "MEDIDOR", unique = true)
    private String medidor;

    @Column(name = "STATUSAPARTAMENTO", length = 20, nullable = false)
    private String statusApartamento = Constantes.DISPONIVEL;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IDPREDIO", referencedColumnName = "ID", nullable = false)
    private Predio predio;

    public Apartamento() {

    }

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
        Apartamento other = (Apartamento) obj;
        if (id == null) {
            if (other.id != null)
                return false;
        } else if (!id.equals(other.id))
            return false;
        return true;
    }
}