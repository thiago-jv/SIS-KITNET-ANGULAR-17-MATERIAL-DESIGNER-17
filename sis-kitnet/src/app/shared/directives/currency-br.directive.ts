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
  private isFormatting = false;
  
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
    // Não formatar enquanto o usuário digita para evitar saltos do cursor.
    // Apenas garante que o valor visível contenha somente dígitos (keypress/keydown já
    // bloqueiam caracteres inválidos). Deixa a formatação para o evento blur.
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
      return;
    }
    // Ao desfocar, decide como interpretar o valor:
    // - se o usuário digitou uma vírgula/ponto, trata os dois últimos dígitos como centavos
    // - se digitou apenas dígitos, interpreta como reais inteiros e adiciona ,00
    const raw = input.value.trim();

    // Normaliza separadores para verificar se usuário usou decimal
    const temSeparadorDecimal = /[,\.]/.test(raw);

    let valorFormatado = '';

    if (temSeparadorDecimal) {
      const apenasNumeros = this.extrairApenasNumeros(raw);
      if (!apenasNumeros) {
        input.value = '';
        return;
      }
      valorFormatado = this.formatarParaMoeda(apenasNumeros);
    } else {
      const apenasNumeros = this.extrairApenasNumeros(raw);
      if (!apenasNumeros) {
        input.value = '';
        return;
      }
      valorFormatado = this.formatarInteiroParaMoeda(apenasNumeros);
    }

    input.value = valorFormatado;

    // Sincroniza com Angular forms
    setTimeout(() => {
      const evt = new Event('input', { bubbles: true });
      input.dispatchEvent(evt);
    }, 0);
  }

  /**
   * Permite colar valores e formata automaticamente
   */
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();

    const textoPastado = event.clipboardData?.getData('text') || '';
    const input = this.el.nativeElement;
    const temSeparadorDecimal = /[,\.]/.test(textoPastado);
    const apenasNumeros = this.extrairApenasNumeros(textoPastado);

    if (!apenasNumeros) {
      return;
    }

    if (temSeparadorDecimal) {
      // Ex.: '250,50' -> '250,50'
      input.value = this.formatarParaMoeda(apenasNumeros);
    } else {
      // Ex.: '250' -> '250,00'
      input.value = this.formatarInteiroParaMoeda(apenasNumeros);
    }

    setTimeout(() => {
      const eventoInput = new Event('input', { bubbles: true });
      input.dispatchEvent(eventoInput);
    }, 0);
  }

  /**
   * Formata números inteiros como moeda (sem inferir centavos).
   * Ex.: "250" -> "250,00"; "1234" -> "1.234,00"
   */
  private formatarInteiroParaMoeda(numeros: string): string {
    if (!numeros) {
      return '0,00';
    }

    const inteirosFormatados = numeros.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${inteirosFormatados},00`;
  }

  ngAfterViewInit(): void {
    // Se já houver valor no input (ex: edição), formata ao inicializar
    const input = this.el.nativeElement as HTMLInputElement;
    if (input && input.value) {
      const apenasNumeros = this.extrairApenasNumeros(input.value);
      if (apenasNumeros) {
        input.value = this.formatarParaMoeda(apenasNumeros);
      }
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
    // Deprecated: use posicionarCursorPorDigitos instead
    const posicao = valorFormatado.length - 3;
    setTimeout(() => {
      input.setSelectionRange(posicao, posicao);
    }, 0);
  }

  /**
   * Posiciona o cursor baseado na quantidade de dígitos que estavam antes
   * do caret (preserva o ponto de inserção mesmo com separadores).
   */
  private posicionarCursorPorDigitos(input: HTMLInputElement, valorFormatado: string, digitsBeforeCursor: number): void {
    if (digitsBeforeCursor <= 0) {
      input.setSelectionRange(0, 0);
      return;
    }

    let digitsSeen = 0;
    let targetPos = 0;

    for (let i = 0; i < valorFormatado.length; i++) {
      if (/\d/.test(valorFormatado.charAt(i))) {
        digitsSeen++;
      }

      if (digitsSeen >= digitsBeforeCursor) {
        targetPos = i + 1;
        break;
      }
    }

    // If we didn't reach the desired count, place at end
    if (digitsSeen < digitsBeforeCursor) {
      targetPos = valorFormatado.length;
    }

    try {
      input.setSelectionRange(targetPos, targetPos);
    } catch (e) {
      // ignore if not focusable
    }
  }
}


