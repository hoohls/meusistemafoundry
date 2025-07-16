/**
 * Extende a classe base Item para implementar as regras específicas do Sistema Clube dos Taberneiros
 */
export class ClubeItem extends Item {

  /** @override */
  prepareData() {
    super.prepareData();
    
    // Preparar dados específicos por tipo
    switch (this.type) {
      case "arma":
        this._prepareArmaData();
        break;
      case "armadura":
        this._prepareArmaduraData();
        break;
      case "escudo":
        this._prepareEscudoData();
        break;
      case "magia":
        this._prepareMagiaData();
        break;
      case "habilidade":
        this._prepareHabilidadeData();
        break;
      case "consumivel":
        this._prepareConsumivelData();
        break;
    }
  }

  /**
   * Prepara dados específicos para armas
   */
  _prepareArmaData() {
    const data = this.system;
    
    // Calcular dano total se necessário
    this._calcularDanoArma(data);
    
    // Verificar propriedades especiais
    this._verificarPropriedadesArma(data);
  }

  /**
   * Prepara dados específicos para armaduras
   */
  _prepareArmaduraData() {
    const data = this.system;
    
    // Calcular proteção efetiva
    this._calcularProtecaoArmadura(data);
  }

  /**
   * Prepara dados específicos para escudos
   */
  _prepareEscudoData() {
    const data = this.system;
    
    // Verificar propriedades do escudo
    this._verificarPropriedadesEscudo(data);
  }

  /**
   * Prepara dados específicos para magias
   */
  _prepareMagiaData() {
    const data = this.system;
    
    // Calcular ND de conjuração
    data.nd_conjuracao = 5 + data.nivel;
    
    // Verificar se pode ser conjurada
    this._verificarRequisitosConjuracao(data);
  }

  /**
   * Prepara dados específicos para habilidades
   */
  _prepareHabilidadeData() {
    const data = this.system;
    
    // Verificar se pode ser ativada
    this._verificarRequisitosHabilidade(data);
  }

  /**
   * Prepara dados específicos para consumíveis
   */
  _prepareConsumivelData() {
    const data = this.system;
    
    // Verificar usos restantes
    this._verificarUsosConsumivel(data);
  }

  /**
   * Calcula dano total de uma arma
   * @param {Object} data - Dados do sistema do item
   */
  _calcularDanoArma(data) {
    // O dano base já está definido no template
    // Aqui poderíamos adicionar modificadores mágicos ou especiais
    
    // Verificar se é arma mágica
    if (data.qualidade && data.qualidade !== "comum") {
      const bonus = this._getBonusMagico(data.qualidade);
      data.bonus_magico = bonus;
    }
  }

  /**
   * Verifica propriedades especiais de armas
   * @param {Object} data - Dados do sistema do item
   */
  _verificarPropriedadesArma(data) {
    // Preparar lista de propriedades ativas
    data.propriedades_ativas = Object.keys(data.propriedades || {})
      .filter(prop => data.propriedades[prop]);
  }

  /**
   * Calcula proteção efetiva de armadura
   * @param {Object} data - Dados do sistema do item
   */
  _calcularProtecaoArmadura(data) {
    // Verificar se é armadura mágica
    if (data.qualidade && data.qualidade !== "comum") {
      const bonus = this._getBonusMagico(data.qualidade);
      data.protecao_total = data.protecao + bonus;
      data.mod_defesa_total = data.mod_defesa + bonus;
    } else {
      data.protecao_total = data.protecao;
      data.mod_defesa_total = data.mod_defesa;
    }
  }

  /**
   * Verifica propriedades especiais de escudos
   * @param {Object} data - Dados do sistema do item
   */
  _verificarPropriedadesEscudo(data) {
    // Verificar se é escudo mágico
    if (data.qualidade && data.qualidade !== "comum") {
      const bonus = this._getBonusMagico(data.qualidade);
      data.protecao_total = data.protecao + bonus;
      data.mod_defesa_total = data.mod_defesa + bonus;
    } else {
      data.protecao_total = data.protecao;
      data.mod_defesa_total = data.mod_defesa;
    }
  }

  /**
   * Verifica requisitos para conjuração de magia
   * @param {Object} data - Dados do sistema do item
   */
  _verificarRequisitosConjuracao(data) {
    if (!this.actor) return;
    
    const atorData = this.actor.system;
    
    // Verificar PM suficientes
    data.pode_conjurar = atorData.recursos.pm.valor >= data.custo_pm;
    
    // Verificar nível mínimo
    if (data.nivel_minimo > atorData.nivel) {
      data.pode_conjurar = false;
    }
    
    // Verificar atributo Mental mínimo
    const mentalMinimo = Math.max(10 + data.nivel, data.nivel_minimo + 7);
    if (atorData.atributos.mental.valor < mentalMinimo) {
      data.pode_conjurar = false;
    }
  }

