package kitnet.com.domain.service;

import kitnet.com.domain.model.Apartamento;

/**
 * Centraliza toda lógica de transição de estados, aplicando princípio SRP (Single Responsibility Principle).
 */
public interface ApartamentoStatusService {

    /**
     * Marca apartamento como OCUPADO.
     * Usado quando um novo lançamento é criado ou status de controle é ativado.
     * 
     * @param apartamento Apartamento a ser marcado como ocupado
     * @return Apartamento com status atualizado
     */
    Apartamento marcarComoOcupado(Apartamento apartamento);

    /**
     * Marca apartamento como DISPONIVEL.
     * Usado quando um lançamento é excluído ou status de controle é desativado.
     * 
     * @param apartamento Apartamento a ser marcado como disponível
     * @return Apartamento com status atualizado
     */
    Apartamento marcarComoDisponivel(Apartamento apartamento);

    /**
     * Marca apartamento como DISPONIVEL através do ID.
     * 
     * @param idApartamento ID do apartamento
     * @return Apartamento com status atualizado
     */
    Apartamento marcarComoDisponivelPorId(Long idApartamento);

    /**
     * Alterna status do apartamento baseado em uma flag.
     * Se statusControleAtivo = true → OCUPADO
     * Se statusControleAtivo = false → DISPONIVEL
     * 
     * @param apartamento Apartamento a ter status alternado
     * @param statusControleAtivo Flag indicando se controle está ativo
     * @return Apartamento com status atualizado
     */
    Apartamento alternarStatus(Apartamento apartamento, boolean statusControleAtivo);
}
