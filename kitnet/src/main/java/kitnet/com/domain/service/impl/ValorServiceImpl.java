package kitnet.com.domain.service.impl;

import kitnet.com.api.dto.valor.ValorFilterDTO;
import kitnet.com.api.dto.valor.ValorPostDTO;
import kitnet.com.api.dto.valor.ValorPutDTO;
import kitnet.com.api.dto.valor.ValorResponseDTO;
import kitnet.com.api.handler.EntidadeEmUsoException;
import kitnet.com.api.handler.ValorNaoEncontadoException;
import kitnet.com.api.mapper.ValorMapper;
import kitnet.com.domain.model.Valor;
import kitnet.com.domain.repository.ValorRepository;
import kitnet.com.domain.service.ValorService;
import org.springframework.lang.NonNull;
import kitnet.com.infra.utils.ValorMessages;
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
public class ValorServiceImpl implements ValorService {

	@Autowired
	private ValorRepository valorRepository;

	@Autowired
	private ValorMapper valorMapper;

	@Override
	public @NonNull List<ValorResponseDTO> listarTodos() {
		List<Valor> valores = valorRepository.listaValores();
		return valorMapper.toListValorResponse(valores == null ? List.of() : valores);
	}

	@Transactional
	@Override
	public @NonNull ValorResponseDTO salvar(@NonNull ValorPostDTO valorPostDTO) {
		var valor = valorMapper.toValor(valorPostDTO);
		var valorSalvo = valorRepository.save(valor);
		return valorMapper.toValorResponse(valorSalvo);
	}

	@Override
	public @NonNull ValorResponseDTO buscarOuFalhar(@NonNull Long idValor) {
		var valor = valorRepository.findById(idValor).orElseThrow(() -> new ValorNaoEncontadoException(idValor));
		return valorMapper.toValorResponse(valor);
	}
	
	@Transactional
	@Override
	public void excluir(@NonNull Long idValor) {
		try {
			valorRepository.deleteById(idValor);
			valorRepository.flush();
		} catch (EmptyResultDataAccessException e) {
			throw new ValorNaoEncontadoException(idValor);
		} catch (DataIntegrityViolationException e) {
			throw new EntidadeEmUsoException(String.format(ValorMessages.MSG_VALOR_EM_USO, idValor));
		}
	}
	
	@Transactional
	@Override
	public @NonNull ValorResponseDTO atualizar(@NonNull Long idValor, @NonNull ValorPutDTO valorPutDTO) {
		var valor = valorMapper.toValor(valorPutDTO);
		var valorSalva = this.valorRepository.findById(idValor)
				.orElseThrow(() -> new EmptyResultDataAccessException(1));
		BeanUtils.copyProperties(valor, valorSalva, "id");
		var valorAtualizado = this.valorRepository.save(valorSalva);
		return valorMapper.toValorResponse(valorAtualizado);
	}

	@Override
	public Page<ValorResponseDTO> filtrar(ValorFilterDTO valorFilterDTO, Pageable pageable) {
		Page<Valor> valorPage = valorRepository.filtrar(valorFilterDTO, pageable);
		Page<ValorResponseDTO> valorResponse = valorMapper.toPageValorResponse(valorPage);
		return valorResponse;
	}
}

