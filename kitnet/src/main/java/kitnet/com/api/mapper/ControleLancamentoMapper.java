package kitnet.com.api.mapper;

import kitnet.com.api.dto.controleLancamento.ControleLancamentoPostDTO;
import kitnet.com.api.dto.controleLancamento.ControleLancamentoPutDTO;
import kitnet.com.api.dto.controleLancamento.ControleLancamentoResponseDTO;
import kitnet.com.api.dto.controleLancamento.LancamentoApartamentoDTO;
import kitnet.com.domain.model.ControleLancamento;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface ControleLancamentoMapper {

    ControleLancamento toControleLancamento(ControleLancamentoPostDTO controleLancamentoPostDTO);

    ControleLancamento toControleLancamento(ControleLancamentoPutDTO controleLancamentoPutDTO);

    @Mapping(target = "nomeInquilino", source = "inquilino.nome")
    @Mapping(target = "numeroApartamento", source = "apartamento.numeroApartamento")
    ControleLancamentoResponseDTO toControleLancamentoResponse(ControleLancamento controleLancamento);

    default LancamentoApartamentoDTO toLancamentoApartamentoDTO(ControleLancamento controleLancamento) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        return new LancamentoApartamentoDTO(
                controleLancamento.getId(),
                controleLancamento.getDataEntrada().format(formatter),
                controleLancamento.getInquilino().getNome(),
                controleLancamento.getValores().getValorPagoApartamento().toString(),
                controleLancamento.getApartamento().getPredio().getNumero(),
                controleLancamento.getApartamento().getNumeroApartamento(),
                controleLancamento.getApartamento().getPredio().getCep(),
                controleLancamento.getApartamento().getPredio().getBairro(),
                controleLancamento.getApartamento().getPredio().getUf(),
                controleLancamento.getApartamento().getPredio().getLocalidade(),
                controleLancamento.getApartamento().getPredio().getLogradouro()
        );
    }

    default List<LancamentoApartamentoDTO> toListLancamentoApartamentoDTO(List<ControleLancamento> controleLancamentos) {
        return controleLancamentos.stream()
                .map(this::toLancamentoApartamentoDTO)
                .collect(Collectors.toList());
    }

    List<ControleLancamentoResponseDTO> toListControleLancamentoResponse(List<ControleLancamento> controleLancamentos);

    default Page<ControleLancamentoResponseDTO> toPageControleResponse(Page<ControleLancamento> controleLancamentoPage) {
        List<ControleLancamentoResponseDTO> content = controleLancamentoPage.getContent().stream()
                .map(this::toControleLancamentoResponse)
                .collect(Collectors.toList());
        return new PageImpl<>(content, controleLancamentoPage.getPageable(), controleLancamentoPage.getTotalElements());
    }
}
