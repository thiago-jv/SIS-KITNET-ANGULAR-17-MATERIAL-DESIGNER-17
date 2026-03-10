package kitnet.com.domain.service.impl;

import kitnet.com.api.dto.apartamento.ApartamentoFilterDTO;
import kitnet.com.api.dto.apartamento.ApartamentoPostDTO;
import kitnet.com.api.dto.apartamento.ApartamentoPutDTO;
import kitnet.com.api.dto.apartamento.ApartamentoResponseDTO;
import kitnet.com.api.handler.ApartamentoNaoEncontadoException;
import kitnet.com.api.handler.EntidadeEmUsoException;
import kitnet.com.api.mapper.ApartamentoMapper;
import kitnet.com.domain.model.Apartamento;
import kitnet.com.domain.repository.ApartamentoRepository;
import org.springframework.lang.NonNull;
import kitnet.com.domain.service.ApartamentoService;
import kitnet.com.infra.utils.ApartamentoMessages;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ApartamentoServiceImpl implements ApartamentoService {

    @Autowired
    private ApartamentoRepository apartamentoRepository;

    @Autowired
    private  ApartamentoMapper apartamentoMapper;

    @Override
    public Page<ApartamentoResponseDTO> filtrar(ApartamentoFilterDTO apartamentoFilter, Pageable pageable) {
        Page<Apartamento> apartamentoPage = apartamentoRepository.filtrar(apartamentoFilter, pageable);
        Page<ApartamentoResponseDTO> apartamentoResponse = apartamentoMapper.toPageApartamentoResponse(apartamentoPage);
        return apartamentoResponse;
    }

    public @NonNull Apartamento buscarOuFalhar(@NonNull Long idApartamento) {
        return apartamentoRepository.findById(idApartamento).orElseThrow(() -> new ApartamentoNaoEncontadoException(idApartamento));
    }

    @Override
    public @NonNull ApartamentoResponseDTO buscarPorId(@NonNull Long idApartamento) {
        Apartamento apartamento = buscarOuFalhar(idApartamento);
        return apartamentoMapper.toApartamentoResponse(apartamento);
    }

    @Transactional
	@Override
    public @NonNull ApartamentoResponseDTO salvar(@NonNull ApartamentoPostDTO apartamentoPostDTO) {
        var apartamento = apartamentoMapper.toApartamento(apartamentoPostDTO);
        var apartamentoSalvo = apartamentoRepository.save(apartamento);
        return apartamentoMapper.toApartamentoResponse(apartamentoSalvo);
    }

    @Transactional
	@Override
    public void remover(@NonNull Long idApartamento) {
        try {
            apartamentoRepository.deleteById(idApartamento);
            apartamentoRepository.flush();
        } catch (EmptyResultDataAccessException e) {
            throw new ApartamentoNaoEncontadoException(idApartamento);
        } catch (DataIntegrityViolationException e) {
            throw new EntidadeEmUsoException(String.format(ApartamentoMessages.MSG_APARTAMENTO_EM_USO, idApartamento));
        }
    }

    @Transactional
	@Override
    public @NonNull ApartamentoResponseDTO atualizar(@NonNull ApartamentoPutDTO apartamentoPutDTO, @NonNull Long idApartamento) {
        var apartamento = apartamentoMapper.toApartamento(apartamentoPutDTO);
        var apartamentoSalva = this.apartamentoRepository.findById(idApartamento)
                .orElseThrow(() -> new EmptyResultDataAccessException(1));
        BeanUtils.copyProperties(apartamento, apartamentoSalva, "id");
        return apartamentoMapper.toApartamentoResponse(this.apartamentoRepository.save(apartamentoSalva));
    }

    @Override
    public List<ApartamentoResponseDTO> listarTodos() {
        var apartamentos = apartamentoRepository.findAll();
        return apartamentoMapper.toListApartamentoResponse(apartamentos);
    }

}
