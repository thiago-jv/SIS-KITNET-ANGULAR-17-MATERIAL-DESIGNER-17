package kitnet.com.api.mapper;

import kitnet.com.api.dto.financeiro.MovimentoFinanceiroPostDTO;
import kitnet.com.api.dto.financeiro.MovimentoFinanceiroPutDTO;
import kitnet.com.api.dto.financeiro.MovimentoFinanceiroResponseDTO;
import kitnet.com.domain.model.Apartamento;
import kitnet.com.domain.model.ControleLancamento;
import kitnet.com.domain.model.Inquilino;
import kitnet.com.domain.model.MovimentoFinanceiro;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface MovimentoFinanceiroMapper {

    @Mapping(source = "apartamentoId", target = "apartamento")
    @Mapping(source = "inquilinoId", target = "inquilino")
    @Mapping(source = "lancamentoId", target = "lancamento")
    MovimentoFinanceiro toMovimentoFinanceiro(MovimentoFinanceiroPostDTO dto);

    @Mapping(source = "apartamentoId", target = "apartamento")
    @Mapping(source = "inquilinoId", target = "inquilino")
    @Mapping(source = "lancamentoId", target = "lancamento")
    MovimentoFinanceiro toMovimentoFinanceiro(MovimentoFinanceiroPutDTO dto);

    @Mapping(source = "apartamento.id", target = "apartamentoId")
    @Mapping(source = "inquilino.id", target = "inquilinoId")
    @Mapping(source = "lancamento.id", target = "lancamentoId")
    MovimentoFinanceiroResponseDTO toMovimentoFinanceiroResponse(MovimentoFinanceiro entity);

    @Mapping(source = "apartamento.id", target = "apartamentoId")
    @Mapping(source = "inquilino.id", target = "inquilinoId")
    @Mapping(source = "lancamento.id", target = "lancamentoId")
    MovimentoFinanceiroPutDTO toMovimentoFinanceiroPutDTO(MovimentoFinanceiro entity);

    List<MovimentoFinanceiroResponseDTO> toListMovimentoFinanceiroResponse(List<MovimentoFinanceiro> entities);

    default Page<MovimentoFinanceiroResponseDTO> toPageMovimentoFinanceiroResponse(Page<MovimentoFinanceiro> page) {
        List<MovimentoFinanceiroResponseDTO> content = page.getContent()
                .stream()
                .map(this::toMovimentoFinanceiroResponse)
                .collect(Collectors.toList());

        return new PageImpl<>(content, page.getPageable(), page.getTotalElements());
    }

    default Apartamento mapApartamento(Long id) {
        if (id == null) return null;
        Apartamento a = new Apartamento();
        a.setId(id);
        return a;
    }

    default Inquilino mapInquilino(Long id) {
        if (id == null) return null;
        Inquilino i = new Inquilino();
        i.setId(id);
        return i;
    }

    default ControleLancamento mapLancamento(Long id) {
        if (id == null) return null;
        ControleLancamento l = new ControleLancamento();
        l.setId(id);
        return l;
    }

}