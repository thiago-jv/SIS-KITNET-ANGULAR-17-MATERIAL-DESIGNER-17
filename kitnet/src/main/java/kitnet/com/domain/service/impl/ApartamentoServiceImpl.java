package kitnet.com.domain.service.impl;

import kitnet.com.api.dto.apartamento.ApartamentoFilterDTO;
import kitnet.com.api.dto.apartamento.ApartamentoPostDTO;
import kitnet.com.api.dto.apartamento.ApartamentoResponseDTO;
import kitnet.com.api.mapper.ApartamentoMapper;
import kitnet.com.domain.model.Apartamento;
import kitnet.com.domain.repository.ApartamentoRepository;
import kitnet.com.domain.service.ApartamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ApartamentoServiceImpl implements ApartamentoService {

    @Autowired
    private ApartamentoRepository apartamentoRepository;

    @Autowired
    private  ApartamentoMapper apartamentoMapper;

    @Override
    public ApartamentoResponseDTO create(ApartamentoPostDTO apartamentoPost) {
        Apartamento apartamento = apartamentoMapper.toApartamento(apartamentoPost);
        Apartamento apartamentoSalvo = apartamentoRepository.save(apartamento);
        ApartamentoResponseDTO apartamentoResponse = apartamentoMapper.toApartamentoResponse(apartamentoSalvo);
        return apartamentoResponse;
    }

    @Override
    public Page<ApartamentoResponseDTO> filter(ApartamentoFilterDTO apartamentoFilter, Pageable pageable) {
        Page<Apartamento> apartamentoPage = apartamentoRepository.filter(apartamentoFilter, pageable);
        Page<ApartamentoResponseDTO> apartamentoResponse = apartamentoMapper.toPageApartamentoResponse(apartamentoPage);
        return apartamentoResponse;
    }

}
