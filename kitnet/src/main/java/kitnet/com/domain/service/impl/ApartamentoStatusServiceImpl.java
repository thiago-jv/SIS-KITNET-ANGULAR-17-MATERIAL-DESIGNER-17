package kitnet.com.domain.service.impl;

import kitnet.com.domain.model.Apartamento;
import kitnet.com.domain.repository.ApartamentoRepository;
import kitnet.com.domain.service.ApartamentoService;
import kitnet.com.domain.service.ApartamentoStatusService;
import kitnet.com.infra.utils.Constantes;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementação do serviço de gerenciamento de status de apartamentos.
 * 
 * Aplica Single Responsibility Principle (SRP): 
 * - Responsabilidade única: gerenciar transições de status de apartamentos
 * - Não se preocupa com validações, cálculos ou outras regras de negócio
 * 
 * Aplica Dependency Inversion Principle (DIP):
 * - Depende de abstrações (ApartamentoService interface, ApartamentoRepository interface)
 * - Não depende de implementações concretas
 */
@Service
@RequiredArgsConstructor
public class ApartamentoStatusServiceImpl implements ApartamentoStatusService {

    private final ApartamentoRepository apartamentoRepository;
    private final ApartamentoService apartamentoService;

    @Override
    @Transactional
    public Apartamento marcarComoOcupado(Apartamento apartamento) {
        apartamento.setStatusApartamento(Constantes.OCUPADO);
        return apartamentoRepository.save(apartamento);
    }

    @Override
    @Transactional
    public Apartamento marcarComoDisponivel(Apartamento apartamento) {
        apartamento.setStatusApartamento(Constantes.DISPONIVEL);
        return apartamentoRepository.save(apartamento);
    }

    @Override
    @Transactional
    public Apartamento marcarComoDisponivelPorId(Long idApartamento) {
        Apartamento apartamento = apartamentoService.buscarOuFalhar(idApartamento);
        return marcarComoDisponivel(apartamento);
    }

    @Override
    @Transactional
    public Apartamento alternarStatus(Apartamento apartamento, boolean statusControleAtivo) {
        if (statusControleAtivo) {
            return marcarComoOcupado(apartamento);
        } else {
            return marcarComoDisponivel(apartamento);
        }
    }
}
