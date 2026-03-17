package kitnet.com.domain.service.impl;

import kitnet.com.domain.model.MovimentoFinanceiro;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import kitnet.com.api.dto.financeiro.MovimentoFinanceiroFilterDTO;

import kitnet.com.api.dto.financeiro.MovimentoFinanceiroPutDTO;
import kitnet.com.api.handler.MovimentoFinanceiroNaoEncontradoException;
import kitnet.com.infra.utils.MovimentoFinanceiroMessages;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.lang.NonNull;
import org.springframework.dao.EmptyResultDataAccessException;
import kitnet.com.api.handler.EntidadeEmUsoException;
import org.springframework.beans.BeanUtils;
import org.springframework.dao.DataIntegrityViolationException;
import kitnet.com.api.dto.financeiro.MovimentoFinanceiroPostDTO;
import kitnet.com.api.dto.financeiro.MovimentoFinanceiroResponseDTO;
import kitnet.com.api.mapper.MovimentoFinanceiroMapper;
import kitnet.com.domain.repository.MovimentoFinanceiroRepository;
import kitnet.com.domain.service.MovimentoFinanceiroService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovimentoFinanceiroServiceImpl implements MovimentoFinanceiroService {

    @Autowired
    private MovimentoFinanceiroRepository repository;

    @Autowired
    private MovimentoFinanceiroMapper mapper;

    @Transactional
    @Override
    public MovimentoFinanceiroResponseDTO criar(MovimentoFinanceiroPostDTO dto) {
        MovimentoFinanceiro entity = mapper.toMovimentoFinanceiro(dto);
        MovimentoFinanceiro salvo = repository.save(entity);

        return mapper.toMovimentoFinanceiroResponse(salvo);
    }

    @Override
    public List<MovimentoFinanceiroResponseDTO> listarTodosDTO() {
        var entities = repository.findAll();
        return mapper.toListMovimentoFinanceiroResponse(entities);
    }

    @Override
    public @NonNull MovimentoFinanceiroResponseDTO buscarPorIdDTO(@NonNull Long id) {
        var entity = repository.findById(id).orElseThrow(() -> new MovimentoFinanceiroNaoEncontradoException(id));
        return mapper.toMovimentoFinanceiroResponse(entity);
    }

    @Transactional
    public MovimentoFinanceiroResponseDTO atualizar(MovimentoFinanceiroPutDTO dto, Long id) {
        var entity = mapper.toMovimentoFinanceiro(dto);
        var entitySalvo = repository.findById(id).orElseThrow(() -> new MovimentoFinanceiroNaoEncontradoException(id));
        BeanUtils.copyProperties(entity, entitySalvo, "id");
        return mapper.toMovimentoFinanceiroResponse(repository.save(entitySalvo));
    }

    @Transactional
    public void remover(@NonNull Long id) {
        try {
            repository.deleteById(id);
            repository.flush();
        } catch (EmptyResultDataAccessException e) {
            throw new MovimentoFinanceiroNaoEncontradoException(id);
        } catch (DataIntegrityViolationException e) {
            throw new EntidadeEmUsoException(String.format(MovimentoFinanceiroMessages.MSG_MOVIMENTO_EM_USO, id));
        }
    }

    @Override
    public Page<MovimentoFinanceiroResponseDTO> filtrar(MovimentoFinanceiroFilterDTO filterDTO, Pageable pageable) {
        Page<MovimentoFinanceiro> movimentoFinanceiroPage = repository.filtrar(filterDTO, pageable);
        Page<MovimentoFinanceiroResponseDTO> movimentoFinanceiroPageResponse = mapper.toPageMovimentoFinanceiroResponse(movimentoFinanceiroPage);
        return movimentoFinanceiroPageResponse;
    }
}
