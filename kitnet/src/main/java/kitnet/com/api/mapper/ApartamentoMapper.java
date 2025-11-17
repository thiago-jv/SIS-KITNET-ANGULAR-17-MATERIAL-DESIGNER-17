package kitnet.com.api.mapper;


import kitnet.com.api.dto.apartamento.ApartamentoPostDTO;
import kitnet.com.api.dto.apartamento.ApartamentoPutDTO;
import kitnet.com.api.dto.apartamento.ApartamentoResponseDTO;
import kitnet.com.domain.model.Apartamento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ApartamentoMapper {

    public ApartamentoResponseDTO toApartamentoResponse(Apartamento apartamento) {
        return new ApartamentoResponseDTO(apartamento.getId(), apartamento.getDescricao(),
                apartamento.getDescricao());
    }

    public Apartamento toApartamento(ApartamentoPostDTO apartamentoPost) {
        Apartamento apartamento = new Apartamento();
        apartamento.setDescricao(apartamentoPost.getDescricao());
        apartamento.setNumero(apartamentoPost.getNumero());
        return apartamento;
    }

    public List<ApartamentoResponseDTO> toListApartamentoResponse(List<Apartamento> apartamentos) {
        return apartamentos.stream()
                .map(apartamento -> new ApartamentoResponseDTO(apartamento.getId(), apartamento.getDescricao(),
                        apartamento.getNumero()))
                .collect(Collectors.toList());
    }

    public Apartamento toApartamento(Apartamento apartamentoSave, ApartamentoPutDTO apartamentoPut) {
        apartamentoSave.setDescricao(apartamentoPut.getDescricao());
        apartamentoSave.setNumero(apartamentoPut.getNumero());
        return apartamentoSave;
    }

    public Page<ApartamentoResponseDTO> toPageApartamentoResponse(Page<Apartamento> apartamentoPage) {
        List<ApartamentoResponseDTO> content = apartamentoPage.getContent().stream()
                .map(this::toApartamentoResponse)
                .collect(Collectors.toList());
        return new PageImpl<>(content, apartamentoPage.getPageable(), apartamentoPage.getTotalElements());
    }

}
