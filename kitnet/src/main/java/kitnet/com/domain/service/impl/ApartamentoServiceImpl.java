package kitnet.com.domain.service.impl;

import kitnet.com.api.dto.apartamento.ApartamentoFilterDTO;
import kitnet.com.api.dto.apartamento.ApartamentoPostDTO;
import kitnet.com.api.dto.apartamento.ApartamentoPutDTO;
import kitnet.com.api.dto.apartamento.ApartamentoResponseDTO;
import kitnet.com.api.handler.BusinnesException;
import kitnet.com.api.mapper.ApartamentoMapper;
import kitnet.com.domain.model.Apartamento;
import kitnet.com.domain.repository.ApartamentoRepository;
import kitnet.com.domain.service.ApartamentoService;
import kitnet.com.infra.utils.Messages;
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

    @Override
    public void remove(Long id) {
        apartamentoRepository.deleteById(id);
    }

    @Override
    public ApartamentoResponseDTO findById(Long id) throws BusinnesException {
        Apartamento apartamento = apartamentoRepository.findById(id)
                .orElseThrow(() -> new BusinnesException(
                        Messages.MSG_RECURSO_NAO_ENCONTRADO.concat(" id: ").concat(id.toString())));
        return apartamentoMapper.toApartamentoResponse(apartamento);
    }

    @Override
    public ApartamentoResponseDTO update(ApartamentoPutDTO apartamentoPut, Long id) {
        Apartamento apartamentoSave = apartamentoRepository.findById(id)
                .orElseThrow(() -> new BusinnesException(
                        Messages.MSG_RECURSO_NAO_ENCONTRADO.concat(" id: ").concat(id.toString())));

        Apartamento apartamento = apartamentoMapper.toApartamento(apartamentoSave, apartamentoPut);
        ApartamentoResponseDTO apartamentoResponse = apartamentoMapper.toApartamentoResponse(apartamentoRepository.save(apartamento));
        return apartamentoResponse;
    }

}