  /**
   * Verifica requisitos para uso de habilidade
   * @param {Object} data - Dados do sistema do item
   */
  _verificarRequisitosHabilidade(data) {
    if (!this.actor) return;
    
    const atorData = this.actor.system;
    
    // Verificar nível mínimo
    data.pode_usar = atorData.nivel >= data.nivel_minimo;
    
    // Verificar pré-requisitos de atributos
    if (data.prerequisitos && data.prerequisitos.atributos) {
      Object.keys(data.prerequisitos.atributos).forEach(attr => {
        const minimo = data.prerequisitos.atributos[attr];
        if (atorData.atributos[attr].valor < minimo) {
          data.pode_usar = false;
        }
      });
    }
    
    // Verificar usos restantes
    if (data.usos && data.usos.limitado) {
      data.pode_usar = data.pode_usar && data.usos.atual > 0;
    }
  }

  /**
   * Verifica usos de consumível
   * @param {Object} data - Dados do sistema do item
   */
  _verificarUsosConsumivel(data) {
    // Verificar se ainda tem usos
    data.pode_usar = data.usos.atual > 0;
    
    // Verificar limitações diárias/por combate
    if (data.limitacao) {
      // Implementar verificação de limitações se necessário
    }
  }

  /**
   * Retorna bônus mágico baseado na qualidade do item
   * @param {string} qualidade - Qualidade do item
   * @returns {number} Bônus mágico
   */
  _getBonusMagico(qualidade) {
    const bonus = {
      "comum": 0,
      "incomum": 1,
      "raro": 2,
      "muito_raro": 3,
      "lendario": 4,
      "artefato": 5
    };
    
    return bonus[qualidade] || 0;
  }

  /**
   * Usa o item (ativação)
   * @param {Actor} usuario - Ator que está usando o item
   * @param {Object} opcoes - Opções de uso
   */
  async usar(usuario = null, opcoes = {}) {
    const ator = usuario || this.actor;
    
    if (!ator) {
      ui.notifications.error("Nenhum ator especificado para usar o item");
      return;
    }

    const data = this.system;

    switch (this.type) {
      case "arma":
        return await this._usarArma(ator, opcoes);
      case "magia":
        return await this._usarMagia(ator, opcoes);
      case "habilidade":
        return await this._usarHabilidade(ator, opcoes);
      case "consumivel":
        return await this._usarConsumivel(ator, opcoes);
      default:
        ui.notifications.warn(`Tipo de item ${this.type} não pode ser usado diretamente`);
    }
  }

  /**
   * Usa uma arma para atacar
   * @param {Actor} ator - Atacante
   * @param {Object} opcoes - Opções do ataque
   */
  async _usarArma(ator, opcoes = {}) {
    return await ator.atacar(this, opcoes.alvo);
  }

  /**
   * Conjura uma magia
   * @param {Actor} ator - Conjurador
   * @param {Object} opcoes - Opções da conjuração
   */
  async _usarMagia(ator, opcoes = {}) {
    const data = this.system;
    
    if (!data.pode_conjurar) {
      ui.notifications.warn("Não é possível conjurar esta magia no momento");
      return;
    }
    
    return await ator.conjurarMagia(this, opcoes.alvo);
  }

  /**
   * Ativa uma habilidade
   * @param {Actor} ator - Usuário
   * @param {Object} opcoes - Opções de uso
   */
  async _usarHabilidade(ator, opcoes = {}) {
    const data = this.system;
    
    if (!data.pode_usar) {
      ui.notifications.warn("Não é possível usar esta habilidade no momento");
      return;
    }
    
    // Consumir uso se limitado
    if (data.usos && data.usos.limitado && data.usos.atual > 0) {
      await this.update({"system.usos.atual": data.usos.atual - 1});
    }
    
    // Aplicar efeitos da habilidade
    await this._aplicarEfeitosHabilidade(ator, opcoes);
    
    // Notificar uso
    const chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({actor: ator}),
      content: `<h3>${this.name}</h3><p>${data.efeito}</p>`,
      type: CONST.CHAT_MESSAGE_TYPES.OTHER
    };
    
