import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';

/**
 * Diretiva para formatação de valores monetários no padrão brasileiro
 * 
 * Uso: <input appCurrencyBr />
 * 
 * Funcionalidades:
 * - Aceita apenas números (0-9)
 * - Formata automaticamente como 1.234,56
 * - Posiciona o cursor corretamente durante digitação
 * - Suporta operações de cópia/cola
 */
@Directive({
  selector: '[appCurrencyBr]',
  standalone: true
})
export class CurrencyBrDirective implements OnInit {
  
  constructor(private el: ElementRef<HTMLInputElement>) {}

  ngOnInit() {
    this.configurarInput();
  }

  /**
   * Configura as propriedades iniciais do input
   */
  private configurarInput(): void {
    this.el.nativeElement.placeholder = '0,00';
    this.el.nativeElement.inputMode = 'decimal';
  }

  /**
   * Bloqueia entrada de caracteres não numéricos no evento keypress
   */
  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent): boolean {
    const caractere = String.fromCharCode(event.which);
    const ehNumero = /^[0-9]$/.test(caractere);

    if (!ehNumero) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  /**
   * Gerencia as teclas especiais (Backspace, Delete, navegação, etc)
   * e bloqueia tentativas de colar caracteres inválidos
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): boolean {
    const teclaPermitida = this.ehTeclaPermitida(event.key);
    const atalhoDeControle = this.ehAtalhoValido(event);
    const ehNumero = /^[0-9]$/.test(event.key);

    if (!teclaPermitida && !atalhoDeControle && !ehNumero) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  /**
  * Formata o valor para padrão brasileiro (X.XXX,XX)
   */
  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const apenasNumeros = this.extrairApenasNumeros(input.value);

    if (apenasNumeros.length === 0) {
      input.value = '';
      return;
    }

    const valorFormatado = this.formatarParaMoeda(apenasNumeros);
    input.value = valorFormatado;
    
    this.posicionarCursorCorretamente(input, valorFormatado);
  }

  /**
   * Limpa o input se ficar vazio ao desfocar
   */
  @HostListener('blur', ['$event'])
  onBlur(event: Event): void {
    const input = event.target as HTMLInputElement;
    const estaVazio = !input.value;

    if (estaVazio) {
      input.value = '';
    }
  }

  /**
   * Permite colar valores e formata automaticamente
   */
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    
    const textoPastado = event.clipboardData?.getData('text') || '';
    const apenasNumeros = this.extrairApenasNumeros(textoPastado);

    if (apenasNumeros) {
      const input = this.el.nativeElement;
      input.value = apenasNumeros;
      
      // Dispara evento input para aplicar formatação
      const eventoInput = new Event('input', { bubbles: true });
      input.dispatchEvent(eventoInput);
    }
  }

  /**
   * Verifica se a tecla é uma tecla especial permitida
   */
  private ehTeclaPermitida(tecla: string): boolean {
    const teclas_especiais = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'Home', 'End'
    ];
    return teclas_especiais.includes(tecla);
  }

  /**
   * Verifica se é um atalho válido (Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X)
   */
  private ehAtalhoValido(evento: KeyboardEvent): boolean {
    const atalhos_validos = ['a', 'c', 'v', 'x'];
    const temControle = evento.ctrlKey || evento.metaKey;
    const ehAtalho = atalhos_validos.includes(evento.key.toLowerCase());
    
    return temControle && ehAtalho;
  }

  /**
   * Remove todos os caracteres que não são dígitos
   */
  private extrairApenasNumeros(texto: string): string {
    return texto.replace(/\D/g, '');
  }

  /**
   * Formata uma string de números como moeda brasileira
  * Exemplo: "123456" → "1.234,56"
   */
  private formatarParaMoeda(numeros: string): string {
    let valor = numeros;

    // Garante que tenha pelo menos 3 dígitos (dois para centavos)
    while (valor.length < 3) {
      valor = '0' + valor;
    }

    // Separa inteiros dos centavos
    const inteiros = valor.slice(0, -2) || '0';
    const centavos = valor.slice(-2);

    // Formata os milhares com ponto (1.234)
    const inteirosFormatados = inteiros.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${inteirosFormatados},${centavos}`;
  }

  /**
   * Posiciona o cursor no lugar correto após a formatação
   * Mantém o cursor antes dos centavos para digitação contínua
   */
  private posicionarCursorCorretamente(input: HTMLInputElement, valorFormatado: string): void {
    // Cursor fica 3 caracteres antes do final (antes de ",XX")
    const posicao = valorFormatado.length - 3;
    
    setTimeout(() => {
      input.setSelectionRange(posicao, posicao);
    }, 0);
  }
}


