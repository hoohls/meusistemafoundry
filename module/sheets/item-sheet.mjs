/**
 * Ficha de Item customizada para o Sistema Clube dos Taberneiros
 */
export class ClubeItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["clube-dos-taberneiros", "sheet", "item"],
      width: 520,
      height: 480,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "detalhes" }]
    });
  }

  /** @override */
  get template() {
    const path = "systems/clube-dos-taberneiros/templates/item";
    return `${path}/${this.item.type}-sheet.hbs`;
  }

  /** @override */
  async getData() {
    const context = super.getData();
    const itemData = this.item.toObject(false);
    
    context.system = itemData.system;
    context.flags = itemData.flags;
    context.config = CONFIG.clube;
    
    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    if (!this.isEditable) return;

    // Eventos específicos por tipo de item
    html.find(".item-teste").click(this._onTestarItem.bind(this));
    html.find(".adicionar-propriedade").click(this._onAdicionarPropriedade.bind(this));
    html.find(".remover-propriedade").click(this._onRemoverPropriedade.bind(this));
  }

  /**
   * Testa um item (arma, magia, etc.)
   */
  async _onTestarItem(event) {
    event.preventDefault();
    
    if (this.item.actor) {
      await this.item.usar(this.item.actor);
    } else {
      ui.notifications.warn("Item deve estar em um ator para ser testado");
    }
  }

  /**
   * Adiciona uma propriedade ao item
   */
  async _onAdicionarPropriedade(event) {
    event.preventDefault();
    // Implementar conforme necessário
  }

  /**
   * Remove uma propriedade do item
   */
  async _onRemoverPropriedade(event) {
    event.preventDefault();
    // Implementar conforme necessário
  }
} 