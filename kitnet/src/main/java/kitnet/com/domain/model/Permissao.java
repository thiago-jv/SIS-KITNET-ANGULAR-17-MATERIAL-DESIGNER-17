package kitnet.com.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Entity
@AllArgsConstructor
@ToString
@Table(name = "PERMISSAO", schema = "public")
public class Permissao {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "permissao_seq")
    @SequenceGenerator(name = "permissao_seq", sequenceName = "permissao_seq", initialValue = 1, allocationSize = 1)
    @Column( nullable = false, unique = true)
    private Long id;

    @Column(nullable = false)
    private String descricao;

    public Permissao() {
    }
}
