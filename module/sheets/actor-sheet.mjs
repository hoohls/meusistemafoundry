/**
 * Ficha de Ator customizada para o Sistema Clube dos Taberneiros
 */
export class ClubeActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["clube-dos-taberneiros-foundry", "sheet", "actor"],
      width: 720,
      height: 680,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "principal" }],
      scrollY: [".biografia", ".items", ".magias"]
    });
  }

  /** @override */
  get template() {
    const path = "systems/clube-dos-taberneiros-foundry/templates/actor";
    
    // Usar template corrigido 
    return `${path}/personagem-sheet-fixed.hbs`;
  }

  /** @override */
  async getData() {
    const context = super.getData();
    const actorData = this.actor.toObject(false);
    
    // Adicionar dados do sistema
    context.system = actorData.system;
    context.flags = actorData.flags;
    
    // Garantir que estrutura básica existe para evitar erros
    if (!context.system.atributos) {
      context.system.atributos = {
        fisico: { valor: 3 },
        acao: { valor: 3 },
        mental: { valor: 3 },
        social: { valor: 3 }
      };
    }
    
    if (!context.system.recursos) {
      context.system.recursos = {
        pv: { valor: 19, max: 19 },
        pm: { valor: 11, max: 11 },
        defesa: { valor: 13 }
      };
    }

    if (!context.system.condicoes) {
      context.system.condicoes = {
        ferido: false,
        gravemente_ferido: false,
        inconsciente: false,
        caido: false,
        atordoado: false,
        cego: false,
        surdo: false
      };
    }

    if (!context.system.detalhes) {
      context.system.detalhes = {
        biografia: "",
        aparencia: "",
        personalidade: "",
        historia: "",
        motivacoes: "",
        notas: ""
      };
    }

    if (!context.system.experiencia) {
      context.system.experiencia = {
        atual: 0,
        necessaria: 10
      };
    }

    if (!context.system.raca) {
      context.system.raca = { nome: "" };
    }

    if (!context.system.classe) {
      context.system.classe = { nome: "" };
    }

    if (!context.system.nivel) {
      context.system.nivel = 1;
    }

    // Configurações do sistema
    context.config = CONFIG.clube || {};
    
    return context;
  }

  /**
   * Prepara dados específicos para personagens
   * @param {Object} context - Contexto da ficha
   * @returns {Object} Contexto atualizado
   */
  async _getPersonagemData(context) {
    const system = context.system;
    
    // Tabela de progressão de XP
    const tabelaXP = [0, 10, 25, 45, 70, 100, 135, 175, 220, 270];
    context.proximoNivel = tabelaXP[system.nivel] || (system.nivel * 50);
    
    // Porcentagem de XP para o próximo nível
    const xpAtual = system.experiencia.atual;
    const xpAnterior = tabelaXP[system.nivel - 1] || 0;
    const xpProximo = context.proximoNivel;
    context.porcentagemXP = Math.round(((xpAtual - xpAnterior) / (xpProximo - xpAnterior)) * 100);

    // Status de condições
    context.condicoesAtivas = Object.keys(system.condicoes)
      .filter(condicao => system.condicoes[condicao]);

    // Modificadores de condições
    context.modificadoresCondicoes = this._calcularModificadoresCondicoes(system.condicoes);

    return context;
  }

  /**
   * Calcula modificadores aplicados por condições
   * @param {Object} condicoes - Condições do personagem
   * @returns {Object} Modificadores
   */
  _calcularModificadoresCondicoes(condicoes) {
    let modificadores = {
      ataques: 0,
      defesa: 0,
      testes: 0,
      movimento: 0
    };

    if (condicoes.ferido) {
      modificadores.testes -= 1;
    }

    if (condicoes.gravemente_ferido) {
      modificadores.testes -= 2;
    }

    if (condicoes.caido) {
      modificadores.defesa -= 2;
      modificadores.movimento = Math.floor(modificadores.movimento / 2);
    }

    if (condicoes.cego) {
      modificadores.ataques -= 3;
    }

    if (condicoes.atordoado) {
      // Perde próxima ação - implementado no combat tracker
    }

    return modificadores;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Tudo abaixo só funciona se a ficha é editável
    if (!this.isEditable) return;

    // Adicionar eventos de clique para botões de ação
    html.find(".rolar-atributo").click(this._onRolarAtributo.bind(this));
    html.find(".atacar").click(this._onAtacar.bind(this));
    html.find(".conjurar-magia").click(this._onConjurarMagia.bind(this));
    html.find(".usar-habilidade").click(this._onUsarHabilidade.bind(this));
    html.find(".usar-item").click(this._onUsarItem.bind(this));

    // Equipar/desequipar itens
    html.find(".equipar-item").click(this._onEquiparItem.bind(this));
    html.find(".desequipar-item").click(this._onDesequiparItem.bind(this));

    // Gerenciar condições
    html.find(".toggle-condicao").click(this._onToggleCondicao.bind(this));

    // Descanso
    html.find(".descanso-curto").click(this._onDescansoCurto.bind(this));
    html.find(".descanso-longo").click(this._onDescansoLongo.bind(this));

    // Editar atributos com clique
    html.find(".editar-atributo").click(this._onEditarAtributo.bind(this));

    // Gerenciar recursos (PV/PM)
    html.find(".ajustar-pv").click(this._onAjustarPV.bind(this));
    html.find(".ajustar-pm").click(this._onAjustarPM.bind(this));

    // Arrastar e soltar itens
    html.find(".item-list .item").each((i, li) => {
      if (li.classList.contains("inventory-header")) return;
      li.setAttribute("draggable", true);
      li.addEventListener("dragstart", this._onDragStart.bind(this), false);
    });

    // Gerenciar itens
    html.find(".item-create").click(this._onItemCreate.bind(this));
    html.find(".item-edit").click(this._onItemEdit.bind(this));
    html.find(".item-delete").click(this._onItemDelete.bind(this));

    // Tooltips para itens
    html.find("[data-tooltip]").hover(this._onShowTooltip.bind(this), this._onHideTooltip.bind(this));
  }

  /**
   * Rola um teste de atributo
   * @param {Event} event - Evento de clique
   */
  async _onRolarAtributo(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const atributo = element.dataset.atributo;
    const nd = parseInt(element.dataset.nd) || 9;

    // Abrir dialog para modificadores se Shift foi pressionado
    if (event.shiftKey) {
      return this._abrirDialogTeste(atributo, nd);
    }

    // Teste direto
    await this.actor.rolarTeste(atributo, nd);
  }

  /**
   * Abre dialog personalizado para testes
   * @param {string} atributo - Nome do atributo
   * @param {number} nd - Número de Dificuldade padrão
   */
  async _abrirDialogTeste(atributo, nd) {
    const dialog = new Dialog({
      title: `Teste de ${game.i18n.localize(`ATRIBUTOS.${atributo.toUpperCase()}`)}`,
      content: `
        <form>
          <div class="form-group">
            <label>Dificuldade:</label>
            <select name="nd">
              <option value="5">Trivial (ND 5)</option>
              <option value="7">Fácil (ND 7)</option>
              <option value="9" ${nd === 9 ? 'selected' : ''}>Moderada (ND 9)</option>
              <option value="11">Difícil (ND 11)</option>
              <option value="13">Muito Difícil (ND 13)</option>
              <option value="15">Heroica (ND 15)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Modificador:</label>
            <input type="number" name="modificador" value="0" />
          </div>
          <div class="form-group">
            <label>Nome do teste:</label>
            <input type="text" name="nome" value="" placeholder="Opcional" />
          </div>
        </form>
      `,
      buttons: {
        roll: {
          icon: '<i class="fas fa-dice-d6"></i>',
          label: "Rolar",
          callback: async (html) => {
            const formData = new FormData(html[0].querySelector("form"));
            const ndFinal = parseInt(formData.get("nd"));
            const modificador = parseInt(formData.get("modificador")) || 0;
            const nome = formData.get("nome") || null;
            
            await this.actor.rolarTeste(atributo, ndFinal, modificador, nome);
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: "Cancelar"
        }
      },
      default: "roll"
    });

    dialog.render(true);
  }

  /**
   * Realiza um ataque
   * @param {Event} event - Evento de clique
   */
  async _onAtacar(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = element.closest(".item").dataset.itemId;
    const arma = this.actor.items.get(itemId);

    await this.actor.atacar(arma);
  }

  /**
   * Conjura uma magia
   * @param {Event} event - Evento de clique
   */
  async _onConjurarMagia(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = element.closest(".item").dataset.itemId;
    const magia = this.actor.items.get(itemId);

    await this.actor.conjurarMagia(magia);
  }

  /**
   * Usa uma habilidade
   * @param {Event} event - Evento de clique
   */
  async _onUsarHabilidade(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = element.closest(".item").dataset.itemId;
    const habilidade = this.actor.items.get(itemId);

    await habilidade.usar(this.actor);
  }

  /**
   * Usa um item consumível
   * @param {Event} event - Evento de clique
   */
  async _onUsarItem(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = element.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemId);

    await item.usar(this.actor);
  }

  /**
   * Equipa um item
   * @param {Event} event - Evento de clique
   */
  async _onEquiparItem(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = element.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemId);

    await this.actor.equiparItem(item);
  }

  /**
   * Desequipa um item
   * @param {Event} event - Evento de clique
   */
  async _onDesequiparItem(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = element.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemId);

    await this.actor.desequiparItem(item);
  }

  /**
   * Alterna uma condição
   * @param {Event} event - Evento de clique
   */
  async _onToggleCondicao(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const condicao = element.dataset.condicao;
    const ativo = !this.actor.system.condicoes[condicao];

    await this.actor.alterarCondicao(condicao, ativo);
  }

  /**
   * Realiza descanso curto
   * @param {Event} event - Evento de clique
   */
  async _onDescansoCurto(event) {
    event.preventDefault();
    
    const pvAtual = this.actor.system.recursos.pv.valor;
    const cura = Math.max(1, pvAtual + 1); // Recupera 1 PV mínimo
    
    await this.actor.curar(1);
    await this.actor.recuperarPM(1);
    
    ui.notifications.info("Descanso curto realizado: +1 PV e +1 PM");
  }

  /**
   * Realiza descanso longo
   * @param {Event} event - Evento de clique
   */
  async _onDescansoLongo(event) {
    event.preventDefault();
    
    const sistema = this.actor.system;
    const curaFisico = sistema.atributos.fisico.valor;
    const pmCompleto = sistema.recursos.pm.max;
    
    await this.actor.curar(curaFisico);
    await this.actor.update({"system.recursos.pm.valor": pmCompleto});
    
    // Remover condições temporárias
    const updateData = {};
    Object.keys(sistema.condicoes).forEach(condicao => {
      if (condicao !== "inconsciente") {
        updateData[`system.condicoes.${condicao}`] = false;
      }
    });
    
    if (Object.keys(updateData).length > 0) {
      await this.actor.update(updateData);
    }
    
    ui.notifications.info(`Descanso longo realizado: +${curaFisico} PV, PM completo, condições removidas`);
  }

  /**
   * Edita um atributo
   * @param {Event} event - Evento de clique
   */
  async _onEditarAtributo(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const atributo = element.dataset.atributo;
    const valorAtual = this.actor.system.atributos[atributo].valor;

    const novoValor = await new Promise((resolve) => {
      new Dialog({
        title: `Editar ${game.i18n.localize(`ATRIBUTOS.${atributo.toUpperCase()}`)}`,
        content: `
          <form>
            <div class="form-group">
              <label>Novo valor:</label>
              <input type="number" name="valor" value="${valorAtual}" min="3" max="18" />
            </div>
          </form>
        `,
        buttons: {
          save: {
            icon: '<i class="fas fa-save"></i>',
            label: "Salvar",
            callback: (html) => {
              const formData = new FormData(html[0].querySelector("form"));
              resolve(parseInt(formData.get("valor")));
            }
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: "Cancelar",
            callback: () => resolve(null)
          }
        },
        default: "save"
      }).render(true);
    });

    if (novoValor !== null && novoValor !== valorAtual) {
      await this.actor.update({[`system.atributos.${atributo}.valor`]: novoValor});
    }
  }

  /**
   * Ajusta PV
   * @param {Event} event - Evento de clique
   */
  async _onAjustarPV(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const operacao = element.dataset.operacao; // "adicionar" ou "remover"
    
    const valor = await this._promptValor("Ajustar PV", "Quantidade:");
    if (valor === null) return;
    
    if (operacao === "adicionar") {
      await this.actor.curar(valor);
    } else {
      await this.actor.aplicarDano(valor);
    }
  }

  /**
   * Ajusta PM
   * @param {Event} event - Evento de clique
   */
  async _onAjustarPM(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const operacao = element.dataset.operacao; // "adicionar" ou "remover"
    
    const valor = await this._promptValor("Ajustar PM", "Quantidade:");
    if (valor === null) return;
    
    if (operacao === "adicionar") {
      await this.actor.recuperarPM(valor);
    } else {
      await this.actor.gastarPM(valor);
    }
  }

  /**
   * Prompt para entrada de valor numérico
   * @param {string} titulo - Título do dialog
   * @param {string} label - Label do campo
   * @returns {Promise<number|null>} Valor inserido ou null se cancelado
   */
  async _promptValor(titulo, label) {
    return new Promise((resolve) => {
      new Dialog({
        title: titulo,
        content: `
          <form>
            <div class="form-group">
              <label>${label}</label>
              <input type="number" name="valor" value="1" min="0" />
            </div>
          </form>
        `,
        buttons: {
          ok: {
            icon: '<i class="fas fa-check"></i>',
            label: "OK",
            callback: (html) => {
              const formData = new FormData(html[0].querySelector("form"));
              resolve(parseInt(formData.get("valor")) || 0);
            }
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: "Cancelar",
            callback: () => resolve(null)
          }
        },
        default: "ok"
      }).render(true);
    });
  }

  /**
   * Mostra tooltip para item
   * @param {Event} event - Evento de hover
   */
  _onShowTooltip(event) {
    const element = event.currentTarget;
    const itemId = element.dataset.itemId;
    
    if (!itemId) return;
    
    const item = this.actor.items.get(itemId);
    if (!item) return;
    
    const tooltip = item.getTooltip();
    
    // Criar e posicionar tooltip
    const tooltipElement = document.createElement("div");
    tooltipElement.className = "clube-tooltip";
    tooltipElement.innerHTML = tooltip;
    document.body.appendChild(tooltipElement);
    
    // Posicionar próximo ao mouse
    const rect = element.getBoundingClientRect();
    tooltipElement.style.left = `${rect.right + 10}px`;
    tooltipElement.style.top = `${rect.top}px`;
  }

  /**
   * Esconde tooltip
   * @param {Event} event - Evento de hover out
   */
  _onHideTooltip(event) {
    const tooltips = document.querySelectorAll(".clube-tooltip");
    tooltips.forEach(tooltip => tooltip.remove());
  }

  /**
   * Cria um novo item
   * @param {Event} event - Evento de clique
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const type = element.dataset.type;
    
    const itemData = {
      name: `Novo ${game.i18n.localize(`EQUIPAMENTOS.${type.toUpperCase()}`)}`,
      type: type,
      system: {}
    };
    
    await this.actor.createEmbeddedDocuments("Item", [itemData]);
  }

  /**
   * Edita um item
   * @param {Event} event - Evento de clique
   */
  _onItemEdit(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = element.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemId);
    
    item.sheet.render(true);
  }

  /**
   * Deleta um item
   * @param {Event} event - Evento de clique
   */
  async _onItemDelete(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = element.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemId);
    
    const confirm = await Dialog.confirm({
      title: "Excluir Item",
      content: `<p>Tem certeza que deseja excluir <strong>${item.name}</strong>?</p>`,
      yes: () => true,
      no: () => false
    });
    
    if (confirm) {
      await item.delete();
    }
  }
} 