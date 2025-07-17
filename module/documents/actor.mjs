/**
 * Extende a classe base Actor para implementar as regras específicas do Sistema Clube dos Taberneiros
 */
export class ClubeActor extends Actor {

  /** @override */
  prepareBaseData() {
    super.prepareBaseData();
    
    // Garantir que atributos sejam inicializados com 0 para novos personagens
    if (!this.system.atributos) {
      this.system.atributos = {
        fisico: { valor: 0 },
        acao: { valor: 0 },
        mental: { valor: 0 },
        social: { valor: 0 }
      };
    } else {
      // Garantir que cada atributo tenha valor 0 se não existir
      const atributos = ['fisico', 'acao', 'mental', 'social'];
      atributos.forEach(atributo => {
        if (!this.system.atributos[atributo]) {
          this.system.atributos[atributo] = { valor: 0 };
        } else if (this.system.atributos[atributo].valor === undefined) {
          this.system.atributos[atributo].valor = 0;
        }
      });
    }
    
    // Garantir que progressão seja inicializada
    if (!this.system.progressao) {
      this.system.progressao = {
        pontos_atributo: 0,
        pontos_atributo_iniciais: 18,
        pontos_atributo_gastos_iniciais: 0,
        atributos_inicializados: false,
        habilidades_disponiveis: 0
      };
    }
    
    // Garantir que experiência seja inicializada
    if (!this.system.experiencia) {
      this.system.experiencia = {
        atual: 0,
        necessaria: 10
      };
    }
    
    // Garantir que nível seja inicializado
    if (!this.system.nivel) {
      this.system.nivel = 1;
    }
    
    // Garantir que recursos sejam inicializados
    if (!this.system.recursos) {
      this.system.recursos = {
        pv: { valor: 10, max: 10 },
        pm: { valor: 5, max: 5 },
        defesa: { valor: 10, base: 10, armadura: 0, escudo: 0, outros: 0 }
      };
    }
    
    // Garantir que condições sejam inicializadas
    if (!this.system.condicoes) {
      this.system.condicoes = {
        ferido: false,
        gravemente_ferido: false,
        inconsciente: false,
        caido: false,
        atordoado: false,
        cego: false,
        surdo: false
      };
    }
  }

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
    
    // Garantir que atributos existam e tenham valores válidos
    if (!atributos.fisico || atributos.fisico.valor === undefined) {
      atributos.fisico = { valor: 0 };
    }
    if (!atributos.mental || atributos.mental.valor === undefined) {
      atributos.mental = { valor: 0 };
    }
    if (!atributos.acao || atributos.acao.valor === undefined) {
      atributos.acao = { valor: 0 };
    }
    if (!atributos.social || atributos.social.valor === undefined) {
      atributos.social = { valor: 0 };
    }
    
    // Garantir que recursos existam
    if (!data.recursos) {
      data.recursos = {
        pv: { valor: 10, max: 10 },
        pm: { valor: 5, max: 5 },
        defesa: { valor: 10, base: 10, armadura: 0, escudo: 0, outros: 0 }
      };
    }
    
    // Calcular PV máximo (Físico × 3 + 10)
    const pvMax = Math.max(1, atributos.fisico.valor * 3 + 10);
    data.recursos.pv.max = pvMax;
    
    // Garantir que PV atual não exceda o máximo
    if (data.recursos.pv.valor > pvMax) {
      data.recursos.pv.valor = pvMax;
    }
    
    // Calcular PM máximo (Mental × 2 + 5)
    const pmMax = Math.max(1, atributos.mental.valor * 2 + 5);
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
    
    // Garantir que defesa seja pelo menos 1
    data.recursos.defesa.valor = Math.max(1, data.recursos.defesa.valor);
    
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
    // Garantir que condições existam
    if (!data.condicoes) {
      data.condicoes = {
        ferido: false,
        gravemente_ferido: false,
        inconsciente: false,
        caido: false,
        atordoado: false,
        cego: false,
        surdo: false
      };
    }
    
    // Garantir que recursos existam
    if (!data.recursos || !data.recursos.pv) {
      return;
    }
    
    const pv = data.recursos.pv;
    const porcentagemPv = pv.max > 0 ? pv.valor / pv.max : 0;
    
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
    // Garantir que atributos existam
    if (!data.atributos || !data.atributos.fisico) {
      data.capacidade_carga = 1;
      return;
    }
    
