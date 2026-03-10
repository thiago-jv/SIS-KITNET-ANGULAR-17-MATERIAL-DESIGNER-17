package kitnet.com.api.mapper;

import kitnet.com.api.dto.valor.ValorPostDTO;
import kitnet.com.api.dto.valor.ValorPutDTO;
import kitnet.com.api.dto.valor.ValorResponseDTO;
import kitnet.com.domain.model.Valor;
import org.springframework.lang.NonNull;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface ValorMapper {

    @Mapping(target = "id", ignore = true)
    Valor toValor(ValorPostDTO valorDTO);

    @Mapping(target = "id", ignore = true)
    Valor toValor(ValorPutDTO valorDTO);

    ValorResponseDTO toValorResponse(Valor valor);

    @NonNull
    List<ValorResponseDTO> toListValorResponse(@NonNull List<Valor> valors);

    default @NonNull Page<ValorResponseDTO> toPageValorResponse(@NonNull Page<Valor> valorPage) {
        List<ValorResponseDTO> content = valorPage.getContent() == null ? List.of() : valorPage.getContent().stream()
                .map(this::toValorResponse)
                .collect(Collectors.toList());
        return new PageImpl<>(content, valorPage.getPageable(), valorPage.getTotalElements());
    }

}
