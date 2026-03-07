import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  private snack = inject(MatSnackBar);

  /**
   * Exibe erro no snackbar e registra no console
   * @param error - Objeto de erro capturado
   * @param context - Contexto opcional para logging (ex: 'Carregar dados', 'Excluir registro')
   */
  exibirErro(error: any, context?: string): void {
    const mensagem = this.obterMensagemErro(error);
    
    if (context) {
      console.error(`Erro ao ${context}:`, error);
    } else {
      console.error('Erro:', error);
    }
    
    this.snack.open(mensagem, 'Fechar', {
      duration: 8000,
      panelClass: ['snackbar-error'],
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }

  /**
   * Exibe mensagem de sucesso no snackbar
   * @param mensagem - Mensagem de sucesso
   * @param duracao - Duração em ms (padrão 3000)
   */
  exibirSucesso(mensagem: string, duracao: number = 3000): void {
    this.snack.open(mensagem, 'Fechar', {
      duration: duracao,
      panelClass: ['snackbar-success'],
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }

  /**
   * Extrai mensagem de erro de múltiplas estruturas de resposta
   * @param error - Objeto de erro do HTTP
   * @returns String com a mensagem de erro formatada
   */
  private obterMensagemErro(error: any): string {
    // Se o error.error for uma string (texto direto)
    if (typeof error?.error === 'string') {
      return error.error;
    }
    
    // Se houver message dentro de error.error
    if (error?.error?.message) {
      return error.error.message;
    }

    // Se houver title (usado em alguns padrões de erro)
    if (error?.error?.title) {
      return error.error.title;
    }
    
    // Se houver array de errors
    if (error?.error?.errors && Array.isArray(error.error.errors) && error.error.errors.length > 0) {
      const primeiroErro = error.error.errors[0];
      if (typeof primeiroErro === 'string') {
        return primeiroErro;
      }
      return primeiroErro?.message || 'Erro ao processar sua solicitação';
    }
    
    // Se houver detail (comum em respostas de erro)
    if (error?.error?.detail) {
      return error.error.detail;
    }

    // Se houver error (campo comum em APIs REST)
    if (error?.error?.error && typeof error.error.error === 'string') {
      return error.error.error;
    }
    
    // Se houver error message direto
    if (error?.message) {
      return error.message;
    }
    
    // Tratamento baseado em status HTTP
    if (error?.status === 404) {
      return 'Recurso não encontrado';
    }
    if (error?.status === 400) {
      return 'Dados inválidos. Verifique os campos preenchidos';
    }
    if (error?.status === 403) {
      return 'Você não tem permissão para realizar esta ação';
    }
    if (error?.status === 409) {
      return 'Conflito ao processar a operação. Verifique o estado do registro';
    }
    if (error?.status === 500) {
      return 'Erro no servidor. Tente novamente mais tarde';
    }
    
    if (error?.statusText) {
      return `Erro: ${error.statusText}`;
    }
    
    return 'Erro ao processar sua solicitação. Por favor, tente novamente mais tarde';
  }
}
