/**
 * Extende a classe base Actor para implementar as regras específicas do Sistema Clube dos Taberneiros
 */
export class ClubeActor extends Actor {

  /** @override */
  prepareData() {
    super.prepareData();
    
    // Preparar dados específicos por tipo
    switch (this.type) {
      case "personagem":
        this._preparePersonagemData();
        break;
      case "npc":
      case "criatura":
        this._prepareNpcData();
        break;
    }
  }

  /**
   * Prepara dados específicos para personagens jogadores
   */
  _preparePersonagemData() {
    const data = this.system;
    
    // Calcular valores derivados dos atributos
    this._calcularValoresDerivados(data);
    
    // Aplicar modificadores de raça
    this._aplicarModificadoresRaca(data);
    
    // Aplicar modificadores de classe
    this._aplicarModificadoresClasse(data);
    
    // Verificar condições de ferimento
    this._verificarCondicoesFerimento(data);
    
    // Calcular capacidade de carga
    this._calcularCapacidadeCarga(data);
  }

  /**
   * Prepara dados específicos para NPCs e criaturas
   */
  _prepareNpcData() {
    const data = this.system;
    
    // Calcular valores derivados
    this._calcularValoresDerivados(data);
    
    // Verificar condições de ferimento
    this._verificarCondicoesFerimento(data);
  }

  /**
   * Calcula valores derivados dos atributos
   * @param {Object} data - Dados do sistema do ator
   */
  _calcularValoresDerivados(data) {
    const atributos = data.atributos;
    
    // Calcular PV máximo (Físico × 3 + 10)
    const pvMax = atributos.fisico.valor * 3 + 10;
    data.recursos.pv.max = pvMax;
    
    // Garantir que PV atual não exceda o máximo
    if (data.recursos.pv.valor > pvMax) {
      data.recursos.pv.valor = pvMax;
    }
    
    // Calcular PM máximo (Mental × 2 + 5)
    const pmMax = atributos.mental.valor * 2 + 5;
    data.recursos.pm.max = pmMax;
    
    // Garantir que PM atual não exceda o máximo
    if (data.recursos.pm.valor > pmMax) {
      data.recursos.pm.valor = pmMax;
    }
    
    // Calcular Defesa (10 + Ação + modificadores)
    const defesaBase = 10 + atributos.acao.valor;
    data.recursos.defesa.base = defesaBase;
    data.recursos.defesa.valor = defesaBase + 
      (data.recursos.defesa.armadura || 0) + 
      (data.recursos.defesa.escudo || 0) + 
      (data.recursos.defesa.outros || 0);
    
    // Calcular movimento base (9m padrão)
    if (!data.movimento) {
      data.movimento = { base: 9, atual: 9 };
    }
  }

  /**
   * Aplica modificadores raciais
   * @param {Object} data - Dados do sistema do ator
   */
  _aplicarModificadoresRaca(data) {
    if (!data.raca || !data.raca.nome) return;
    
    // Definir modificadores por raça
    const modificadoresRaciais = {
      "elfo": { mental: 2, fisico: -1 },
      "anao": { fisico: 2, social: -1 },
      "halfling": { acao: 2, fisico: -1 },
      "tiefling": { mental: 1, social: 1, fisico: -1 },
      "goblin": { mental: 2, fisico: -1 },
      "humano": {} // Versátil - modificador é escolhido pelo jogador
    };
    
    const mods = modificadoresRaciais[data.raca.nome.toLowerCase()];
    if (mods) {
      Object.keys(mods).forEach(atributo => {
        if (data.atributos[atributo]) {
          data.atributos[atributo].mod_raca = mods[atributo];
        }
      });
    }
  }

  /**
   * Aplica modificadores de classe
   * @param {Object} data - Dados do sistema do ator
   */
  _aplicarModificadoresClasse(data) {
    if (!data.classe || !data.classe.nome) return;
    
    // Aplicar modificadores específicos por classe se necessário
    // Por exemplo, bônus de PV para Guerreiros, PM para Magos, etc.
  }

