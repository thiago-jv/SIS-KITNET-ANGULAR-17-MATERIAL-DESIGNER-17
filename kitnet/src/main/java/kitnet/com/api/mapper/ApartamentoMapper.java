package kitnet.com.api.mapper;


import kitnet.com.api.dto.predio.PredioId;
import kitnet.com.api.dto.apartamento.ApartamentoPostDTO;
import kitnet.com.api.dto.apartamento.ApartamentoPutDTO;
import kitnet.com.api.dto.apartamento.ApartamentoResponseDTO;
import kitnet.com.domain.model.Apartamento;
import kitnet.com.domain.model.Predio;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface ApartamentoMapper {

    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(source = "numeroApartamento", target = "numeroApartamento"),
            @Mapping(source = "descricao", target = "descricao"),
            @Mapping(source = "medidor", target = "medidor"),
            @Mapping(source = "statusApartamento", target = "statusApartamento"),
            @Mapping(source = "predio", target = "predio")
    })
    Apartamento toApartamento(ApartamentoPostDTO apartamentoPostDTO);

    ApartamentoPutDTO toApartamentoPutDTO(Apartamento apartamento);

    @Mapping(source = "predio", target = "predio")
    Apartamento toApartamento(ApartamentoPutDTO apartamentoPutDTO);

    ApartamentoResponseDTO toApartamentoResponse(Apartamento apartamento);

    List<ApartamentoResponseDTO> toListApartamentoResponse(List<Apartamento> apartamentos);

    default Page<ApartamentoResponseDTO> toPageApartamentoResponse(Page<Apartamento> apartamentoPage) {
        List<ApartamentoResponseDTO> content = apartamentoPage.getContent().stream()
                .map(this::toApartamentoResponse)
                .collect(Collectors.toList());
        return new PageImpl<>(content, apartamentoPage.getPageable(), apartamentoPage.getTotalElements());
    }

    default Predio toPredio(PredioId predioId) {
        if (predioId == null || predioId.id() == null) {
            return null;
        }
        Predio predio = new Predio();
        predio.setId(predioId.id());
        return predio;
    }

}
