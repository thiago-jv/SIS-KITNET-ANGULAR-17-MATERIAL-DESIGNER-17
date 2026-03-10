package kitnet.com.api.mapper;

import kitnet.com.api.dto.inquilino.InquilinoPostDTO;
import kitnet.com.api.dto.inquilino.InquilinoPutDTO;
import kitnet.com.api.dto.inquilino.InquilinoResponseDTO;
import kitnet.com.domain.model.Inquilino;
import org.mapstruct.Mapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface InquilinoMapper {

    Inquilino toInquilino(InquilinoPostDTO inquilinoPostDTO);

    Inquilino toInquilino(InquilinoPutDTO inquilinoPutDTO);

    InquilinoResponseDTO toInquilinoResponse(Inquilino inquilino);

    List<InquilinoResponseDTO> toListInquilinoResponse(List<Inquilino> inquilinos);

    default Page<InquilinoResponseDTO> toPageInquilinoResponse(Page<Inquilino> inquilinoPage) {
        List<InquilinoResponseDTO> content = inquilinoPage.getContent().stream()
                .map(this::toInquilinoResponse)
                .collect(Collectors.toList());
        return new PageImpl<>(content, inquilinoPage.getPageable(), inquilinoPage.getTotalElements());
    }
}