  /**
   * Verifica e atualiza condições de ferimento
   * @param {Object} data - Dados do sistema do ator
   */
  _verificarCondicoesFerimento(data) {
    const pv = data.recursos.pv;
    const porcentagemPv = pv.valor / pv.max;
    
    // Ferido (PV < 50%)
    data.condicoes.ferido = porcentagemPv < 0.5 && pv.valor > 0;
    
    // Gravemente Ferido (PV < 25%)
    data.condicoes.gravemente_ferido = porcentagemPv < 0.25 && pv.valor > 0;
    
    // Inconsciente (PV = 0)
    data.condicoes.inconsciente = pv.valor <= 0;
  }

  /**
   * Calcula capacidade de carga baseada no atributo Físico
   * @param {Object} data - Dados do sistema do ator
   */
  _calcularCapacidadeCarga(data) {
    // Capacidade de carga = Físico × 5 kg
    data.capacidade_carga = data.atributos.fisico.valor * 5;
  }

  /**
   * Executa um teste de atributo
   * @param {string} atributo - Nome do atributo
   * @param {number} nd - Número de Dificuldade
   * @param {number} modificador - Modificadores extras
   * @param {string} nome - Nome do teste para exibição
   */
  async rolarTeste(atributo, nd = 9, modificador = 0, nome = null) {
    const data = this.system;
    const valorAtributo = data.atributos[atributo]?.valor || 3;
    
    // Aplicar penalidades por condições
    let penalidade = 0;
    if (data.condicoes.ferido) penalidade -= 1;
    if (data.condicoes.gravemente_ferido) penalidade -= 2;
    
    // Usar função global do sistema
    return await window.clube.executarTeste({
      atributo: atributo,
      valor: valorAtributo,
      nd: nd,
      modificador: modificador + penalidade,
      nome: nome || `Teste de ${game.i18n.localize(`ATRIBUTOS.${atributo.toUpperCase()}`)}`,
      ator: this
    });
  }

  /**
   * Executa um ataque com arma
   * @param {Item} arma - Item de arma (opcional)
   * @param {Actor} alvo - Alvo do ataque (opcional)
   */
  async atacar(arma = null, alvo = null) {
    const tipo = arma?.system.tipo || "corpo_a_corpo";
    
    return await window.clube.executarAtaque({
      atacante: this,
      alvo: alvo,
      arma: arma,
      tipo: tipo
    });
  }

  /**
   * Conjura uma magia
   * @param {Item} magia - Item de magia
   * @param {Actor} alvo - Alvo da magia (opcional)
   */
  async conjurarMagia(magia, alvo = null) {
    return await window.clube.conjurarMagia({
      conjurador: this,
      magia: magia,
      alvo: alvo
    });
  }

  /**
   * Aplica dano ao personagem
   * @param {number} dano - Quantidade de dano
   * @param {string} tipo - Tipo de dano (opcional)
   */
  async aplicarDano(dano, tipo = "fisico") {
    const pvAtual = this.system.recursos.pv.valor;
    const novoPv = Math.max(0, pvAtual - dano);
    
    await this.update({"system.recursos.pv.valor": novoPv});
    
    // Notificação
    const mensagem = dano > 0 ? 
      `${this.name} recebeu ${dano} pontos de dano` :
      `${this.name} foi curado em ${Math.abs(dano)} pontos`;
    
    ui.notifications.info(mensagem);
    
    return novoPv;
  }

  /**
   * Cura o personagem
   * @param {number} cura - Quantidade de cura
   */
  async curar(cura) {
    const pvAtual = this.system.recursos.pv.valor;
    const pvMax = this.system.recursos.pv.max;
    const novoPv = Math.min(pvMax, pvAtual + cura);
    
    await this.update({"system.recursos.pv.valor": novoPv});
    
    ui.notifications.info(`${this.name} foi curado em ${cura} pontos de vida`);
    
    return novoPv;
  }

