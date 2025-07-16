/**
 * Dialog customizado para rolagem de dados no Sistema Clube dos Taberneiros
 */
export class ClubeRollerDialog extends Dialog {

  constructor(data = {}, options = {}) {
    super(data, options);
    
    this.atributo = data.atributo || "fisico";
    this.valor = data.valor || 3;
    this.nd = data.nd || 9;
    this.modificador = data.modificador || 0;
    this.nome = data.nome || "Teste";
    this.ator = data.ator || null;
  }

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["clube-dos-taberneiros", "dialog", "roller"],
      width: 400,
      height: 320,
      title: "Rolagem de Dados"
    });
  }

  /** @override */
  get template() {
    // TODO: Criar template específico para o roller dialog
    return "templates/apps/dialog.html";
  }

  /** @override */
  getData() {
    const data = super.getData();
    
    data.atributo = this.atributo;
    data.valor = this.valor;
    data.nd = this.nd;
    data.modificador = this.modificador;
    data.nome = this.nome;
    
    data.atributos = CONFIG.clube.atributos;
    data.dificuldades = CONFIG.clube.dificuldades;
    
    return data;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    
    html.find("#atributo").change(this._onAtributoChange.bind(this));
    html.find("#nd").change(this._onNdChange.bind(this));
    html.find(".rolar-dados").click(this._onRolarDados.bind(this));
  }

  /**
   * Atualiza valor do atributo quando seleção muda
   */
  _onAtributoChange(event) {
    const novoAtributo = event.target.value;
    this.atributo = novoAtributo;
    
    if (this.ator) {
      const novoValor = this.ator.system.atributos[novoAtributo]?.valor || 3;
      this.valor = novoValor;
      this.element.find("#valor").val(novoValor);
    }
  }

  /**
   * Atualiza descrição da dificuldade
   */
  _onNdChange(event) {
    const nd = parseInt(event.target.value);
    const descricao = CONFIG.clube.dificuldades[nd];
    
    if (descricao) {
      this.element.find(".dificuldade-desc").text(game.i18n.localize(descricao));
    }
  }

  /**
   * Executa a rolagem dos dados
   */
  async _onRolarDados(event) {
    event.preventDefault();
    
    const formData = new FormData(this.element[0].querySelector("form"));
    
    const dadosRolagem = {
      atributo: formData.get("atributo"),
      valor: parseInt(formData.get("valor")),
      nd: parseInt(formData.get("nd")),
      modificador: parseInt(formData.get("modificador")) || 0,
      nome: formData.get("nome") || "Teste Personalizado",
      ator: this.ator
    };

    // Executar rolagem usando função global
    await window.clube.executarTeste(dadosRolagem);
    
    // Fechar dialog
    this.close();
  }

  /**
   * Método estático para criar e exibir o dialog
   */
  static async show(options = {}) {
    const dialog = new ClubeRollerDialog({
      title: "Rolagem de Dados - Sistema Clube dos Taberneiros",
      content: `<p>Dialog de rolagem em desenvolvimento...</p>`, // TODO: Usar template próprio
      buttons: {
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: "Cancelar"
        }
      },
      default: "cancel",
      ...options
    });

    dialog.render(true);
    return dialog;
  }
} 