    await ChatMessage.create(chatData);
  }

  /**
   * Usa um consumível
   * @param {Actor} ator - Usuário
   * @param {Object} opcoes - Opções de uso
   */
  async _usarConsumivel(ator, opcoes = {}) {
    const data = this.system;
    
    if (!data.pode_usar) {
      ui.notifications.warn("Este item não pode mais ser usado");
      return;
    }
    
    // Aplicar efeitos do consumível
    await this._aplicarEfeitosConsumivel(ator, opcoes);
    
    // Consumir uso
    const novosUsos = data.usos.atual - 1;
    await this.update({"system.usos.atual": novosUsos});
    
    // Remover item se não tem mais usos
    if (novosUsos <= 0) {
      await this.delete();
      ui.notifications.info(`${this.name} foi consumido`);
    }
  }

  /**
   * Aplica efeitos de uma habilidade
   * @param {Actor} ator - Usuário
   * @param {Object} opcoes - Opções
   */
  async _aplicarEfeitosHabilidade(ator, opcoes) {
    // Implementar efeitos específicos por habilidade
    // Este é um local onde efeitos customizados seriam implementados
    
    // Exemplo para algumas habilidades básicas:
    const nome = this.name.toLowerCase();
    
    if (nome.includes("ataque poderoso")) {
      // Adicionar bônus temporário de dano
      ui.notifications.info("Próximo ataque terá +2 de dano");
    } else if (nome.includes("defesa aprimorada")) {
      // Aplicar bônus permanente de defesa (já calculado no Actor)
    } else if (nome.includes("cura")) {
      // Aplicar cura
      const cura = 2 + Math.floor(ator.system.atributos.mental.valor / 2);
      await ator.curar(cura);
    }
  }

  /**
   * Aplica efeitos de um consumível
   * @param {Actor} ator - Usuário
   * @param {Object} opcoes - Opções
   */
  async _aplicarEfeitosConsumivel(ator, opcoes) {
    const data = this.system;
    const tipo = data.tipo;
    
    // Efeitos básicos por tipo
    if (tipo === "pocao") {
      if (this.name.toLowerCase().includes("cura")) {
        // Poção de cura
        const match = data.efeito.match(/(\d+d\d+\+?\d*)/);
        if (match) {
          const roll = new Roll(match[1]);
          await roll.evaluate();
          await ator.curar(roll.total);
          
          const chatData = {
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({actor: ator}),
            content: `${ator.name} usa ${this.name} e recupera ${roll.total} PV`,
            roll: roll,
            type: CONST.CHAT_MESSAGE_TYPES.ROLL
          };
          
          await ChatMessage.create(chatData);
        }
      } else if (this.name.toLowerCase().includes("pm")) {
        // Poção de PM
        const match = data.efeito.match(/(\d+d\d+\+?\d*)/);
        if (match) {
          const roll = new Roll(match[1]);
          await roll.evaluate();
          await ator.recuperarPM(roll.total);
          
          const chatData = {
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({actor: ator}),
            content: `${ator.name} usa ${this.name} e recupera ${roll.total} PM`,
            roll: roll,
            type: CONST.CHAT_MESSAGE_TYPES.ROLL
          };
          
          await ChatMessage.create(chatData);
        }
      }
    }
  }

  /**
   * Verifica se o item pode ser equipado pelo ator
   * @param {Actor} ator - Ator que tentará equipar
   * @returns {boolean} Se pode equipar
   */
  podeEquipar(ator = null) {
    const usuario = ator || this.actor;
    if (!usuario) return false;
    
    const data = this.system;
    const atorData = usuario.system;
    
    // Verificar nível mínimo
    if (data.nivel_minimo && atorData.nivel < data.nivel_minimo) {
      return false;
    }
    
    // Verificar requisitos de atributos
    if (data.prerequisitos && data.prerequisitos.atributos) {
      for (const [attr, minimo] of Object.entries(data.prerequisitos.atributos)) {
        if (atorData.atributos[attr].valor < minimo) {
          return false;
        }
      }
    }
    
    return true;
  }

  /**
   * Retorna informações de tooltip para o item
   * @returns {string} HTML do tooltip
   */
  getTooltip() {
    const data = this.system;
    let tooltip = `<h3>${this.name}</h3>`;
    
    if (data.descricao) {
      tooltip += `<p>${data.descricao}</p>`;
    }
    
    // Adicionar informações específicas por tipo
    switch (this.type) {
      case "arma":
        tooltip += `<p><strong>Dano:</strong> ${data.dano.base}</p>`;
        tooltip += `<p><strong>Tipo:</strong> ${data.tipo}</p>`;
        break;
      case "armadura":
        tooltip += `<p><strong>Proteção:</strong> ${data.protecao}</p>`;
        tooltip += `<p><strong>Defesa:</strong> +${data.mod_defesa}</p>`;
        break;
      case "magia":
        tooltip += `<p><strong>Escola:</strong> ${data.escola}</p>`;
        tooltip += `<p><strong>Nível:</strong> ${data.nivel}</p>`;
        tooltip += `<p><strong>Custo PM:</strong> ${data.custo_pm}</p>`;
        break;
    }
    
    if (data.preco && data.preco.valor > 0) {
      tooltip += `<p><strong>Preço:</strong> ${data.preco.valor} ${data.preco.moeda.toUpperCase()}</p>`;
    }
    
    return tooltip;
  }
} 