  /**
   * Gasta PM para conjuração
   * @param {number} custo - Custo em PM
   */
  async gastarPM(custo) {
    const pmAtual = this.system.recursos.pm.valor;
    
    if (pmAtual < custo) {
      ui.notifications.warn(game.i18n.localize("DIALOGS.PM_INSUFICIENTE"));
      return false;
    }
    
    const novoPm = pmAtual - custo;
    await this.update({"system.recursos.pm.valor": novoPm});
    
    return true;
  }

  /**
   * Recupera PM (descanso)
   * @param {number} recuperacao - Quantidade de PM a recuperar
   */
  async recuperarPM(recuperacao) {
    const pmAtual = this.system.recursos.pm.valor;
    const pmMax = this.system.recursos.pm.max;
    const novoPm = Math.min(pmMax, pmAtual + recuperacao);
    
    await this.update({"system.recursos.pm.valor": novoPm});
    
    ui.notifications.info(`${this.name} recuperou ${recuperacao} PM`);
    
    return novoPm;
  }

  /**
   * Aplica/remove uma condição
   * @param {string} condicao - Nome da condição
   * @param {boolean} ativo - Se a condição está ativa
   */
  async alterarCondicao(condicao, ativo) {
    await this.update({[`system.condicoes.${condicao}`]: ativo});
    
    const status = ativo ? "aplicada" : "removida";
    ui.notifications.info(`Condição ${condicao} ${status} em ${this.name}`);
  }

  /**
   * Equipa um item
   * @param {Item} item - Item a ser equipado
   */
  async equiparItem(item) {
    if (!item.system.hasOwnProperty('equipado')) {
      ui.notifications.warn("Este item não pode ser equipado");
      return;
    }

    await item.update({"system.equipado": true});
    
    // Aplicar modificadores do item se necessário
    await this._aplicarModificadoresItem(item, true);
  }

  /**
   * Desequipa um item
   * @param {Item} item - Item a ser desequipado
   */
  async desequiparItem(item) {
    await item.update({"system.equipado": false});
    
    // Remover modificadores do item
    await this._aplicarModificadoresItem(item, false);
  }

  /**
   * Aplica ou remove modificadores de um item equipado
   * @param {Item} item - Item
   * @param {boolean} aplicar - Se deve aplicar (true) ou remover (false)
   */
  async _aplicarModificadoresItem(item, aplicar) {
    const fator = aplicar ? 1 : -1;
    const updateData = {};
    
    // Aplicar modificadores baseado no tipo do item
    if (item.type === "armadura") {
      updateData["system.recursos.defesa.armadura"] = 
        (this.system.recursos.defesa.armadura || 0) + (item.system.mod_defesa * fator);
    } else if (item.type === "escudo") {
      updateData["system.recursos.defesa.escudo"] = 
        (this.system.recursos.defesa.escudo || 0) + (item.system.mod_defesa * fator);
    }
    
    // Recalcular defesa total
    if (updateData["system.recursos.defesa.armadura"] !== undefined || 
        updateData["system.recursos.defesa.escudo"] !== undefined) {
      const defesaBase = this.system.recursos.defesa.base;
      const armadura = updateData["system.recursos.defesa.armadura"] || this.system.recursos.defesa.armadura || 0;
      const escudo = updateData["system.recursos.defesa.escudo"] || this.system.recursos.defesa.escudo || 0;
      const outros = this.system.recursos.defesa.outros || 0;
      
      updateData["system.recursos.defesa.valor"] = defesaBase + armadura + escudo + outros;
    }
    
    if (Object.keys(updateData).length > 0) {
      await this.update(updateData);
    }
  }