    // Capacidade de carga = Físico × 5 kg (mínimo 1 kg)
    data.capacidade_carga = Math.max(1, data.atributos.fisico.valor * 5);
  }

  /**
   * Garante que dados padrão sejam definidos na criação
   * @param {Object} data - Dados do ator
   * @param {Object} options - Opções de criação
   */
  static async create(data, options = {}) {
    // Garantir que atributos sejam inicializados com 0
    if (data.type === "personagem") {
      if (!data.system) data.system = {};
      if (!data.system.atributos) {
        data.system.atributos = {
          fisico: { valor: 0 },
          acao: { valor: 0 },
          mental: { valor: 0 },
          social: { valor: 0 }
        };
      } else {
        // Garantir que cada atributo tenha valor 0 se não existir
        const atributos = ['fisico', 'acao', 'mental', 'social'];
        atributos.forEach(atributo => {
          if (!data.system.atributos[atributo]) {
            data.system.atributos[atributo] = { valor: 0 };
          } else if (data.system.atributos[atributo].valor === undefined) {
            data.system.atributos[atributo].valor = 0;
          }
        });
      }
      
      // Garantir que progressão seja inicializada
      if (!data.system.progressao) {
        data.system.progressao = {
          pontos_atributo: 0,
          pontos_atributo_iniciais: 18,
          pontos_atributo_gastos_iniciais: 0,
          atributos_inicializados: false,
          habilidades_disponiveis: 0
        };
      }
      
      // Garantir que experiência seja inicializada
      if (!data.system.experiencia) {
        data.system.experiencia = {
          atual: 0,
          necessaria: 10
        };
      }
      
      // Garantir que nível seja inicializado
      if (!data.system.nivel) {
        data.system.nivel = 1;
      }
      
      // Garantir que recursos sejam inicializados
      if (!data.system.recursos) {
        data.system.recursos = {
          pv: { valor: 10, max: 10 },
          pm: { valor: 5, max: 5 },
          defesa: { valor: 10, base: 10, armadura: 0, escudo: 0, outros: 0 }
        };
      }
      
      // Garantir que condições sejam inicializadas
      if (!data.system.condicoes) {
        data.system.condicoes = {
          ferido: false,
          gravemente_ferido: false,
          inconsciente: false,
          caido: false,
          atordoado: false,
          cego: false,
          surdo: false
        };
      }
    }
    
    return super.create(data, options);
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
    const valorAtributo = data.atributos[atributo]?.valor || 0;
    
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
    const valorAtual = this.system.atributos[atributo]?.valor || 0;
    const novoValor = valorAtual + incremento;
    
    // Limitar a valores razoáveis (0-18)
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

    // Garantir que estrutura de experiência exista
    if (!this.system.experiencia) {
      this.system.experiencia = {
        atual: 0,
        necessaria: 10
      };
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
    // Garantir que estruturas existam
    if (!this.system.experiencia) {
      this.system.experiencia = { atual: 0, necessaria: 10 };
    }
    if (!this.system.nivel) {
      this.system.nivel = 1;
    }
    
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
    
    // Atualizar XP necessário para o próximo nível
    const proximoNivel = Math.min(novoNivel + 1, tabelaXP.length - 1);
    const xpNecessaria = tabelaXP[proximoNivel];
    if (this.system.experiencia.necessaria !== xpNecessaria) {
      await this.update({"system.experiencia.necessaria": xpNecessaria});
    }
  }

  /**
   * Sobe o nível do personagem
   * @param {number} novoNivel - Novo nível do personagem
   * @private
   */
  async _subirNivel(novoNivel) {
    const nivelAtual = this.system.nivel || 1;
    
    // Garantir que progressão exista
    if (!this.system.progressao) {
      this.system.progressao = {
        pontos_atributo: 0,
        pontos_atributo_iniciais: 18,
        pontos_atributo_gastos_iniciais: 0,
        atributos_inicializados: false,
        habilidades_disponiveis: 0
      };
    }
    
    // Garantir que atributos existam
    if (!this.system.atributos) {
      this.system.atributos = {
        fisico: { valor: 0 },
        acao: { valor: 0 },
        mental: { valor: 0 },
        social: { valor: 0 }
      };
    }
    
    // Calcular recompensas baseadas no sistema oficial
    let pontosAtributo = this.system.progressao.pontos_atributo || 0;
    let habilidadesDisponiveis = this.system.progressao.habilidades_disponiveis || 0;
    
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

    // Garantir que estrutura de experiência exista
    if (!this.system.experiencia) {
      this.system.experiencia = {
        atual: 0,
        necessaria: 10
      };
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

    // Garantir que estrutura de experiência exista
    if (!this.system.experiencia) {
      this.system.experiencia = {
        atual: 0,
        necessaria: 10
      };
    }

    await this.update({"system.experiencia.atual": quantidade});
    
    ui.notifications.info(`XP definido para ${quantidade}`);
    
    // Verificar se deve subir de nível
    await this._verificarSubidaNivel();
  }

  /**
   * Adiciona uma habilidade ao personagem
   * @param {string} habilidadeId - ID da habilidade
   * @param {string} categoria - Categoria da habilidade
   */
  async adicionarHabilidade(habilidadeId, categoria) {
    const { SISTEMA } = await import("../helpers/settings.mjs");
    
    // Verificar se a habilidade existe
    const habilidadeData = SISTEMA.habilidades[categoria]?.[habilidadeId];
    if (!habilidadeData) {
      ui.notifications.error("Habilidade não encontrada");
      return;
    }

    // Verificar se já possui a habilidade
    if (this.system.habilidades?.[habilidadeId]) {
      ui.notifications.warn("Você já possui esta habilidade");
      return;
    }

    // Verificar pré-requisitos
    if (!this._verificarPreRequisitosHabilidade(habilidadeData)) {
      ui.notifications.error("Você não atende aos pré-requisitos para esta habilidade");
      return;
    }

    // Verificar pontos de habilidade disponíveis
    const pontosDisponiveis = this._calcularPontosHabilidadeDisponiveis();
    if (pontosDisponiveis <= 0) {
      ui.notifications.error("Você não possui pontos de habilidade disponíveis");
      return;
    }

    // Adicionar a habilidade
    const novaHabilidade = {
      nome: game.i18n.localize(habilidadeData.nome),
      categoria: categoria,
      efeito: game.i18n.localize(habilidadeData.efeito),
      nivelAdquirido: this.system.nivel
    };

    const habilidadesAtuais = this.system.habilidades || {};
    habilidadesAtuais[habilidadeId] = novaHabilidade;

    await this.update({"system.habilidades": habilidadesAtuais});
    
    ui.notifications.info(`Habilidade ${novaHabilidade.nome} adquirida!`);
  }

  /**
   * Remove uma habilidade do personagem
   * @param {string} habilidadeId - ID da habilidade
   */
  async removerHabilidade(habilidadeId) {
    if (!this.system.habilidades?.[habilidadeId]) {
      ui.notifications.warn("Você não possui esta habilidade");
      return;
    }

    const habilidadesAtuais = {...this.system.habilidades};
    const nomeHabilidade = habilidadesAtuais[habilidadeId].nome;
    
    delete habilidadesAtuais[habilidadeId];

    await this.update({"system.habilidades": habilidadesAtuais});
    
    ui.notifications.info(`Habilidade ${nomeHabilidade} removida`);
  }

  /**
   * Verifica se o personagem atende aos pré-requisitos de uma habilidade
   * @param {Object} habilidadeData - Dados da habilidade
   * @returns {boolean}
   */
  _verificarPreRequisitosHabilidade(habilidadeData) {
    // Verificar nível mínimo
    if (this.system.nivel < habilidadeData.nivelMin) {
      return false;
    }

    // Verificar pré-requisitos de atributos
    if (habilidadeData.preRequisito) {
      for (const [atributo, valorMinimo] of Object.entries(habilidadeData.preRequisito)) {
        const valorAtual = this.system.atributos[atributo]?.valor || 0;
        if (valorAtual < valorMinimo) {
          return false;
        }
      }
    }

    // Verificar se é habilidade racial
    if (habilidadeData.raca && this.system.raca?.nome !== habilidadeData.raca) {
      return false;
    }

    return true;
  }

  /**
   * Calcula quantos pontos de habilidade o personagem tem disponíveis
   * @returns {number}
   */
  _calcularPontosHabilidadeDisponiveis() {
    const nivel = this.system.nivel || 1;
    const habilidadesConhecidas = Object.keys(this.system.habilidades || {}).length;
    
    // Segundo o livro, personagens começam com 4 habilidades e ganham mais conforme o nível
    let pontosTotal = 4; // Habilidades iniciais
    
    // Nos níveis pares (2, 4, 6, 8, 10) ganha +1 habilidade
    for (let i = 2; i <= nivel; i += 2) {
      pontosTotal++;
    }
    
    const pontosDisponiveis = pontosTotal - habilidadesConhecidas;
    return Math.max(0, pontosDisponiveis);
  }

  /**
   * Obtém habilidades disponíveis por categoria
   * @param {string} categoria - Categoria das habilidades
   * @returns {Object}
   */
  async getHabilidadesDisponiveis(categoria) {
    const { SISTEMA } = await import("../helpers/settings.mjs");
    const habilidadesCategoria = SISTEMA.habilidades[categoria] || {};
    const habilidadesDisponiveis = {};

    for (const [id, habilidade] of Object.entries(habilidadesCategoria)) {
      // Não mostrar se já possui
      if (this.system.habilidades?.[id]) continue;
      
      // Não mostrar se não atende pré-requisitos
      if (!this._verificarPreRequisitosHabilidade(habilidade)) continue;
      
      habilidadesDisponiveis[id] = {
        ...habilidade,
        nome: game.i18n.localize(habilidade.nome),
        efeito: game.i18n.localize(habilidade.efeito)
      };
    }

    return habilidadesDisponiveis;
  }

  /**
   * Verifica se o personagem possui uma habilidade específica
   * @param {string} habilidadeId - ID da habilidade
   * @returns {boolean}
   */
  possuiHabilidade(habilidadeId) {
    return !!this.system.habilidades?.[habilidadeId];
  }

  /**
   * Obtém todas as habilidades conhecidas organizadas por categoria
   * @returns {Object}
   */
  getHabilidadesPorCategoria() {
    const habilidades = this.system.habilidades || {};
    const categorias = {
      combate: {},
      magicas: {},
      furtividade: {},
      sociais: {},
      gerais: {}
    };

    for (const [id, habilidade] of Object.entries(habilidades)) {
      const categoria = habilidade.categoria || 'gerais';
      categorias[categoria][id] = habilidade;
    }

    return categorias;
  }

  /**
   * Adiciona uma magia ao personagem
   * @param {string} magiaId - ID da magia
   */
  async _adicionarMagia(magiaId) {
    // Mapeamento de magias básicas
    const magiasBasicas = {
      'bola_fogo': {
        name: 'Bola de Fogo',
        img: 'icons/svg/fire.svg',
        system: {
          escola: 'evocacao',
          nivel: 3,
          custo_pm: 6,
          alcance: '30m',
          duracao: 'Instantânea',
          descricao: 'Lança uma bola de fogo que causa 3d6 de dano de fogo em uma área de 3m de raio.'
        }
      },
      'rajada_arcana': {
        name: 'Rajada Arcana',
        img: 'icons/svg/lightning.svg',
        system: {
          escola: 'evocacao',
          nivel: 1,
          custo_pm: 2,
          alcance: '15m',
          duracao: 'Instantânea',
          descricao: 'Dispara uma rajada de energia mágica que causa 1d6 + Mental de dano.'
        }
      },
      'raio_eletrico': {
        name: 'Raio Elétrico',
        img: 'icons/svg/lightning.svg',
        system: {
          escola: 'evocacao',
          nivel: 2,
          custo_pm: 4,
          alcance: '20m',
          duracao: 'Instantânea',
          descricao: 'Lança um raio elétrico que causa 2d6 de dano elétrico.'
        }
      },
      'escudo_magico': {
        name: 'Escudo Mágico',
        img: 'icons/svg/shield.svg',
        system: {
          escola: 'abjuracao',
          nivel: 1,
          custo_pm: 2,
          alcance: 'Pessoal',
          duracao: '1 cena',
          descricao: 'Cria um escudo mágico que concede +2 à Defesa.'
        }
      },
      'protecao_elemental': {
        name: 'Proteção Elemental',
        img: 'icons/svg/shield.svg',
        system: {
          escola: 'abjuracao',
          nivel: 2,
          custo_pm: 4,
          alcance: 'Pessoal',
          duracao: '1 hora',
          descricao: 'Concede resistência a um tipo de dano elementar.'
        }
      },
      'dissipar_magia': {
        name: 'Dissipar Magia',
        img: 'icons/svg/magic-swirl.svg',
        system: {
          escola: 'abjuracao',
          nivel: 3,
          custo_pm: 5,
          alcance: '15m',
          duracao: 'Instantânea',
          descricao: 'Cancela uma magia ativa ou reduz seus efeitos.'
        }
      },
      'transformar_objeto': {
        name: 'Transformar Objeto',
        img: 'icons/svg/transmutation.svg',
        system: {
          escola: 'transmutacao',
          nivel: 1,
          custo_pm: 3,
          alcance: 'Toque',
          duracao: '1 hora',
          descricao: 'Transforma um objeto pequeno em outro objeto similar.'
        }
      },
      'polimorfar': {
        name: 'Polimorfar',
        img: 'icons/svg/transmutation.svg',
        system: {
          escola: 'transmutacao',
          nivel: 4,
          custo_pm: 8,
          alcance: '15m',
          duracao: '1 hora',
          descricao: 'Transforma uma criatura em outra forma.'
        }
      },
      'voar': {
        name: 'Voo',
        img: 'icons/svg/wings.svg',
        system: {
          escola: 'transmutacao',
          nivel: 3,
          custo_pm: 6,
          alcance: 'Pessoal',
          duracao: '10 minutos',
          descricao: 'Concede a capacidade de voar a uma velocidade de 18m.'
        }
      },
      'invisibilidade': {
        name: 'Invisibilidade',
        img: 'icons/svg/illusion.svg',
        system: {
          escola: 'ilusao',
          nivel: 2,
          custo_pm: 4,
          alcance: 'Pessoal',
          duracao: '5 minutos',
          descricao: 'Torna o conjurador invisível até que ele ataque ou use uma magia.'
        }
      },
      'imagem_espelhada': {
        name: 'Imagem Espelhada',
        img: 'icons/svg/illusion.svg',
        system: {
          escola: 'ilusao',
          nivel: 1,
          custo_pm: 2,
          alcance: 'Pessoal',
          duracao: '1 minuto',
          descricao: 'Cria 1d4 imagens ilusórias que confundem ataques.'
        }
      },
      'sugestao': {
        name: 'Sugestão',
        img: 'icons/svg/illusion.svg',
        system: {
          escola: 'ilusao',
          nivel: 2,
          custo_pm: 4,
          alcance: '15m',
          duracao: '1 hora',
          descricao: 'Influencia uma criatura a seguir uma sugestão razoável.'
        }
      },
      'detectar_magia': {
        name: 'Detectar Magia',
        img: 'icons/svg/detect-magic.svg',
        system: {
          escola: 'divinacao',
          nivel: 1,
          custo_pm: 1,
          alcance: '15m',
          duracao: '1 minuto',
          descricao: 'Detecta a presença de magia em uma área.'
        }
      },
      'adivinhar': {
        name: 'Adivinhar',
        img: 'icons/svg/detect-magic.svg',
        system: {
          escola: 'divinacao',
          nivel: 2,
          custo_pm: 3,
          alcance: 'Pessoal',
          duracao: 'Instantânea',
          descricao: 'Recebe uma resposta simples a uma pergunta sobre o futuro.'
        }
      },
      'localizar_objeto': {
        name: 'Localizar Objeto',
        img: 'icons/svg/detect-magic.svg',
        system: {
          escola: 'divinacao',
          nivel: 2,
          custo_pm: 3,
          alcance: '1km',
          duracao: 'Instantânea',
          descricao: 'Localiza um objeto específico conhecido dentro do alcance.'
        }
      },
      'drenar_vida': {
        name: 'Drenar Vida',
        img: 'icons/svg/death.svg',
        system: {
          escola: 'necromancia',
          nivel: 2,
          custo_pm: 4,
          alcance: '15m',
          duracao: 'Instantânea',
          descricao: 'Drena a vida de uma criatura, causando dano e curando o conjurador.'
        }
      },
      'animar_morto': {
        name: 'Animar Morto',
        img: 'icons/svg/death.svg',
        system: {
          escola: 'necromancia',
          nivel: 3,
          custo_pm: 6,
          alcance: '15m',
          duracao: '1 hora',
          descricao: 'Anima um cadáver para servir ao conjurador.'
        }
      },
      'medo': {
        name: 'Medo',
        img: 'icons/svg/death.svg',
        system: {
          escola: 'necromancia',
          nivel: 1,
          custo_pm: 2,
          alcance: '15m',
          duracao: '1 minuto',
          descricao: 'Infunde medo em uma criatura, forçando-a a fugir.'
        }
      }
    };

    const magiaData = magiasBasicas[magiaId];
    if (!magiaData) {
      throw new Error("Magia não encontrada");
    }

    // Verificar se já possui a magia
    const magiasExistentes = this.items.filter(item => item.type === 'magia');
    const jaPossui = magiasExistentes.some(item => item.name.toLowerCase() === magiaData.name.toLowerCase());
    
    if (jaPossui) {
      throw new Error("Você já possui esta magia");
    }

    // Verificar pré-requisitos (Mental 6+ para magias nível 1, Mental 7+ para nível 2, etc.)
    const mental = this.system.atributos?.mental?.valor || 0;
    const nivel = this.system.nivel || 1;
    const nivelMagia = magiaData.system.nivel;
    
    if (mental < (nivelMagia + 5) || nivel < nivelMagia) {
      throw new Error("Você não atende aos pré-requisitos para esta magia");
    }

    // Criar o item de magia
    const magiaItem = await Item.create({
      name: magiaData.name,
      type: 'magia',
      img: magiaData.img,
      system: magiaData.system
    }, { parent: this });

    ui.notifications.info(`Magia ${magiaData.name} aprendida!`);
    return magiaItem;
  }

  /**
   * Verifica se os atributos foram inicializados e se há pontos para distribuir
   * @returns {Object} Informações sobre distribuição de pontos
   */
  getStatusPontosAtributos() {
    try {
      console.log(`[DEBUG] Verificando status dos pontos de atributos`);
      console.log(`[DEBUG] Dados do sistema:`, this.system);
      
      const progressao = this.system.progressao || {};
      console.log(`[DEBUG] Dados da progressão:`, progressao);
      
      const atributosInicializados = progressao.atributos_inicializados || false;
      const pontosIniciais = progressao.pontos_atributo_iniciais || 18;
      const pontosGastosIniciais = progressao.pontos_atributo_gastos_iniciais || 0;
      const pontosPorNivel = progressao.pontos_atributo || 0;
      
      console.log(`[DEBUG] Valores calculados:`, {
        atributosInicializados,
        pontosIniciais,
        pontosGastosIniciais,
        pontosPorNivel,
        pontosDisponiveisIniciais: pontosIniciais - pontosGastosIniciais
      });
      
      const resultado = {
        atributosInicializados,
        pontosDisponiveisIniciais: pontosIniciais - pontosGastosIniciais,
        pontosPorNivel,
        temPontosDisponiveis: (!atributosInicializados && (pontosIniciais - pontosGastosIniciais) > 0) || pontosPorNivel > 0
      };
      
      console.log(`[DEBUG] Resultado final:`, resultado);
      return resultado;
    } catch (error) {
      console.error("Erro ao obter status dos pontos de atributos:", error);
      // Retornar valores padrão em caso de erro
      return {
        atributosInicializados: false,
        pontosDisponiveisIniciais: 18,
        pontosPorNivel: 0,
        temPontosDisponiveis: true
      };
    }
  }

  /**
   * Adiciona um ponto a um atributo específico
   * @param {string} atributo - Nome do atributo (fisico, acao, mental, social)
   * @returns {Promise<boolean>} Se foi possível adicionar o ponto
   */
  async adicionarPontoAtributo(atributo) {
    console.log(`[DEBUG] Tentando adicionar ponto ao atributo: ${atributo}`);
    
    // Verificar se o atributo é válido
    const atributosValidos = ['fisico', 'acao', 'mental', 'social'];
    if (!atributosValidos.includes(atributo)) {
      console.error(`[DEBUG] Atributo inválido: ${atributo}`);
      ui.notifications.error(`Atributo inválido: ${atributo}`);
      return false;
    }
    
    // Garantir que a estrutura de atributos existe
    if (!this.system.atributos) {
      console.log(`[DEBUG] Criando estrutura de atributos`);
      this.system.atributos = {
        fisico: { valor: 0 },
        acao: { valor: 0 },
        mental: { valor: 0 },
        social: { valor: 0 }
      };
    }
    
    // Garantir que o atributo específico existe
    if (!this.system.atributos[atributo]) {
      console.log(`[DEBUG] Criando atributo ${atributo}`);
      this.system.atributos[atributo] = { valor: 0 };
    }
    
    // Garantir que a estrutura de progressão existe
    if (!this.system.progressao) {
      console.log(`[DEBUG] Criando estrutura de progressão`);
      this.system.progressao = {
        pontos_atributo: 0,
        pontos_atributo_iniciais: 18,
        pontos_atributo_gastos_iniciais: 0,
        atributos_inicializados: false,
        habilidades_disponiveis: 0
      };
    }
    
    const statusPontos = this.getStatusPontosAtributos();
    console.log(`[DEBUG] Status dos pontos:`, statusPontos);
    
    const valorAtual = this.system.atributos[atributo]?.valor || 0;
    console.log(`[DEBUG] Valor atual do atributo ${atributo}: ${valorAtual}`);
    
    // Log específico para Mental
    if (atributo === 'mental') {
      console.log(`[DEBUG MENTAL] Valor atual: ${valorAtual}`);
      console.log(`[DEBUG MENTAL] PM atual: ${this.system.recursos?.pm?.valor || 0}`);
      console.log(`[DEBUG MENTAL] PM máximo atual: ${this.system.recursos?.pm?.max || 0}`);
    }
    
    // Verificar se há pontos disponíveis
    if (!statusPontos.temPontosDisponiveis) {
      console.log(`[DEBUG] Não há pontos disponíveis`);
      ui.notifications.warn("Não há pontos de atributo disponíveis.");
      return false;
    }
    
    // Verificar limite máximo
    const limiteMaximo = statusPontos.atributosInicializados ? 18 : 8;
    console.log(`[DEBUG] Limite máximo para ${atributo}: ${limiteMaximo}`);
    
    if (valorAtual >= limiteMaximo) {
      const tipoLimite = statusPontos.atributosInicializados ? "máximo do sistema" : "inicial";
      console.log(`[DEBUG] Atributo ${atributo} já está no limite ${tipoLimite}`);
      ui.notifications.warn(`${game.i18n.localize(`ATRIBUTOS.${atributo.toUpperCase()}`)} já está no limite ${tipoLimite} (${limiteMaximo}).`);
      return false;
    }
    
    // Determinar de onde vem o ponto
    const updateData = {};
    updateData[`system.atributos.${atributo}.valor`] = valorAtual + 1;
    
    // Se for Físico, calcular novo PV máximo
    if (atributo === 'fisico') {
      const novoPvMax = (valorAtual + 1) * 3 + 10;
      const pvAtual = this.system.recursos?.pv?.valor || 0;
      updateData["system.recursos.pv.max"] = novoPvMax;
      
      // Ajustar PV atual se necessário
      if (pvAtual > novoPvMax) {
        updateData["system.recursos.pv.valor"] = novoPvMax;
      }
      
      console.log(`[DEBUG FISICO] Novo PV máximo será: ${novoPvMax}`);
      console.log(`[DEBUG FISICO] PV atual: ${pvAtual}, será ajustado para: ${pvAtual > novoPvMax ? novoPvMax : pvAtual}`);
    }
    
    // Se for Mental, calcular novo PM máximo
    if (atributo === 'mental') {
      const novoPmMax = (valorAtual + 1) * 2 + 5;
      const pmAtual = this.system.recursos?.pm?.valor || 0;
      updateData["system.recursos.pm.max"] = novoPmMax;
      
      // Ajustar PM atual se necessário
      if (pmAtual > novoPmMax) {
        updateData["system.recursos.pm.valor"] = novoPmMax;
      }
      
      console.log(`[DEBUG MENTAL] Novo PM máximo será: ${novoPmMax}`);
      console.log(`[DEBUG MENTAL] PM atual: ${pmAtual}, será ajustado para: ${pmAtual > novoPmMax ? novoPmMax : pmAtual}`);
    }
    
    // Se for Ação, calcular nova defesa
    if (atributo === 'acao') {
      const novaDefesaBase = 10 + (valorAtual + 1);
      const armadura = this.system.recursos?.defesa?.armadura || 0;
      const escudo = this.system.recursos?.defesa?.escudo || 0;
      const outros = this.system.recursos?.defesa?.outros || 0;
      const novaDefesaTotal = novaDefesaBase + armadura + escudo + outros;
      
      updateData["system.recursos.defesa.base"] = novaDefesaBase;
      updateData["system.recursos.defesa.valor"] = novaDefesaTotal;
      
      console.log(`[DEBUG ACAO] Nova defesa base será: ${novaDefesaBase}`);
      console.log(`[DEBUG ACAO] Nova defesa total será: ${novaDefesaTotal}`);
    }
    
    if (!statusPontos.atributosInicializados && statusPontos.pontosDisponiveisIniciais > 0) {
      // Usar pontos iniciais
      const pontosGastosAtuais = this.system.progressao?.pontos_atributo_gastos_iniciais || 0;
      updateData["system.progressao.pontos_atributo_gastos_iniciais"] = pontosGastosAtuais + 1;
      console.log(`[DEBUG] Usando pontos iniciais. Gastos atuais: ${pontosGastosAtuais}, novos gastos: ${pontosGastosAtuais + 1}`);
    } else if (statusPontos.pontosPorNivel > 0) {
      // Usar pontos ganhos por nível
      const pontosAtuais = this.system.progressao?.pontos_atributo || 0;
      updateData["system.progressao.pontos_atributo"] = pontosAtuais - 1;
      console.log(`[DEBUG] Usando pontos por nível. Pontos atuais: ${pontosAtuais}, novos pontos: ${pontosAtuais - 1}`);
    } else {
      console.log(`[DEBUG] Não há pontos disponíveis de nenhum tipo`);
      ui.notifications.warn("Não há pontos de atributo disponíveis.");
      return false;
    }
    
    console.log(`[DEBUG] Dados para atualização:`, updateData);
    
    try {
      await this.update(updateData);
      console.log(`[DEBUG] Atualização bem-sucedida`);
      
      // Log específico para cada atributo após atualização
      if (atributo === 'fisico') {
        console.log(`[DEBUG FISICO] Atualização concluída. Novo valor: ${valorAtual + 1}`);
        console.log(`[DEBUG FISICO] Novo PV máximo: ${(valorAtual + 1) * 3 + 10}`);
      } else if (atributo === 'mental') {
        console.log(`[DEBUG MENTAL] Atualização concluída. Novo valor: ${valorAtual + 1}`);
        console.log(`[DEBUG MENTAL] Novo PM máximo: ${(valorAtual + 1) * 2 + 5}`);
      } else if (atributo === 'acao') {
        console.log(`[DEBUG ACAO] Atualização concluída. Novo valor: ${valorAtual + 1}`);
        console.log(`[DEBUG ACAO] Nova defesa base: ${10 + (valorAtual + 1)}`);
      } else if (atributo === 'social') {
        console.log(`[DEBUG SOCIAL] Atualização concluída. Novo valor: ${valorAtual + 1}`);
      }
      
      ui.notifications.info(`${game.i18n.localize(`ATRIBUTOS.${atributo.toUpperCase()}`)} aumentado para ${valorAtual + 1}.`);
      return true;
    } catch (error) {
      console.error(`[DEBUG] Erro ao atualizar atributo ${atributo}:`, error);
      ui.notifications.error(`Erro ao atualizar atributo ${atributo}: ${error.message}`);
      return false;
    }
  }

  /**
   * Remove um ponto de um atributo específico (apenas durante distribuição inicial)
   * @param {string} atributo - Nome do atributo
   * @returns {Promise<boolean>} Se foi possível remover o ponto
   */
  async removerPontoAtributo(atributo) {
    const statusPontos = this.getStatusPontosAtributos();
    const valorAtual = this.system.atributos[atributo]?.valor || 0;
    
    // Só permitir remoção durante distribuição inicial
    if (statusPontos.atributosInicializados) {
      ui.notifications.warn("Não é possível reduzir atributos após a inicialização.");
      return false;
    }
    
    // Verificar limite mínimo
    if (valorAtual <= 0) {
      ui.notifications.warn(`${game.i18n.localize(`ATRIBUTOS.${atributo.toUpperCase()}`)} já está no valor mínimo (0).`);
      return false;
    }
    
    const updateData = {};
    updateData[`system.atributos.${atributo}.valor`] = valorAtual - 1;
    updateData["system.progressao.pontos_atributo_gastos_iniciais"] = 
      Math.max(0, (this.system.progressao?.pontos_atributo_gastos_iniciais || 0) - 1);
    
    await this.update(updateData);
    ui.notifications.info(`${game.i18n.localize(`ATRIBUTOS.${atributo.toUpperCase()}`)} reduzido para ${valorAtual - 1}.`);
    return true;
  }

  /**
   * Finaliza a distribuição inicial de pontos de atributos
   * @returns {Promise<boolean>} Se foi possível finalizar
   */
  async finalizarDistribuicaoInicial() {
    const statusPontos = this.getStatusPontosAtributos();
    
    if (statusPontos.atributosInicializados) {
      ui.notifications.warn("Os atributos já foram inicializados.");
      return false;
    }
    
    if (statusPontos.pontosDisponiveisIniciais > 0) {
      ui.notifications.warn(`Você ainda tem ${statusPontos.pontosDisponiveisIniciais} pontos para distribuir.`);
      return false;
    }
    
    await this.update({"system.progressao.atributos_inicializados": true});
    ui.notifications.info("Distribuição inicial de atributos finalizada!");
    return true;
  }

  /**
   * Calcula a porcentagem de XP para o próximo nível
   * @returns {number} Porcentagem de 0 a 100
   */
  calcularPorcentagemXP() {
    try {
      // Garantir que estruturas existam
      if (!this.system.experiencia) {
        this.system.experiencia = { atual: 0, necessaria: 10 };
      }
      if (!this.system.nivel) {
        this.system.nivel = 1;
      }
      
      const tabelaXP = [0, 10, 25, 45, 70, 100, 135, 175, 220, 270, 325, 385, 450, 520, 595, 675, 760, 850, 945, 1045];
      const nivelAtual = this.system.nivel || 1;
      const xpAtual = this.system.experiencia.atual || 0;
      
      // Se já está no nível máximo
      if (nivelAtual >= tabelaXP.length - 1) {
        return 100;
      }
      
      // Calcular XP necessário para o próximo nível
      const xpNecessaria = tabelaXP[nivelAtual];
      const xpProximoNivel = tabelaXP[nivelAtual + 1];
      const xpParaProximoNivel = xpProximoNivel - xpNecessaria;
      const xpGanha = xpAtual - xpNecessaria;
      
      if (xpParaProximoNivel <= 0) {
        return 100;
      }
      
      const porcentagem = Math.min(100, Math.max(0, (xpGanha / xpParaProximoNivel) * 100));
      return Math.round(porcentagem);
    } catch (error) {
      console.error("Erro ao calcular porcentagem de XP:", error);
      return 0;
    }
  }

  /**
   * Obtém o XP necessário para o próximo nível
   * @returns {number} XP necessário
   */
  getXPProximoNivel() {
    try {
      const tabelaXP = [0, 10, 25, 45, 70, 100, 135, 175, 220, 270, 325, 385, 450, 520, 595, 675, 760, 850, 945, 1045];
      const nivelAtual = this.system.nivel || 1;
      
      if (nivelAtual >= tabelaXP.length - 1) {
        return this.system.experiencia?.atual || 0;
      }
      
      return tabelaXP[nivelAtual + 1];
    } catch (error) {
      console.error("Erro ao obter XP do próximo nível:", error);
      return 10;
    }
  }

  /**
   * Força a reinicialização dos dados do personagem
   * @returns {Promise<boolean>} Se foi possível reinicializar
   */
  async reinicializarDados() {
    try {
      console.log("=== REINICIALIZANDO DADOS DO PERSONAGEM ===");
      
      const updateData = {
        "system.atributos": {
          fisico: { valor: 0 },
          acao: { valor: 0 },
          mental: { valor: 0 },
          social: { valor: 0 }
        },
        "system.progressao": {
          pontos_atributo: 0,
          pontos_atributo_iniciais: 18,
          pontos_atributo_gastos_iniciais: 0,
          atributos_inicializados: false,
          habilidades_disponiveis: 0
        },
        "system.experiencia": {
          atual: 0,
          necessaria: 10
        },
        "system.nivel": 1,
        "system.recursos": {
          pv: { valor: 10, max: 10 },
          pm: { valor: 5, max: 5 },
          defesa: { valor: 10, base: 10, armadura: 0, escudo: 0, outros: 0 }
        },
        "system.condicoes": {
          ferido: false,
          gravemente_ferido: false,
          inconsciente: false,
          caido: false,
          atordoado: false,
          cego: false,
          surdo: false
        }
      };
      
      await this.update(updateData);
      console.log("Dados reinicializados com sucesso!");
      ui.notifications.info("Dados do personagem reinicializados com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao reinicializar dados:", error);
      ui.notifications.error("Erro ao reinicializar dados: " + error.message);
      return false;
    }
  }

  /**
   * Testa especificamente o atributo Mental para identificar problemas
   * @returns {Object} Resultado do teste
   */
  testarAtributoMental() {
    console.log("=== TESTE ESPECÍFICO DO ATRIBUTO MENTAL ===");
    
    const resultado = {
      valorAtual: this.system.atributos?.mental?.valor || 0,
      pmAtual: this.system.recursos?.pm?.valor || 0,
      pmMaximo: this.system.recursos?.pm?.max || 0,
      progressao: this.system.progressao || {},
      statusPontos: this.getStatusPontosAtributos(),
      podeAdicionar: false,
      limiteMaximo: 0,
      problemas: []
    };
    
    // Verificar se pode adicionar ponto
    const statusPontos = resultado.statusPontos;
    const valorAtual = resultado.valorAtual;
    const limiteMaximo = statusPontos.atributosInicializados ? 18 : 8;
    
    resultado.limiteMaximo = limiteMaximo;
    resultado.podeAdicionar = valorAtual < limiteMaximo && statusPontos.temPontosDisponiveis;
    
    // Verificar problemas específicos
    if (valorAtual >= 5) {
      resultado.problemas.push("Atributo Mental está no nível 5 ou superior - possível área de problema");
    }
    
    if (resultado.pmAtual > resultado.pmMaximo) {
      resultado.problemas.push("PM atual maior que PM máximo - inconsistência detectada");
    }
    
    if (!statusPontos.temPontosDisponiveis) {
      resultado.problemas.push("Não há pontos disponíveis para distribuir");
    }
    
    if (valorAtual >= limiteMaximo) {
      resultado.problemas.push("Atributo já está no limite máximo");
    }
    
    // Simular o que aconteceria se adicionasse um ponto
    if (resultado.podeAdicionar) {
      const novoValor = valorAtual + 1;
      const novoPmMax = novoValor * 2 + 5;
      resultado.simulacao = {
        novoValor: novoValor,
        novoPmMax: novoPmMax,
        pmSeraAjustado: resultado.pmAtual > novoPmMax
      };
    }
    
    console.log("Resultado do teste:", resultado);
    return resultado;
  }

  /**
   * Método de teste para verificar o estado atual dos atributos e pontos
   * @returns {Object} Estado atual do personagem
   */
  testarEstadoAtributos() {
    console.log("=== TESTE DE ESTADO DOS ATRIBUTOS ===");
    console.log("Dados completos do sistema:", this.system);
    console.log("Atributos:", this.system.atributos);
    console.log("Progressão:", this.system.progressao);
    console.log("Experiência:", this.system.experiencia);
    console.log("Nível:", this.system.nivel);
    
    const statusPontos = this.getStatusPontosAtributos();
    console.log("Status dos pontos:", statusPontos);
    
    // Verificar cada atributo individualmente
    const atributos = ['fisico', 'acao', 'mental', 'social'];
    atributos.forEach(atributo => {
      const valor = this.system.atributos[atributo]?.valor || 0;
      const limiteMaximo = statusPontos.atributosInicializados ? 18 : 8;
      const podeAdicionar = valor < limiteMaximo && statusPontos.temPontosDisponiveis;
      
      console.log(`${atributo.toUpperCase()}: valor=${valor}, limite=${limiteMaximo}, podeAdicionar=${podeAdicionar}`);
    });
    
    return {
      atributos: this.system.atributos,
      progressao: this.system.progressao,
      statusPontos: statusPontos
    };
  }

  /**
   * Corrige problemas de inicialização do sistema
   * @returns {Promise<boolean>} Se foi possível corrigir
   */
  async corrigirInicializacao() {
    try {
      const updateData = {};
      let precisaAtualizar = false;

      // Garantir que atributos existam
      if (!this.system.atributos) {
        this.system.atributos = {
          fisico: { valor: 0 },
          acao: { valor: 0 },
          mental: { valor: 0 },
          social: { valor: 0 }
        };
        updateData["system.atributos"] = this.system.atributos;
        precisaAtualizar = true;
      }

      // Garantir que experiência exista
      if (!this.system.experiencia) {
        this.system.experiencia = {
          atual: 0,
          necessaria: 10
        };
        updateData["system.experiencia"] = this.system.experiencia;
        precisaAtualizar = true;
      }

      // Garantir que nível exista
      if (!this.system.nivel) {
        this.system.nivel = 1;
        updateData["system.nivel"] = 1;
        precisaAtualizar = true;
      }

      // Garantir que progressão exista
      if (!this.system.progressao) {
        this.system.progressao = {
          pontos_atributo: 0,
          pontos_atributo_iniciais: 18,
          pontos_atributo_gastos_iniciais: 0,
          atributos_inicializados: false,
          habilidades_disponiveis: 0
        };
        updateData["system.progressao"] = this.system.progressao;
        precisaAtualizar = true;
      }

      // Garantir que recursos existam
      if (!this.system.recursos) {
        this.system.recursos = {
          pv: { valor: 10, max: 10 },
          pm: { valor: 5, max: 5 },
          defesa: { valor: 10, base: 10, armadura: 0, escudo: 0, outros: 0 }
        };
        updateData["system.recursos"] = this.system.recursos;
        precisaAtualizar = true;
      }

      // Garantir que condições existam
      if (!this.system.condicoes) {
        this.system.condicoes = {
          ferido: false,
          gravemente_ferido: false,
          inconsciente: false
        };
        updateData["system.condicoes"] = this.system.condicoes;
        precisaAtualizar = true;
      }

      if (precisaAtualizar) {
        await this.update(updateData);
        ui.notifications.info("Sistema corrigido com sucesso!");
        return true;
      } else {
        ui.notifications.info("Sistema já está correto!");
        return false;
      }
    } catch (error) {
      console.error("Erro ao corrigir inicialização:", error);
      ui.notifications.error("Erro ao corrigir sistema: " + error.message);
      return false;
    }
  }

  /**
   * Método de teste para verificar se o sistema de XP está funcionando
   * @returns {Object} Status do sistema de XP
   */
  testarSistemaXP() {
    console.log("=== Teste do Sistema de XP ===");
    console.log("Estrutura do sistema:", this.system);
    console.log("Experiência:", this.system.experiencia);
    console.log("Nível:", this.system.nivel);
    console.log("Progressão:", this.system.progressao);
    
    return {
      experiencia: this.system.experiencia,
      nivel: this.system.nivel,
      progressao: this.system.progressao,
      atributos: this.system.atributos
    };
  }

  /**
   * Corrige problemas específicos com o atributo Mental
   * @returns {Promise<boolean>} Se foi possível corrigir
   */
  async corrigirAtributoMental() {
    try {
      console.log("=== CORRIGINDO ATRIBUTO MENTAL ===");
      
      const valorMental = this.system.atributos?.mental?.valor || 0;
      const pmAtual = this.system.recursos?.pm?.valor || 0;
      const pmMaximo = this.system.recursos?.pm?.max || 0;
      const pmMaximoCorreto = valorMental * 2 + 5;
      
      console.log(`[CORREÇÃO] Mental: ${valorMental}, PM atual: ${pmAtual}, PM max atual: ${pmMaximo}, PM max correto: ${pmMaximoCorreto}`);
      
      const updateData = {};
      let precisaAtualizar = false;
      
      // Corrigir PM máximo se estiver incorreto
      if (pmMaximo !== pmMaximoCorreto) {
        updateData["system.recursos.pm.max"] = pmMaximoCorreto;
        precisaAtualizar = true;
        console.log(`[CORREÇÃO] Corrigindo PM máximo de ${pmMaximo} para ${pmMaximoCorreto}`);
      }
      
      // Ajustar PM atual se estiver maior que o máximo
      if (pmAtual > pmMaximoCorreto) {
        updateData["system.recursos.pm.valor"] = pmMaximoCorreto;
        precisaAtualizar = true;
        console.log(`[CORREÇÃO] Ajustando PM atual de ${pmAtual} para ${pmMaximoCorreto}`);
      }
      
      // Garantir que a estrutura de atributos existe
      if (!this.system.atributos?.mental) {
        updateData["system.atributos.mental"] = { valor: valorMental };
        precisaAtualizar = true;
        console.log(`[CORREÇÃO] Criando estrutura do atributo Mental`);
      }
      
      if (precisaAtualizar) {
        await this.update(updateData);
        console.log("[CORREÇÃO] Atributo Mental corrigido com sucesso!");
        ui.notifications.info("Atributo Mental corrigido com sucesso!");
        return true;
      } else {
        console.log("[CORREÇÃO] Nenhuma correção necessária para o atributo Mental");
        ui.notifications.info("Atributo Mental está correto!");
        return true;
      }
    } catch (error) {
      console.error("[CORREÇÃO] Erro ao corrigir atributo Mental:", error);
      ui.notifications.error("Erro ao corrigir atributo Mental: " + error.message);
      return false;
    }
  }

  /**
   * Compara o comportamento do Físico vs Mental para identificar diferenças
   * @returns {Object} Comparação entre os atributos
   */
  compararFisicoMental() {
    console.log("=== COMPARAÇÃO FÍSICO VS MENTAL ===");
    
    const fisico = this.system.atributos?.fisico?.valor || 0;
    const mental = this.system.atributos?.mental?.valor || 0;
    const pvAtual = this.system.recursos?.pv?.valor || 0;
    const pvMax = this.system.recursos?.pv?.max || 0;
    const pmAtual = this.system.recursos?.pm?.valor || 0;
    const pmMax = this.system.recursos?.pm?.max || 0;
    
    const pvCalculado = fisico * 3 + 10;
    const pmCalculado = mental * 2 + 5;
    
    const comparacao = {
      fisico: {
        valor: fisico,
        pvAtual: pvAtual,
        pvMax: pvMax,
        pvCalculado: pvCalculado,
        pvConsistente: pvMax === pvCalculado,
        pvAtualValido: pvAtual <= pvMax
      },
      mental: {
        valor: mental,
        pmAtual: pmAtual,
        pmMax: pmMax,
        pmCalculado: pmCalculado,
        pmConsistente: pmMax === pmCalculado,
        pmAtualValido: pmAtual <= pmMax
      },
      problemas: []
    };
    
    // Verificar problemas
    if (!comparacao.fisico.pvConsistente) {
      comparacao.problemas.push(`PV máximo inconsistente: armazenado=${pvMax}, calculado=${pvCalculado}`);
    }
    
    if (!comparacao.fisico.pvAtualValido) {
      comparacao.problemas.push(`PV atual inválido: ${pvAtual} > ${pvMax}`);
    }
    
    if (!comparacao.mental.pmConsistente) {
      comparacao.problemas.push(`PM máximo inconsistente: armazenado=${pmMax}, calculado=${pmCalculado}`);
    }
    
    if (!comparacao.mental.pmAtualValido) {
      comparacao.problemas.push(`PM atual inválido: ${pmAtual} > ${pmMax}`);
    }
    
    console.log("Comparação:", comparacao);
    return comparacao;
  }

} 