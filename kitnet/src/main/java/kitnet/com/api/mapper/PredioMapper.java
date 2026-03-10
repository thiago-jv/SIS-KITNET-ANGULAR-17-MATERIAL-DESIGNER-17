package kitnet.com.api.mapper;

import kitnet.com.api.dto.predio.PredioPostDTO;
import kitnet.com.api.dto.predio.PredioPutDTO;
import kitnet.com.api.dto.predio.PredioResponseDTO;
import kitnet.com.domain.model.Predio;
import org.mapstruct.Mapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.lang.NonNull;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface PredioMapper {

    Predio toPredio(PredioPostDTO predioPostDTO);

    Predio toPredio(PredioPutDTO predioPutDTO);

    PredioResponseDTO toPredioResponse(Predio predio);

    default @NonNull Page<PredioResponseDTO> toPagePredioResponse(@NonNull Page<Predio> predioPage) {
        List<PredioResponseDTO> content = predioPage.getContent() == null ? List.of() : predioPage.getContent().stream()
                .map(this::toPredioResponse)
                .collect(Collectors.toList());
        return new PageImpl<>(content, predioPage.getPageable(), predioPage.getTotalElements());
    }

    @NonNull
    List<PredioResponseDTO> toListPredioResponseDTO(@NonNull List<Predio> predios);

}