  /**
   * Aumenta um atributo (progressão de personagem)
   * @param {string} atributo - Nome do atributo
   * @param {number} incremento - Quantidade a aumentar
   */
  async aumentarAtributo(atributo, incremento = 1) {
    const valorAtual = this.system.atributos[atributo]?.valor || 3;
    const novoValor = valorAtual + incremento;
    
    // Limitar a valores razoáveis (3-18)
    if (novoValor > 18) {
      ui.notifications.warn("Valor máximo de atributo é 18");
      return;
    }
    
    await this.update({[`system.atributos.${atributo}.valor`]: novoValor});
    
    ui.notifications.info(`${game.i18n.localize(`ATRIBUTOS.${atributo.toUpperCase()}`)} aumentado para ${novoValor}`);
  }

  /**
   * Adiciona experiência ao personagem
   * @param {number} quantidade - Quantidade de XP a adicionar
   */
  async adicionarXP(quantidade) {
    if (quantidade <= 0) {
      ui.notifications.warn("Quantidade de XP deve ser positiva");
      return;
    }

    const xpAtual = this.system.experiencia.atual || 0;
    const novoXP = xpAtual + quantidade;
    
    await this.update({"system.experiencia.atual": novoXP});
    
    ui.notifications.info(`+${quantidade} XP adicionado! (Total: ${novoXP})`);
    
    // Verificar se deve subir de nível
    await this._verificarSubidaNivel();
  }

  /**
   * Verifica se o personagem deve subir de nível
   * @private
   */
  async _verificarSubidaNivel() {
    const tabelaXP = [0, 10, 25, 45, 70, 100, 135, 175, 220, 270, 325, 385, 450, 520, 595, 675, 760, 850, 945, 1045];
    const nivelAtual = this.system.nivel || 1;
    const xpAtual = this.system.experiencia.atual || 0;
    
    // Verificar quantos níveis pode subir
    let novoNivel = nivelAtual;
    while (novoNivel < tabelaXP.length && xpAtual >= tabelaXP[novoNivel]) {
      novoNivel++;
    }
    
    if (novoNivel > nivelAtual) {
      await this._subirNivel(novoNivel);
    }
  }

  /**
   * Sobe o nível do personagem
   * @param {number} novoNivel - Novo nível do personagem
   * @private
   */
  async _subirNivel(novoNivel) {
    const nivelAtual = this.system.nivel || 1;
    
    // Calcular recompensas baseadas no sistema oficial
    let pontosAtributo = this.system.progressao?.pontos_atributo || 0;
    let habilidadesDisponiveis = this.system.progressao?.habilidades_disponiveis || 0;
    
    // Aplicar recompensas para cada nível subido
    for (let nivel = nivelAtual + 1; nivel <= novoNivel; nivel++) {
      const recompensas = this._calcularRecompensasNivel(nivel);
      pontosAtributo += recompensas.pontosAtributo;
      habilidadesDisponiveis += recompensas.habilidades;
    }
    
    const updateData = {
      "system.nivel": novoNivel,
      "system.progressao.pontos_atributo": pontosAtributo,
      "system.progressao.habilidades_disponiveis": habilidadesDisponiveis
    };

    await this.update(updateData);
    
    // Mostrar notificação de subida de nível
    ui.notifications.info(`🎉 ${this.name} subiu para o nível ${novoNivel}!`);
    
    // Se subiu múltiplos níveis
    if (novoNivel - nivelAtual > 1) {
      ui.notifications.warn(`Subiu ${novoNivel - nivelAtual} níveis de uma vez! Distribua as recompensas.`);
    }
    
    // Enviar mensagem no chat
    await this._anunciarSubidaNivel(nivelAtual, novoNivel);
  }

