package kitnet.com.domain.service.impl;

import kitnet.com.api.dto.predio.PredioFilterDTO;
import kitnet.com.api.dto.predio.PredioPostDTO;
import kitnet.com.api.dto.predio.PredioPutDTO;
import kitnet.com.api.dto.predio.PredioResponseDTO;
import kitnet.com.api.handler.EntidadeEmUsoException;
import kitnet.com.api.handler.NegocioException;
import kitnet.com.api.handler.PredioNaoEncontadoException;
import kitnet.com.api.mapper.PredioMapper;
import kitnet.com.domain.model.Predio;
import kitnet.com.domain.repository.PredioRepository;
import kitnet.com.domain.service.PredioService;
import kitnet.com.infra.utils.PredioMessages;
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
public class PredioServiceImpl implements PredioService {

	@Autowired
	private PredioRepository predioRepository;

	@Autowired
	private PredioMapper predioMapper;

	@Override
	public Page<PredioResponseDTO> filtrar(PredioFilterDTO predioFilterDTO, Pageable pageable) {
		Page<Predio> predioPage = predioRepository.filtrar(predioFilterDTO, pageable);
		Page<PredioResponseDTO> predioResponse = predioMapper.toPagePredioResponse(predioPage);
		return predioResponse;
	}

	@Override
	public PredioResponseDTO buscarOuFalhar(Long idPredio) {
		Predio predio = predioRepository.findById(idPredio)
				.orElseThrow(() -> new NegocioException(
						PredioMessages.MSG_PREDIO_NAO_ENCONTRADO.concat(" id: ").concat(idPredio.toString())));
		return predioMapper.toPredioResponse(predio);
	}

	@Transactional
	@Override
	public PredioResponseDTO salvar(PredioPostDTO predioPostDTO) {
		var predio = predioMapper.toPredio(predioPostDTO);
		var predioSalvo = predioRepository.save(predio);
		return predioMapper.toPredioResponse(predioSalvo);
	}

	@Transactional
	@Override
	public void excluir(Long idPredio) {
		try {
			predioRepository.deleteById(idPredio);
			predioRepository.flush();
		} catch (EmptyResultDataAccessException e) {
			throw new PredioNaoEncontadoException(idPredio);
		} catch (DataIntegrityViolationException e) {
			throw new EntidadeEmUsoException(String.format(PredioMessages.MSG_PREDIO_EM_USO, idPredio));
		}
	}
	
	@Transactional
	@Override
	public PredioResponseDTO atualizar(Long idPredio, PredioPutDTO predioPutDTO) {
		var predio  = predioMapper.toPredio(predioPutDTO);
		var predioSalva = this.predioRepository.findById(idPredio)
				.orElseThrow(() -> new EmptyResultDataAccessException(1));
		BeanUtils.copyProperties(predio, predioSalva, "id");
		var predioAtualizado = this.predioRepository.save(predioSalva);
		return predioMapper.toPredioResponse(predioAtualizado);
	}

	@Override
	public List<PredioResponseDTO> todos() {
		var predios = predioRepository.findAll();
		return predioMapper.toListPredioResponseDTO(predios);
	}


}
