package kitnet.com.domain.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString
@Table(name = "apartamento", schema = "public")
public class Apartamento implements Serializable {

    @Id
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "apartamento_id_seq")
    @SequenceGenerator(name = "apartamento_id_seq", sequenceName = "apartamento_id_seq", initialValue = 1, allocationSize = 1)
    @Column(name = "ID", nullable = false, unique = true)
    private Long id;

    @NotNull
    @Size(min = 1, max = 100)
    @Column(name = "DESCRICAO", nullable = false)
    private String descricao;

    @NotNull
    @Size(min = 1, max = 5)
    @Column(name = "NUMERO", nullable = false)
    private String numero;

}