  /**
   * Calcula as recompensas para um nível específico
   * @param {number} nivel - Nível para calcular recompensas
   * @returns {Object} Objeto com pontosAtributo e habilidades
   * @private
   */
  _calcularRecompensasNivel(nivel) {
    const recompensas = {
      pontosAtributo: 0,
      habilidades: 0
    };

         switch (nivel) {
       case 1:
         // Nível 1: 4 habilidades iniciais (apenas se criando personagem novo)
         recompensas.habilidades = 0; // Não aplicar ao subir para nível 1
         break;
      case 2:
      case 4:
      case 6:
      case 8:
        // Níveis pares: +1 habilidade
        recompensas.habilidades = 1;
        break;
      case 3:
      case 7:
        // Níveis 3 e 7: +1 ponto de atributo
        recompensas.pontosAtributo = 1;
        break;
      case 5:
      case 9:
        // Níveis 5 e 9: Habilidade especial de classe
        recompensas.habilidades = 1; // Tratada como habilidade especial
        break;
      case 10:
        // Nível 10: Maestria (habilidade única)
        recompensas.habilidades = 1; // Tratada como habilidade especial
        break;
      default:
        // Níveis acima de 10 (sistema épico)
        if (nivel % 2 === 0) {
          recompensas.habilidades = 1;
        } else {
          recompensas.pontosAtributo = 1;
        }
        break;
    }

    return recompensas;
  }

  /**
   * Anuncia a subida de nível no chat
   * @param {number} nivelAnterior - Nível anterior
   * @param {number} novoNivel - Novo nível
   * @private
   */
  async _anunciarSubidaNivel(nivelAnterior, novoNivel) {
    // Calcular recompensas para cada nível subido
    const recompensas = [];
    for (let nivel = nivelAnterior + 1; nivel <= novoNivel; nivel++) {
      const recompensa = this._calcularRecompensasNivel(nivel);
      let descricao = "";
      
      if (recompensa.pontosAtributo > 0 && recompensa.habilidades > 0) {
        descricao = `+${recompensa.pontosAtributo} ponto de atributo e +${recompensa.habilidades} habilidade`;
      } else if (recompensa.pontosAtributo > 0) {
        descricao = `+${recompensa.pontosAtributo} ponto de atributo`;
      } else if (recompensa.habilidades > 0) {
        if (nivel === 5 || nivel === 9) {
          descricao = "Habilidade especial de classe";
        } else if (nivel === 10) {
          descricao = "Maestria (habilidade única)";
        } else {
          descricao = `+${recompensa.habilidades} habilidade`;
        }
      }
      
      if (descricao) {
        recompensas.push(`<li><strong>Nível ${nivel}:</strong> ${descricao}</li>`);
      }
    }

    const chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({actor: this}),
      content: `
        <div class="subida-nivel">
          <h3>🎉 Subida de Nível!</h3>
          <p><strong>${this.name}</strong> subiu do nível <strong>${nivelAnterior}</strong> para o nível <strong>${novoNivel}</strong>!</p>
          <ul>
            ${recompensas.join('')}
            <li>PV e PM recalculados automaticamente</li>
          </ul>
        </div>
      `,
      type: CONST.CHAT_MESSAGE_TYPES.OTHER
    };

    await ChatMessage.create(chatData);
  }

  /**
   * Remove experiência do personagem (para correções)
   * @param {number} quantidade - Quantidade de XP a remover
   */
  async removerXP(quantidade) {
    if (quantidade <= 0) {
      ui.notifications.warn("Quantidade de XP deve ser positiva");
      return;
    }

    const xpAtual = this.system.experiencia.atual || 0;
    const novoXP = Math.max(0, xpAtual - quantidade);
    
    await this.update({"system.experiencia.atual": novoXP});
    
    ui.notifications.warn(`-${quantidade} XP removido! (Total: ${novoXP})`);
  }

  /**
   * Define o XP diretamente (para correções)
   * @param {number} quantidade - Quantidade total de XP
   */
  async definirXP(quantidade) {
    if (quantidade < 0) {
      ui.notifications.warn("XP não pode ser negativo");
      return;
    }

    await this.update({"system.experiencia.atual": quantidade});
    
    ui.notifications.info(`XP definido para ${quantidade}`);
    
    // Verificar se deve subir de nível
    await this._verificarSubidaNivel();
  }
} 