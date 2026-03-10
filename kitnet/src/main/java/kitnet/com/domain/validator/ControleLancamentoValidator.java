package kitnet.com.domain.validator;

import kitnet.com.api.handler.EntidadeEmUsoException;
import kitnet.com.domain.model.ControleLancamento;
import kitnet.com.domain.repository.ControleLancamentoRepository;
import kitnet.com.infra.utils.ControleMessages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ControleLancamentoValidator {

    @Autowired
    private ControleLancamentoRepository controleLancamentoRepository;

    public void validaInquilinoEApartamentoPorDataDeEntrada(ControleLancamento controleLancamento) {
        List<ControleLancamento> result = controleLancamentoRepository
                .listaControleLancamentosPorDataDeEntrada(
                        controleLancamento.getApartamento().getId(),
                        controleLancamento.getDataEntrada(),
                        controleLancamento.getDataPagamento());

        Long inquilinoIdAtual = controleLancamento.getInquilino() != null ? controleLancamento.getInquilino().getId() : null;

        boolean existeConflitoComOutroInquilino = result.stream().anyMatch(lancamentoExistente -> {
            if (lancamentoExistente.getInquilino() == null || lancamentoExistente.getInquilino().getId() == null) {
                return true;
            }
            return !lancamentoExistente.getInquilino().getId().equals(inquilinoIdAtual);
        });

        if (existeConflitoComOutroInquilino) {
            throw new EntidadeEmUsoException(
                    String.format(ControleMessages.MSG_CONTROLE_INQUILINO_OU_APARTAMENTO_EM_USO));
        }
    }
}
