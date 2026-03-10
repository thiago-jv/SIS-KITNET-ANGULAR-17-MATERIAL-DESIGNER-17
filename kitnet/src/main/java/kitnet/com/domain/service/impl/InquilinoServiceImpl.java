package kitnet.com.domain.service.impl;

import kitnet.com.api.dto.inquilino.InquilinoFilterDTO;
import kitnet.com.api.dto.inquilino.InquilinoPostDTO;
import kitnet.com.api.dto.inquilino.InquilinoPutDTO;
import kitnet.com.api.dto.inquilino.InquilinoResponseDTO;
import kitnet.com.api.handler.EntidadeEmUsoException;
import kitnet.com.api.handler.InquilinoNaoEncontadoException;
import kitnet.com.api.handler.PredioNaoEncontadoException;
import kitnet.com.api.mapper.InquilinoMapper;
import kitnet.com.domain.model.Inquilino;
import kitnet.com.domain.repository.InquilinoRepository;
import kitnet.com.domain.service.InquilinoService;
import org.springframework.lang.NonNull;
import kitnet.com.infra.utils.InquilinoMessages;
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
public class InquilinoServiceImpl implements InquilinoService {

	@Autowired
	private InquilinoRepository inquilinoRepository;

	@Autowired
	private InquilinoMapper inquilinoMapper;

	@Override
	public Page<InquilinoResponseDTO> filtrar(InquilinoFilterDTO inquilinoFilterDTO, Pageable pageable) {
		Page<Inquilino> predioPage = inquilinoRepository.filtrar(inquilinoFilterDTO, pageable);
		Page<InquilinoResponseDTO> predioResponse = inquilinoMapper.toPageInquilinoResponse(predioPage);
		return predioResponse;
	}

	@Override
	public List<InquilinoResponseDTO> listarTodos() {
		var inquilinos = inquilinoRepository.findAll();
		return inquilinoMapper.toListInquilinoResponse(inquilinos);
	}

	@Override
	public List<InquilinoResponseDTO> listarAtivos() {
		var inquilinosAtivos = inquilinoRepository.listaInquilinosAtivos();
		return inquilinoMapper.toListInquilinoResponse(inquilinosAtivos);
	}

	@Override
	public @NonNull InquilinoResponseDTO buscarOuFalhar(@NonNull Long idInquilino) {
		return inquilinoMapper.toInquilinoResponse(inquilinoRepository.findById(idInquilino).orElseThrow(() -> new InquilinoNaoEncontadoException(idInquilino)));
	}

	@Transactional
	@Override
	public @NonNull InquilinoResponseDTO salvar(@NonNull InquilinoPostDTO inquilinoPostDTO) {
		var inquilino = inquilinoMapper.toInquilino(inquilinoPostDTO);
		var inquilinoSalvo = inquilinoRepository.save(inquilino);
		return inquilinoMapper.toInquilinoResponse(inquilinoSalvo);
	}
	
	@Transactional
	@Override
	public void excluir(@NonNull Long idInquilino) {
		try {
			inquilinoRepository.deleteById(idInquilino);
			inquilinoRepository.flush();
		} catch (EmptyResultDataAccessException e) {
			throw new PredioNaoEncontadoException(idInquilino);
		} catch (DataIntegrityViolationException e) {
			throw new EntidadeEmUsoException(String.format(InquilinoMessages.MSG_INQUILINO_EM_USO, idInquilino));
		}
	}
	
	@Transactional
	@Override
	public @NonNull InquilinoResponseDTO atualizar(@NonNull Long idInquilino, @NonNull InquilinoPutDTO inquilinoPutDTO) {
		var inquilino = inquilinoMapper.toInquilino(inquilinoPutDTO);
		var inquilinoSalva = this.inquilinoRepository.findById(idInquilino)
				.orElseThrow(() -> new EmptyResultDataAccessException(1));
		BeanUtils.copyProperties(inquilino, inquilinoSalva, "id");
		return inquilinoMapper.toInquilinoResponse(this.inquilinoRepository.save(inquilinoSalva));
	}
	
}
