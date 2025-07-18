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
    try {
      const context = super.getData();
      const actorData = this.actor.toObject(false);
      
      // Adicionar dados do sistema
      context.system = actorData.system;
      context.flags = actorData.flags;
      
      // Garantir que estrutura básica existe para evitar erros
      if (!context.system.atributos) {
        context.system.atributos = {
          fisico: { valor: 0 },
          acao: { valor: 0 },
          mental: { valor: 0 },
          social: { valor: 0 }
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

      // Inicializar progressão de atributos para compatibilidade
      if (!context.system.progressao) {
        context.system.progressao = {
          pontos_atributo: 0,
          pontos_atributo_iniciais: 18,
          pontos_atributo_gastos_iniciais: 0,
          atributos_inicializados: false,
          habilidades_disponiveis: 0
        };
      } else {
        // Garantir que campos necessários existam
        if (context.system.progressao.pontos_atributo_iniciais === undefined) {
          context.system.progressao.pontos_atributo_iniciais = 18;
        }
        if (context.system.progressao.pontos_atributo_gastos_iniciais === undefined) {
          context.system.progressao.pontos_atributo_gastos_iniciais = 0;
        }
        if (context.system.progressao.atributos_inicializados === undefined) {
          context.system.progressao.atributos_inicializados = false;
        }
      }

      // Inicializar estrutura de equipamentos
      if (!context.system.equipamentos) {
        context.system.equipamentos = {
          equipados: {
            arma_principal: null,
            armadura: null,
            escudo: null
          },
          itens: [],
          dinheiro: {
            ouro: 0,
            prata: 0,
            cobre: 0
          },
          peso_total: 0,
          capacidade_carga: 50
        };
      }

      // Preparar dados de itens para o template
      context.items = this._organizarItens();
      context.equipados = this._obterEquipados();
      context.pesoTotal = this._calcularPesoTotal();
      context.capacidadeCarga = this._calcularCapacidadeCarga();
      context.sobrecarregado = context.pesoTotal > context.capacidadeCarga;

      // Preparar dados de magias para o template
      context.magiasPorEscola = this._organizarMagiasPorEscola();

      // Configurações do sistema
      context.config = CONFIG.clube || {};
      
      // Preparar dados específicos para personagens
      if (this.actor.type === "personagem") {
        await this._getPersonagemData(context);
        await this._prepararDadosEquipamentos(context);
      }
      
      return context;
    } catch (error) {
      console.error("Erro ao preparar dados da ficha:", error);
      ui.notifications.error("Erro ao carregar ficha do personagem. Verifique o console para mais detalhes.");
      
      // Retornar dados mínimos para evitar quebra completa
      return {
        actor: this.actor,
        system: {
          atributos: {
            fisico: { valor: 0 },
            acao: { valor: 0 },
            mental: { valor: 0 },
            social: { valor: 0 }
          },
          recursos: {
            pv: { valor: 19, max: 19 },
            pm: { valor: 11, max: 11 },
            defesa: { valor: 13 }
          },
          progressao: {
            pontos_atributo: 0,
            pontos_atributo_iniciais: 18,
            pontos_atributo_gastos_iniciais: 0,
            atributos_inicializados: false,
            habilidades_disponiveis: 0
          }
        },
        statusPontosAtributos: {
          atributosInicializados: false,
          pontosDisponiveisIniciais: 18,
          pontosPorNivel: 0,
          temPontosDisponiveis: true
        }
      };
    }
  }

  /**
   * Prepara dados específicos para personagens
   * @param {Object} context - Contexto da ficha
   * @returns {Object} Contexto atualizado
   */
  async _getPersonagemData(context) {
    try {
      const system = context.system;
      
      // Adicionar dados de pontos de atributos
      context.statusPontosAtributos = this.actor.getStatusPontosAtributos();
      
      // Tabela de progressão de XP
      const tabelaXP = [0, 10, 25, 45, 70, 100, 135, 175, 220, 270];
      context.proximoNivel = tabelaXP[system.nivel] || (system.nivel * 50);
      
      // Porcentagem de XP para o próximo nível
      const xpAtual = system.experiencia?.atual || 0;
      const xpAnterior = tabelaXP[system.nivel - 1] || 0;
      const xpProximo = context.proximoNivel;
      
      // Calcular porcentagem com proteção contra divisão por zero
      if (xpProximo > xpAnterior) {
        context.porcentagemXP = Math.round(((xpAtual - xpAnterior) / (xpProximo - xpAnterior)) * 100);
      } else {
        context.porcentagemXP = 0;
      }
      
      // Garantir que a porcentagem esteja entre 0 e 100
      context.porcentagemXP = Math.max(0, Math.min(100, context.porcentagemXP));

      // Status de condições
      context.condicoesAtivas = Object.keys(system.condicoes)
        .filter(condicao => system.condicoes[condicao]);

      // Modificadores de condições
      context.modificadoresCondicoes = this._calcularModificadoresCondicoes(system.condicoes);

      // Preparar tabela de progressão para exibição
      context.tabelaProgressao = this._prepararTabelaProgressao();
      context.tabelaProgressaoCompleta = this._prepararTabelaProgressaoCompleta();

      // Preparar dados das habilidades
      await this._prepararDadosHabilidades(context);

      // Preparar dados das magias
      context.magiasPorEscola = this._organizarMagiasPorEscola();
      context.magiasDisponiveisPorEscola = this._organizarMagiasDisponiveisPorEscola();
      context.magiasConhecidas = this.actor.items.filter(item => item.type === 'magia').length;
      context.escolaPrincipal = this._determinarEscolaPrincipal();

      console.log("Dados específicos do personagem preparados com sucesso!");
      return context;
    } catch (error) {
      console.error("Erro ao preparar dados específicos do personagem:", error);
      throw error;
    }
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

  /**
   * Prepara a tabela de progressão para exibição
   * @returns {Array} Array com dados da progressão
   */
  _prepararTabelaProgressao() {
    const tabelaXP = [0, 10, 25, 45, 70, 100, 135, 175, 220, 270, 325, 385, 450, 520, 595, 675, 760, 850, 945, 1045];
    const progressao = [];
    const nivelAtual = this.actor.system.nivel || 1;
    const xpAtual = this.actor.system.experiencia?.atual || 0;

    for (let i = 1; i < Math.min(tabelaXP.length, 11); i++) {
      const xpAnterior = tabelaXP[i - 1] || 0;
      const xpTotal = tabelaXP[i];
      let xpParaSubir;
      
      if (i === nivelAtual) {
        // Para o nível atual, mostrar quanto falta para o próximo
        xpParaSubir = xpTotal - xpAtual;
      } else if (i < nivelAtual) {
        // Para níveis já completados, mostrar "Completo"
        xpParaSubir = "✓";
      } else {
        // Para níveis futuros, mostrar quanto XP é necessário para chegar naquele nível
        xpParaSubir = xpTotal - xpAnterior;
      }
      
      progressao.push({
        numero: i,
        xp_necessario: xpParaSubir,
        xp_total: xpTotal
      });
    }

    return progressao;
  }

  /**
   * Prepara a tabela de progressão completa com benefícios para exibição
   * @returns {Array} Array com dados da progressão incluindo benefícios
   */
  _prepararTabelaProgressaoCompleta() {
    const tabelaXP = [0, 10, 25, 45, 70, 100, 135, 175, 220, 270];
    const beneficiosPorNivel = {
      1: "4 habilidades iniciais",
      2: "+1 habilidade",
      3: "+1 ponto de atributo",
      4: "+1 habilidade", 
      5: "Habilidade especial de classe",
      6: "+1 habilidade",
      7: "+1 ponto de atributo",
      8: "+1 habilidade",
      9: "Habilidade especial de classe",
      10: "Maestria (habilidade única)"
    };
    
    const progressao = [];
    const nivelAtual = this.actor.system.nivel || 1;
    const xpAtual = this.actor.system.experiencia?.atual || 0;

    for (let i = 1; i <= 10; i++) {
      const xpAnterior = tabelaXP[i - 1] || 0;
      const xpTotal = tabelaXP[i];
      let xpParaSubir;
      
      if (i === 1) {
        xpParaSubir = "-";
      } else if (i === nivelAtual) {
        // Para o nível atual, mostrar quanto falta para o próximo
        xpParaSubir = xpTotal - xpAtual;
      } else if (i < nivelAtual) {
        // Para níveis já completados, mostrar "Completo"
        xpParaSubir = "✓";
      } else {
        // Para níveis futuros, mostrar quanto XP é necessário para chegar naquele nível
        xpParaSubir = xpTotal - xpAnterior;
      }
      
      progressao.push({
        numero: i,
        xp_necessario: xpParaSubir,
        xp_total: xpTotal,
        beneficios: beneficiosPorNivel[i] || ""
      });
    }

    return progressao;
  }

  /**
   * Organiza os itens do ator por categoria
   * @returns {Object} Objeto com itens organizados por categoria
   */
  _organizarItens() {
    const itens = {
      armas: [],
      armaduras: [],
      escudos: [],
      equipamentos: [],
      consumiveis: [],
      magias: [],
      habilidades: []
    };

    // Organizar itens do Foundry
    for (let item of this.actor.items) {
      const tipo = item.type || 'equipamentos';
      if (tipo === 'arma') itens.armas.push(item);
      else if (tipo === 'armadura') itens.armaduras.push(item);
      else if (tipo === 'escudo') itens.escudos.push(item);
      else if (tipo === 'consumivel') itens.consumiveis.push(item);
      else if (tipo === 'magia') itens.magias.push(item);
      else if (tipo === 'habilidade') itens.habilidades.push(item);
      else itens.equipamentos.push(item);
    }

    // Adicionar itens simples do sistema (fallback)
    const itensSimples = this.actor.system.equipamentos?.itens || [];
    itensSimples.forEach((item, index) => {
      const itemObj = {
        _id: `simple-${index}`,
        name: item.nome || "Item sem nome",
        img: "icons/svg/item-bag.svg",
        system: {
          quantidade: item.quantidade || 1,
          peso: item.peso || 0,
          equipado: item.equipado || false,
          tipo: item.tipo || 'equipamento'
        },
        isSimple: true,
        simpleIndex: index
      };

      const tipo = item.tipo || 'equipamento';
      if (tipo === 'arma') itens.armas.push(itemObj);
      else if (tipo === 'armadura') itens.armaduras.push(itemObj);
      else if (tipo === 'escudo') itens.escudos.push(itemObj);
      else if (tipo === 'consumivel') itens.consumiveis.push(itemObj);
      else itens.equipamentos.push(itemObj);
    });

    return itens;
  }

  /**
   * Obtém itens atualmente equipados
   * @returns {Object} Objeto com itens equipados por slot
   */
  _obterEquipados() {
    const equipados = {
      arma_principal: null,
      armadura: null,
      escudo: null
    };

    // Verificar itens do Foundry
    for (let item of this.actor.items) {
      if (item.system.equipado) {
        if (item.type === 'arma' && !equipados.arma_principal) {
          equipados.arma_principal = item;
        } else if (item.type === 'armadura' && !equipados.armadura) {
          equipados.armadura = item;
        } else if (item.type === 'escudo' && !equipados.escudo) {
          equipados.escudo = item;
        }
      }
    }

    // Verificar equipados do sistema simples
    const equipadosSimples = this.actor.system.equipamentos?.equipados || {};
    if (equipadosSimples.arma_principal && !equipados.arma_principal) {
      equipados.arma_principal = {
        name: equipadosSimples.arma_principal.nome,
        img: "icons/svg/sword.svg"
      };
    }
    if (equipadosSimples.armadura && !equipados.armadura) {
      equipados.armadura = {
        name: equipadosSimples.armadura.nome,
        img: "icons/svg/armor.svg"
      };
    }
    if (equipadosSimples.escudo && !equipados.escudo) {
      equipados.escudo = {
        name: equipadosSimples.escudo.nome,
        img: "icons/svg/shield.svg"
      };
    }

    return equipados;
  }

  /**
   * Calcula o peso total dos itens
   * @returns {number} Peso total em kg
   */
  _calcularPesoTotal() {
    let pesoTotal = 0;

    // Peso dos itens do Foundry
    for (let item of this.actor.items) {
      const peso = item.system.peso || 0;
      const quantidade = item.system.quantidade || 1;
      pesoTotal += peso * quantidade;
    }

    // Peso dos itens simples
    const itensSimples = this.actor.system.equipamentos?.itens || [];
    itensSimples.forEach(item => {
      const peso = item.peso || 0;
      const quantidade = item.quantidade || 1;
      pesoTotal += peso * quantidade;
    });

    return Math.round(pesoTotal * 10) / 10; // Arredondar para 1 casa decimal
  }

  /**
   * Calcula a capacidade de carga baseada no atributo Físico
   * @returns {number} Capacidade de carga em kg
   */
  _calcularCapacidadeCarga() {
    const fisico = this.actor.system.atributos?.fisico?.valor || 0;
    return Math.max(1, fisico * 5); // 5kg por ponto de Físico (mínimo 1 kg)
  }

  /**
   * Organiza as magias por escola
   * @returns {Object} Objeto com magias organizadas por escola
   */
  _organizarMagiasPorEscola() {
    const escolas = {
      'abjuracao': 'Abjuração',
      'adivinhacao': 'Adivinhação', 
      'conjuracao': 'Conjuração',
      'encantamento': 'Encantamento',
      'evocacao': 'Evocação',
      'ilusao': 'Ilusão',
      'necromancia': 'Necromancia',
      'transmutacao': 'Transmutação'
    };

    const magiasPorEscola = {};
    const pmAtual = this.actor.system.recursos?.pm?.valor || 0;

    for (let item of this.actor.items) {
      if (item.type === 'magia') {
        const escola = item.system.escola || 'evocacao';
        const nomeEscola = escolas[escola] || escolas['evocacao'];
        
        if (!magiasPorEscola[nomeEscola]) {
          magiasPorEscola[nomeEscola] = [];
        }

        // Verificar se pode conjurar (tem PM suficiente)
        const custoMP = item.system.custo_pm || 1;
        item.system.pode_conjurar = pmAtual >= custoMP;

        magiasPorEscola[nomeEscola].push(item);
      }
    }

    // Ordenar magias dentro de cada escola por nível
    Object.keys(magiasPorEscola).forEach(escola => {
      magiasPorEscola[escola].sort((a, b) => {
        const nivelA = a.system.nivel || 1;
        const nivelB = b.system.nivel || 1;
        return nivelA - nivelB;
      });
    });

    return magiasPorEscola;
  }

  /**
   * Organiza as magias disponíveis por escola
   * @returns {Object} Magias organizadas por escola
   */
  _organizarMagiasDisponiveisPorEscola() {
    const escolas = {
      'abjuracao': 'Abjuração',
      'adivinhacao': 'Adivinhação', 
      'conjuracao': 'Conjuração',
      'encantamento': 'Encantamento',
      'evocacao': 'Evocação',
      'ilusao': 'Ilusão',
      'necromancia': 'Necromancia',
      'transmutacao': 'Transmutação'
    };

    // Inicializar magiasDisponiveis com todas as escolas
    const magiasDisponiveis = {};
    Object.values(escolas).forEach(nomeEscola => {
      magiasDisponiveis[nomeEscola] = [];
    });

    // Lista completa de magias disponíveis por escola com todas as informações
    const magiasBasicas = {
      'evocacao': [
        { 
          id: 'bola_fogo', 
          nome: 'Bola de Fogo', 
          nivel: 3, 
          custo_pm: 6, 
          prerequisitos: 'Mental 8',
          alcance: '30m',
          duracao: 'Instantânea',
          descricao: 'Lança uma bola de fogo que causa 3d6 de dano de fogo em uma área de 3m de raio.'
        },
        { 
          id: 'rajada_arcana', 
          nome: 'Rajada Arcana', 
          nivel: 1, 
          custo_pm: 2, 
          prerequisitos: 'Mental 6',
          alcance: '15m',
          duracao: 'Instantânea',
          descricao: 'Dispara uma rajada de energia mágica que causa 1d6 + Mental de dano.'
        },
        { 
          id: 'raio_eletrico', 
          nome: 'Raio Elétrico', 
          nivel: 2, 
          custo_pm: 4, 
          prerequisitos: 'Mental 7',
          alcance: '20m',
          duracao: 'Instantânea',
          descricao: 'Lança um raio elétrico que causa 2d6 de dano elétrico.'
        }
      ],
      'abjuracao': [
        { 
          id: 'escudo_magico', 
          nome: 'Escudo Mágico', 
          nivel: 1, 
          custo_pm: 2, 
          prerequisitos: 'Mental 6',
          alcance: 'Pessoal',
          duracao: '1 cena',
          descricao: 'Cria um escudo mágico que concede +2 à Defesa.'
        },
        { 
          id: 'protecao_elemental', 
          nome: 'Proteção Elemental', 
          nivel: 2, 
          custo_pm: 4, 
          prerequisitos: 'Mental 7',
          alcance: 'Pessoal',
          duracao: '1 hora',
          descricao: 'Concede resistência a um tipo de dano elementar.'
        },
        { 
          id: 'dissipar_magia', 
          nome: 'Dissipar Magia', 
          nivel: 3, 
          custo_pm: 5, 
          prerequisitos: 'Mental 8',
          alcance: '15m',
          duracao: 'Instantânea',
          descricao: 'Cancela uma magia ativa ou reduz seus efeitos.'
        }
      ],
      'transmutacao': [
        { 
          id: 'transformar_objeto', 
          nome: 'Transformar Objeto', 
          nivel: 1, 
          custo_pm: 3, 
          prerequisitos: 'Mental 6',
          alcance: 'Toque',
          duracao: '1 hora',
          descricao: 'Transforma um objeto pequeno em outro objeto similar.'
        },
        { 
          id: 'polimorfar', 
          nome: 'Polimorfar', 
          nivel: 4, 
          custo_pm: 8, 
          prerequisitos: 'Mental 9',
          alcance: '15m',
          duracao: '1 hora',
          descricao: 'Transforma uma criatura em outra forma.'
        },
        { 
          id: 'voar', 
          nome: 'Voo', 
          nivel: 3, 
          custo_pm: 6, 
          prerequisitos: 'Mental 8',
          alcance: 'Pessoal',
          duracao: '10 minutos',
          descricao: 'Concede a capacidade de voar a uma velocidade de 18m.'
        }
      ],
      'ilusao': [
        { 
          id: 'invisibilidade', 
          nome: 'Invisibilidade', 
          nivel: 2, 
          custo_pm: 4, 
          prerequisitos: 'Mental 7',
          alcance: 'Pessoal',
          duracao: '5 minutos',
          descricao: 'Torna o conjurador invisível até que ele ataque ou use uma magia.'
        },
        { 
          id: 'imagem_espelhada', 
          nome: 'Imagem Espelhada', 
          nivel: 1, 
          custo_pm: 2, 
          prerequisitos: 'Mental 6',
          alcance: 'Pessoal',
          duracao: '1 minuto',
          descricao: 'Cria 1d4 imagens ilusórias que confundem ataques.'
        },
        { 
          id: 'sugestao', 
          nome: 'Sugestão', 
          nivel: 2, 
          custo_pm: 4, 
          prerequisitos: 'Mental 7',
          alcance: '15m',
          duracao: '1 hora',
          descricao: 'Influencia uma criatura a seguir uma sugestão razoável.'
        }
      ],
      'adivinhacao': [
        { 
          id: 'detectar_magia', 
          nome: 'Detectar Magia', 
          nivel: 1, 
          custo_pm: 1, 
          prerequisitos: 'Mental 6',
          alcance: '15m',
          duracao: '1 minuto',
          descricao: 'Detecta a presença de magia em uma área.'
        },
        { 
          id: 'adivinhar', 
          nome: 'Adivinhar', 
          nivel: 2, 
          custo_pm: 3, 
          prerequisitos: 'Mental 7',
          alcance: 'Pessoal',
          duracao: 'Instantânea',
          descricao: 'Recebe uma resposta simples a uma pergunta sobre o futuro.'
        },
        { 
          id: 'localizar_objeto', 
          nome: 'Localizar Objeto', 
          nivel: 2, 
          custo_pm: 3, 
          prerequisitos: 'Mental 7',
          alcance: '1km',
          duracao: 'Instantânea',
          descricao: 'Localiza um objeto específico conhecido dentro do alcance.'
        }
      ],
      'necromancia': [
        { 
          id: 'drenar_vida', 
          nome: 'Drenar Vida', 
          nivel: 2, 
          custo_pm: 4, 
          prerequisitos: 'Mental 7',
          alcance: '15m',
          duracao: 'Instantânea',
          descricao: 'Drena a vida de uma criatura, causando dano e curando o conjurador.'
        },
        { 
          id: 'animar_morto', 
          nome: 'Animar Morto', 
          nivel: 3, 
          custo_pm: 6, 
          prerequisitos: 'Mental 8',
          alcance: '15m',
          duracao: 'Permanente',
          descricao: 'Anima um cadáver para servir como servo não-morto.'
        },
        { 
          id: 'medo', 
          nome: 'Medo', 
          nivel: 1, 
          custo_pm: 2, 
          prerequisitos: 'Mental 6',
          alcance: '15m',
          duracao: '1 minuto',
          descricao: 'Inspira medo em uma criatura, fazendo-a fugir.'
        }
      ]
    };

    // Verificar quais magias o personagem já conhece
    const magiasConhecidas = new Set();
    for (let item of this.actor.items) {
      if (item.type === 'magia') {
        magiasConhecidas.add(item.name.toLowerCase());
      }
    }

    // Adicionar magias disponíveis que o personagem não conhece
    Object.keys(magiasBasicas).forEach(escola => {
      const nomeEscola = escolas[escola];
      if (nomeEscola && magiasDisponiveis[nomeEscola]) {
        magiasBasicas[escola].forEach(magia => {
          if (!magiasConhecidas.has(magia.nome.toLowerCase())) {
            // Verificar se o personagem atende aos pré-requisitos
            const mental = this.actor.system.atributos?.mental?.valor || 0;
            const nivel = this.actor.system.nivel || 1;
            
            const prerequisitoMental = parseInt(magia.prerequisitos.match(/Mental (\d+)/)?.[1] || 0);
            
            if (mental >= prerequisitoMental && nivel >= magia.nivel) {
              magiasDisponiveis[nomeEscola].push(magia);
            }
          }
        });
      }
    });

    return magiasDisponiveis;
  }

  /**
   * Determina a escola principal do personagem baseada nas magias conhecidas
   * @returns {string} Nome da escola principal
   */
  _determinarEscolaPrincipal() {
    const escolas = {
      'abjuracao': 'Abjuração',
      'adivinhacao': 'Adivinhação', 
      'conjuracao': 'Conjuração',
      'encantamento': 'Encantamento',
      'evocacao': 'Evocação',
      'ilusao': 'Ilusão',
      'necromancia': 'Necromancia',
      'transmutacao': 'Transmutação'
    };

    const contagemEscolas = {};
    
    for (let item of this.actor.items) {
      if (item.type === 'magia') {
        const escola = item.system.escola || 'evocacao';
        contagemEscolas[escola] = (contagemEscolas[escola] || 0) + 1;
      }
    }

    if (Object.keys(contagemEscolas).length === 0) {
      return 'Nenhuma';
    }

    const escolaPrincipal = Object.keys(contagemEscolas).reduce((a, b) => 
      contagemEscolas[a] > contagemEscolas[b] ? a : b
    );

    return escolas[escolaPrincipal] || 'Evocação';
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

    // Gerenciar pontos de atributos
    html.find(".adicionar-ponto-atributo").click(this._onAdicionarPontoAtributo.bind(this));
    html.find(".remover-ponto-atributo").click(this._onRemoverPontoAtributo.bind(this));
    html.find(".finalizar-distribuicao-inicial").click(this._onFinalizarDistribuicaoInicial.bind(this));

    // Gerenciar recursos (PV/PM)
    html.find(".ajustar-pv").click(this._onAjustarPV.bind(this));
    html.find(".ajustar-pm").click(this._onAjustarPM.bind(this));

    // Gerenciar XP
    html.find(".adicionar-xp").click(this._onAdicionarXP.bind(this));
    html.find(".ajustar-xp").click(this._onAjustarXP.bind(this));

    // Gerenciar habilidades
    html.find(".adicionar-habilidade").click(this._onAdicionarHabilidade.bind(this));
    html.find(".remover-habilidade").click(this._onRemoverHabilidade.bind(this));

    // Gerenciar magias
    html.find(".adicionar-magia").click(this._onAdicionarMagia.bind(this));
    html.find(".remover-magia").click(this._onRemoverMagia.bind(this));
    html.find(".detalhes-magia").click(this._onDetalhesMagia.bind(this));
    html.find(".detalhes-magia-disponivel").click(this._onDetalhesMagiaDisponivel.bind(this));
    html.find(".detalhes-habilidade").click(this._onDetalhesHabilidade.bind(this));
    html.find(".detalhes-habilidade-conhecida").click(this._onDetalhesHabilidadeConhecida.bind(this));
    html.find(".habilidades-filtro").change(this._onFiltrarHabilidades.bind(this));

    // Gerenciar equipamentos
    html.find(".comprar-equipamento").click(this._onComprarEquipamento.bind(this));
    html.find(".detalhes-equipamento").click(this._onDetalhesEquipamento.bind(this));

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

    // Eventos de equipamentos
    html.find(".adicionar-item").click(this._onAdicionarItem.bind(this));
    html.find(".remover-item").click(this._onRemoverItem.bind(this));
    html.find(".equipar-item").click(this._onEquiparItemInventario.bind(this));
    html.find(".desequipar-item").click(this._onDesequiparItemInventario.bind(this));
    html.find(".desequipar").click(this._onDesequiparSlot.bind(this));
    html.find(".editar-item-simples").click(this._onEditarItemSimples.bind(this));
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
    const itemId = element.closest(".magia-item").dataset.itemId;
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
    const itemId = element.closest(".habilidade-item").dataset.itemId;
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
    const itemId = element.closest(".item-inventario").dataset.itemId;
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
    const itemId = element.closest(".item-inventario").dataset.itemId;
    
    // Verificar se é um item simples
    if (itemId.startsWith('simple-')) {
      const index = parseInt(itemId.replace('simple-', ''));
      return this._onEquiparItemInventario({ preventDefault: () => {}, currentTarget: { dataset: { index } } });
    }
    
    // Item do Foundry
    const item = this.actor.items.get(itemId);
    if (item && this.actor.equiparItem) {
      await this.actor.equiparItem(item);
    } else {
      // Fallback para equipar manualmente
      await item.update({ "system.equipado": true });
    }
  }

  /**
   * Desequipa um item
   * @param {Event} event - Evento de clique
   */
  async _onDesequiparItem(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = element.closest(".item-inventario").dataset.itemId;
    
    // Verificar se é um item simples
    if (itemId.startsWith('simple-')) {
      const index = parseInt(itemId.replace('simple-', ''));
      return this._onDesequiparItemInventario({ preventDefault: () => {}, currentTarget: { dataset: { index } } });
    }
    
    // Item do Foundry
    const item = this.actor.items.get(itemId);
    if (item && this.actor.desequiparItem) {
      await this.actor.desequiparItem(item);
    } else {
      // Fallback para desequipar manualmente
      await item.update({ "system.equipado": false });
    }
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
              <input type="number" name="valor" value="${valorAtual}" min="0" max="18" />
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
    
    // Configurar propriedades básicas por tipo
    let systemData = {
      descricao: "",
      quantidade: 1,
      peso: 0,
      preco: 0,
      raridade: "comum",
      equipado: false
    };

    // Propriedades específicas por tipo
    switch (type) {
      case 'arma':
        systemData = {
          ...systemData,
          dano: "1d6",
          alcance: "corpo_a_corpo",
          critico: "20/x2",
          tipo_dano: "cortante",
          propriedades: ""
        };
        break;
      
      case 'armadura':
        systemData = {
          ...systemData,
          protecao: 1,
          max_dex: null,
          penalidade: 0,
          tipo_armadura: "leve"
        };
        break;
      
      case 'escudo':
        systemData = {
          ...systemData,
          bonus_ca: 2,
          penalidade_distancia: 0
        };
        break;
      
      case 'magia':
        systemData = {
          ...systemData,
          nivel: 1,
          custo_pm: 3,
          escola: "evocacao",
          alcance: "30 metros",
          tempo_conjuracao: "1 ação",
          duracao: "Instantâneo",
          area: "Alvo único",
          resistencia: "nenhuma",
          dano: "",
          componentes: {
            verbal: true,
            somatico: true,
            material: false,
            material_descricao: ""
          },
          teste_atributo: "mental",
          nd_base: 9,
          melhora_nivel: false,
          efeito: "",
          niveis_superiores: "",
          efeito_critico: "",
          notas: ""
        };
        break;
      
      case 'consumivel':
        systemData = {
          ...systemData,
          efeito: "Recupera 1d4+1 PV",
          usos: 1
        };
        break;
    }

    // Criar item
    const itemData = {
      name: game.i18n.localize(`EQUIPAMENTOS.${type.toUpperCase()}`),
      type: type,
      system: systemData
    };

    const newItem = await Item.create(itemData, {parent: this.actor});
    return newItem;
  }

  /**
   * Obtém o nome do tipo de item em português
   * @param {string} type - Tipo do item
   * @returns {string} Nome em português
   */
  _getTipoNome(type) {
    const tipos = {
      'arma': 'Arma',
      'armadura': 'Armadura',
      'escudo': 'Escudo',
      'equipamento': 'Equipamento',
      'consumivel': 'Poção',
      'magia': 'Magia',
      'habilidade': 'Habilidade'
    };
    return tipos[type] || 'Item';
  }

  /**
   * Obtém o ícone padrão para o tipo de item
   * @param {string} type - Tipo do item
   * @returns {string} Caminho do ícone
   */
  _getDefaultIcon(type) {
    const icones = {
      'arma': 'icons/weapons/swords/sword-broad-black.webp',
      'armadura': 'icons/equipment/chest/breastplate-metal-gray.webp',
      'escudo': 'icons/equipment/shield/heater-metal-boss-brown.webp',
      'equipamento': 'icons/containers/bags/pack-leather-brown.webp',
      'consumivel': 'icons/consumables/potions/bottle-round-corked-red.webp',
      'magia': 'icons/magic/symbols/runes-star-magenta.webp',
      'habilidade': 'icons/skills/melee/strike-sword-steel-yellow.webp'
    };
    return icones[type] || 'icons/svg/item-bag.svg';
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

  /**
   * Adiciona um novo item ao inventário
   * @param {Event} event - Evento de clique
   */
  async _onAdicionarItem(event) {
    event.preventDefault();
    
    const equipamentos = this.actor.system.equipamentos || {};
    const itens = equipamentos.itens || [];
    
    const novoItem = {
      nome: "Novo Item",
      tipo: "equipamento",
      quantidade: 1,
      peso: 0,
      equipado: false
    };
    
    itens.push(novoItem);
    
    await this.actor.update({
      "system.equipamentos.itens": itens
    });
  }

  /**
   * Remove um item do inventário
   * @param {Event} event - Evento de clique
   */
  async _onRemoverItem(event) {
    event.preventDefault();
    const index = parseInt(event.currentTarget.dataset.index);
    
    const equipamentos = this.actor.system.equipamentos || {};
    const itens = equipamentos.itens || [];
    
    itens.splice(index, 1);
    
    await this.actor.update({
      "system.equipamentos.itens": itens
    });
  }

  /**
   * Equipa um item do inventário
   * @param {Event} event - Evento de clique
   */
  async _onEquiparItemInventario(event) {
    event.preventDefault();
    const index = parseInt(event.currentTarget.dataset.index);
    
    const equipamentos = this.actor.system.equipamentos || {};
    const itens = equipamentos.itens || [];
    const item = itens[index];
    
    if (!item) return;
    
    // Marcar como equipado
    item.equipado = true;
    
    // Se for arma, armadura ou escudo, equipar no slot apropriado
    const equipados = equipamentos.equipados || {};
    
    if (item.tipo === "arma" && !equipados.arma_principal) {
      equipados.arma_principal = {
        nome: item.nome,
        index: index
      };
    } else if (item.tipo === "armadura" && !equipados.armadura) {
      equipados.armadura = {
        nome: item.nome,
        index: index
      };
    } else if (item.tipo === "escudo" && !equipados.escudo) {
      equipados.escudo = {
        nome: item.nome,
        index: index
      };
    }
    
    await this.actor.update({
      "system.equipamentos.itens": itens,
      "system.equipamentos.equipados": equipados
    });
  }

  /**
   * Desequipa um item do inventário
   * @param {Event} event - Evento de clique
   */
  async _onDesequiparItemInventario(event) {
    event.preventDefault();
    const index = parseInt(event.currentTarget.dataset.index);
    
    const equipamentos = this.actor.system.equipamentos || {};
    const itens = equipamentos.itens || [];
    const item = itens[index];
    
    if (!item) return;
    
    // Marcar como não equipado
    item.equipado = false;
    
    // Remover dos slots equipados
    const equipados = equipamentos.equipados || {};
    
    if (equipados.arma_principal && equipados.arma_principal.index === index) {
      equipados.arma_principal = null;
    }
    if (equipados.armadura && equipados.armadura.index === index) {
      equipados.armadura = null;
    }
    if (equipados.escudo && equipados.escudo.index === index) {
      equipados.escudo = null;
    }
    
    await this.actor.update({
      "system.equipamentos.itens": itens,
      "system.equipamentos.equipados": equipados
    });
  }

  /**
   * Desequipa um item de um slot específico
   * @param {Event} event - Evento de clique
   */
  async _onDesequiparSlot(event) {
    event.preventDefault();
    const slot = event.currentTarget.dataset.slot;
    
    const equipamentos = this.actor.system.equipamentos || {};
    const equipados = equipamentos.equipados || {};
    const itens = equipamentos.itens || [];
    
    // Encontrar o item no inventário e desmarcar como equipado
    if (equipados[slot] && equipados[slot].index !== undefined) {
      const item = itens[equipados[slot].index];
      if (item) {
        item.equipado = false;
      }
    }
    
    // Limpar o slot
    equipados[slot] = null;
    
    await this.actor.update({
      "system.equipamentos.itens": itens,
      "system.equipamentos.equipados": equipados
    });
  }

  /**
   * Edita um item simples via dialog
   * @param {Event} event - Evento de clique
   */
  async _onEditarItemSimples(event) {
    event.preventDefault();
    const index = parseInt(event.currentTarget.dataset.index);
    
    const equipamentos = this.actor.system.equipamentos || {};
    const itens = equipamentos.itens || [];
    const item = itens[index];
    
    if (!item) return;

    // Criar dialog de edição
    const novoItem = await new Promise((resolve) => {
      new Dialog({
        title: `Editar: ${item.nome}`,
        content: `
          <form class="item-simples-edit">
            <div class="form-group">
              <label>Nome:</label>
              <input type="text" name="nome" value="${item.nome}" placeholder="Nome do item"/>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Tipo:</label>
                <select name="tipo">
                  <option value="arma" ${item.tipo === 'arma' ? 'selected' : ''}>Arma</option>
                  <option value="armadura" ${item.tipo === 'armadura' ? 'selected' : ''}>Armadura</option>
                  <option value="escudo" ${item.tipo === 'escudo' ? 'selected' : ''}>Escudo</option>
                  <option value="equipamento" ${item.tipo === 'equipamento' ? 'selected' : ''}>Equipamento</option>
                  <option value="consumivel" ${item.tipo === 'consumivel' ? 'selected' : ''}>Consumível</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Quantidade:</label>
                <input type="number" name="quantidade" value="${item.quantidade || 1}" min="1" max="999"/>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Peso (kg):</label>
                <input type="number" name="peso" value="${item.peso || 0}" min="0" step="0.1"/>
              </div>
              
              <div class="form-group">
                <label>Preço (ouro):</label>
                <input type="number" name="preco" value="${item.preco || 0}" min="0"/>
              </div>
            </div>
            
            <div class="form-group">
              <label>Descrição:</label>
              <textarea name="descricao" rows="3" placeholder="Descrição do item">${item.descricao || ''}</textarea>
            </div>
            
            <div class="form-group">
              <label>
                <input type="checkbox" name="equipado" ${item.equipado ? 'checked' : ''}/>
                Item Equipado
              </label>
            </div>
          </form>
          
          <style>
            .item-simples-edit .form-row {
              display: flex;
              gap: 15px;
            }
            .item-simples-edit .form-group {
              flex: 1;
              margin-bottom: 10px;
            }
            .item-simples-edit label {
              display: block;
              font-weight: bold;
              margin-bottom: 5px;
              color: #8B4513;
            }
            .item-simples-edit input, 
            .item-simples-edit select, 
            .item-simples-edit textarea {
              width: 100%;
              border: 1px solid #CD853F;
              border-radius: 4px;
              padding: 6px;
            }
            .item-simples-edit input[type="checkbox"] {
              width: auto;
              margin-right: 8px;
            }
          </style>
        `,
        buttons: {
          save: {
            icon: '<i class="fas fa-save"></i>',
            label: "Salvar",
            callback: (html) => {
              const formData = new FormData(html[0].querySelector("form"));
              resolve({
                nome: formData.get("nome"),
                tipo: formData.get("tipo"),
                quantidade: parseInt(formData.get("quantidade")) || 1,
                peso: parseFloat(formData.get("peso")) || 0,
                preco: parseFloat(formData.get("preco")) || 0,
                descricao: formData.get("descricao"),
                equipado: formData.has("equipado")
              });
            }
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: "Cancelar",
            callback: () => resolve(null)
          }
        },
        default: "save",
        render: (html) => {
          // Focar no campo nome
          html.find('input[name="nome"]').focus().select();
        }
      }).render(true);
    });

    if (novoItem) {
      // Atualizar o item
      itens[index] = { ...item, ...novoItem };
      
      await this.actor.update({
        "system.equipamentos.itens": itens
      });
      
      ui.notifications.info(`Item "${novoItem.nome}" atualizado!`);
    }
  }

  /**
   * Adiciona XP ao personagem
   * @param {Event} event - Evento de clique
   */
  async _onAdicionarXP(event) {
    event.preventDefault();
    
    const dialog = new Dialog({
      title: "Adicionar Experiência",
      content: `
        <form>
          <div class="form-group">
            <label>Quantidade de XP:</label>
            <input type="number" name="quantidade" min="1" value="1" />
          </div>
          <div class="form-group">
            <label>Motivo (opcional):</label>
            <input type="text" name="motivo" placeholder="Ex: Derrotar goblin" />
          </div>
        </form>
      `,
      buttons: {
        add: {
          icon: '<i class="fas fa-plus"></i>',
          label: "Adicionar",
          callback: async (html) => {
            const formData = new FormData(html[0].querySelector("form"));
            const quantidade = parseInt(formData.get("quantidade")) || 1;
            const motivo = formData.get("motivo") || "";
            
            await this.actor.adicionarXP(quantidade);
            
            // Se foi especificado um motivo, enviar para o chat
            if (motivo) {
              const chatData = {
                user: game.user.id,
                speaker: ChatMessage.getSpeaker({actor: this.actor}),
                content: `<div class="xp-award">
                  <p><strong>${this.actor.name}</strong> ganhou <strong>${quantidade} XP</strong></p>
                  <p><em>Motivo: ${motivo}</em></p>
                </div>`,
                type: CONST.CHAT_MESSAGE_TYPES.OTHER
              };
              await ChatMessage.create(chatData);
            }
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: "Cancelar"
        }
      },
      default: "add"
    });

    dialog.render(true);
  }

  /**
   * Ajusta XP do personagem (adicionar, remover, definir)
   * @param {Event} event - Evento de clique
   */
  async _onAjustarXP(event) {
    event.preventDefault();
    
    const xpAtual = this.actor.system.experiencia?.atual || 0;
    
    const dialog = new Dialog({
      title: "Ajustar Experiência",
      content: `
        <form>
          <div class="form-group">
            <label>XP Atual: <strong>${xpAtual}</strong></label>
          </div>
          <div class="form-group">
            <label>Ação:</label>
            <select name="acao">
              <option value="adicionar">Adicionar XP</option>
              <option value="remover">Remover XP</option>
              <option value="definir">Definir XP Total</option>
            </select>
          </div>
          <div class="form-group">
            <label>Quantidade:</label>
            <input type="number" name="quantidade" min="0" value="1" />
          </div>
        </form>
      `,
      buttons: {
        apply: {
          icon: '<i class="fas fa-check"></i>',
          label: "Aplicar",
          callback: async (html) => {
            const formData = new FormData(html[0].querySelector("form"));
            const acao = formData.get("acao");
            const quantidade = parseInt(formData.get("quantidade")) || 0;
            
            switch (acao) {
              case "adicionar":
                await this.actor.adicionarXP(quantidade);
                break;
              case "remover":
                await this.actor.removerXP(quantidade);
                break;
              case "definir":
                await this.actor.definirXP(quantidade);
                break;
            }
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: "Cancelar"
        }
      },
      default: "apply"
    });

    dialog.render(true);
  }

  /**
   * Testa o sistema de XP
   * @param {Event} event - Evento de clique
   */
  async _onTestarXP(event) {
    event.preventDefault();
    
    try {
      const resultado = this.actor.testarSistemaXP();
      
      const dialog = new Dialog({
        title: "Teste do Sistema de XP",
        content: `
          <div style="font-family: monospace; font-size: 12px;">
            <h3>Status do Sistema de XP</h3>
            <p><strong>Experiência:</strong> ${JSON.stringify(resultado.experiencia, null, 2)}</p>
            <p><strong>Nível:</strong> ${resultado.nivel}</p>
            <p><strong>Progressão:</strong> ${JSON.stringify(resultado.progressao, null, 2)}</p>
            <p><strong>Atributos:</strong> ${JSON.stringify(resultado.atributos, null, 2)}</p>
          </div>
        `,
        buttons: {
          close: {
            icon: '<i class="fas fa-times"></i>',
            label: "Fechar"
          }
        },
        default: "close"
      });

      dialog.render(true);
      
      ui.notifications.info("Teste do sistema de XP executado. Verifique o console para mais detalhes.");
    } catch (error) {
      console.error("Erro ao testar sistema de XP:", error);
      ui.notifications.error("Erro ao testar sistema de XP: " + error.message);
    }
  }

  /**
   * Corrige problemas de inicialização do sistema
   * @param {Event} event - Evento de clique
   */
  async _onCorrigirSistema(event) {
    event.preventDefault();
    await this.actor.corrigirInicializacao();
    this.render(true);
  }

  /**
   * Prepara dados das habilidades para exibição
   * @param {Object} context - Contexto da planilha
   */
  async _prepararDadosHabilidades(context) {
    const { SISTEMA } = await import("../helpers/settings.mjs");
    
    // Informações gerais sobre habilidades
    context.habilidadesTotal = Object.keys(this.actor.system.habilidades || {}).length;
    context.pontosHabilidadeDisponiveis = this.actor._calcularPontosHabilidadeDisponiveis();
    
    // Preparar habilidades conhecidas processadas
    context.habilidadesConhecidasProcessadas = this._prepararHabilidadesConhecidas(SISTEMA.habilidades);
    
    // Preparar habilidades disponíveis por categoria (removendo mágicas)
    context.habilidadesCombateDisponiveis = this._prepararHabilidadesCategoria('combate', SISTEMA.habilidades.combate);
    context.habilidadesFurtividadeDisponiveis = this._prepararHabilidadesCategoria('furtividade', SISTEMA.habilidades.furtividade);
    context.habilidadesSociaisDisponiveis = this._prepararHabilidadesCategoria('sociais', SISTEMA.habilidades.sociais);
    context.habilidadesGeraisDisponiveis = this._prepararHabilidadesCategoria('gerais', SISTEMA.habilidades.gerais);
  }

  /**
   * Prepara dados dos equipamentos para exibição
   * @param {Object} context - Contexto da planilha
   */
  async _prepararDadosEquipamentos(context) {
    const { SISTEMA } = await import("../helpers/settings.mjs");
    
    // Preparar equipamentos disponíveis por categoria
    context.equipamentosArmasDisponiveis = this._prepararEquipamentosCategoria('armas', SISTEMA.equipamentos.armas);
    context.equipamentosArmadurasDisponiveis = this._prepararEquipamentosCategoria('armaduras', SISTEMA.equipamentos.armaduras);
    context.equipamentosEscudosDisponiveis = this._prepararEquipamentosCategoria('escudos', SISTEMA.equipamentos.escudos);
    context.equipamentosVarinhasDisponiveis = this._prepararEquipamentosCategoria('varinhas', SISTEMA.equipamentos.varinhas);
    context.equipamentosEquipamentosDisponiveis = this._prepararEquipamentosCategoria('equipamentos', SISTEMA.equipamentos.equipamentos);
    context.equipamentosConsumiveisDisponiveis = this._prepararEquipamentosCategoria('consumiveis', SISTEMA.equipamentos.consumiveis);
  }

  /**
   * Prepara equipamentos disponíveis de uma categoria específica
   * @param {string} categoria - Nome da categoria
   * @param {Object} equipamentosCategoria - Equipamentos da categoria
   * @returns {Object}
   */
  _prepararEquipamentosCategoria(categoria, equipamentosCategoria) {
    const equipamentosDisponiveis = {};
    
    for (const [id, equipamento] of Object.entries(equipamentosCategoria)) {
      // Verificar pré-requisitos
      const atendeRequisitos = this.actor._verificarPreRequisitosEquipamento ? this.actor._verificarPreRequisitosEquipamento(equipamento) : true;
      
      // Localizar nome e descrição
      let nomeLocalizado = game.i18n.localize(equipamento.nome);
      let descricaoLocalizada = game.i18n.localize(equipamento.descricao);
      
      // Fallback para nomes
      if (nomeLocalizado === equipamento.nome || nomeLocalizado.startsWith("EQUIPAMENTOS.")) {
        const nomesLimpos = {
          espadaCurta: "Espada Curta",
          espadaLonga: "Espada Longa",
          machaxo: "Machado",
          arcoCurto: "Arco Curto",
          cajado: "Cajado",
          couro: "Armadura de Couro",
          malha: "Armadura de Malha",
          placa: "Armadura de Placas",
          vestes: "Vestes Mágicas",
          escudoPequeno: "Escudo Pequeno",
          escudoGrande: "Escudo Grande",
          mochila: "Mochila",
          corda: "Corda",
          lampiao: "Lampião",
          kitMedico: "Kit Médico",
          pocaoVida: "Poção de Vida",
          pocaoMana: "Poção de Mana",
          antidoto: "Antídoto"
        };
        nomeLocalizado = nomesLimpos[id] || id.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
      }
      
      // Fallback para descrições
      if (descricaoLocalizada === equipamento.descricao || descricaoLocalizada.startsWith("EQUIPAMENTOS.")) {
        const descricoesBasicas = {
          espadaCurta: "Uma espada curta e ágil, ideal para combate corpo a corpo",
          espadaLonga: "Uma espada longa e versátil, arma clássica dos guerreiros",
          machaxo: "Um machado pesado e poderoso para causar dano devastador",
          arcoCurto: "Um arco curto para ataques à distância",
          cajado: "Um cajado simples, arma básica para magos",
          couro: "Armadura leve feita de couro tratado",
          malha: "Armadura de malha metálica, oferece boa proteção",
          placa: "Armadura pesada de placas metálicas, máxima proteção",
          vestes: "Vestes encantadas que protegem magos",
          escudoPequeno: "Um escudo pequeno e ágil",
          escudoGrande: "Um escudo grande que oferece excelente proteção",
          mochila: "Uma mochila para carregar equipamentos",
          corda: "Uma corda resistente para escaladas e amarrações",
          lampiao: "Um lampião para iluminar áreas escuras",
          kitMedico: "Kit com bandagens e medicamentos básicos",
          pocaoVida: "Poção que restaura pontos de vida",
          pocaoMana: "Poção que restaura pontos de magia",
          antidoto: "Remédio que remove efeitos de veneno"
        };
        descricaoLocalizada = descricoesBasicas[id] || `Equipamento ${nomeLocalizado}`;
      }
      
      equipamentosDisponiveis[id] = {
        ...equipamento,
        nome: nomeLocalizado,
        descricao: descricaoLocalizada,
        atendeRequisitos: atendeRequisitos,
        podeComprar: atendeRequisitos && (this.actor._verificarDinheiroSuficiente ? this.actor._verificarDinheiroSuficiente(equipamento.preco) : true)
      };
    }
    
    return equipamentosDisponiveis;
  }

  /**
   * Prepara habilidades conhecidas com nomes e efeitos corretos
   * @param {Object} sistemaHabilidades - Todas as habilidades do sistema
   * @returns {Object} Habilidades conhecidas processadas
   */
  _prepararHabilidadesConhecidas(sistemaHabilidades) {
    const habilidadesConhecidas = this.actor.system.habilidades || {};
    const habilidadesProcessadas = {};
    
    for (const [id, habilidadeConhecida] of Object.entries(habilidadesConhecidas)) {
      // Buscar dados completos da habilidade no sistema
      let habilidadeCompleta = null;
      for (const [categoria, habilidades] of Object.entries(sistemaHabilidades)) {
        if (habilidades[id]) {
          habilidadeCompleta = habilidades[id];
          break;
        }
      }
      
      if (!habilidadeCompleta) {
        console.warn(`Habilidade ${id} não encontrada no sistema`);
        // Usar dados básicos se não encontrar
        habilidadesProcessadas[id] = {
          nome: id,
          efeito: "Efeito não encontrado",
          categoria: habilidadeConhecida.categoria || "geral"
        };
        continue;
      }
      
      // Aplicar fallback para nomes
      let nome = game.i18n.localize(habilidadeCompleta.nome);
      if (nome === habilidadeCompleta.nome || nome.startsWith("HABILIDADES.")) {
        const nomesLimpos = {
          ataquePoderoso: "Ataque Poderoso",
          defesaAprimorada: "Defesa Aprimorada", 
          especializacaoArma: "Especialização em Arma",
          ataqueDuplo: "Ataque Duplo",
          resistencia: "Resistência",
          liderancaCombate: "Liderança de Combate",
          contraAtaque: "Contra-Ataque",
          berserker: "Berserker",
          rajadaArcana: "Rajada Arcana",
          escudoMagico: "Escudo Mágico",
          misseisMagicos: "Mísseis Mágicos",
          detectarMagia: "Detectar Magia",
          contraMagia: "Contra-Magia",
          bolaFogo: "Bola de Fogo",
          invisibilidade: "Invisibilidade",
          voo: "Voo",
          teletransporte: "Teletransporte",
          curaCompleta: "Cura Completa",
          ataqueFurtivo: "Ataque Furtivo",
          furtividadeAprimorada: "Furtividade Aprimorada",
          desarmarArmadilhas: "Desarmar Armadilhas",
          tiroCerteiro: "Tiro Certeiro",
          escaladaAprimorada: "Escalada Aprimorada",
          passoSombrio: "Passo Sombrio",
          ataqueLetal: "Ataque Letal",
          mestreSombras: "Mestre das Sombras",
          reflexosAprimorados: "Reflexos Aprimorados",
          venenos: "Venenos",
          persuasaoIrresistivel: "Persuasão Irresistível",
          lideranca: "Liderança",
          coletaInformacoes: "Coleta de Informações",
          intimidacao: "Intimidação",
          redeContatos: "Rede de Contatos",
          diplomacia: "Diplomacia",
          inspiracao: "Inspiração",
          comando: "Comando",
          carismaSobrenatural: "Carisma Sobrenatural",
          mestreNegociador: "Mestre Negociador",
          versatilidade: "Versatilidade",
          magiaNatureza: "Magia da Natureza",
          resistenciaAna: "Resistência Anã",
          sorteHalfling: "Sorte Halfling",
          magiaInstavel: "Magia Instável",
          astuciaComercial: "Astúcia Comercial",
          primeirosSocorros: "Primeiros Socorros",
          sobrevivencia: "Sobrevivência",
          criacaoPocoes: "Criação de Poções",
          montaria: "Montaria",
          navegacao: "Navegação",
          idiomas: "Idiomas"
        };
        nome = nomesLimpos[id] || id.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
      }
      
      // Aplicar fallback para efeitos
      let efeito = game.i18n.localize(habilidadeCompleta.efeito);
      if (efeito === habilidadeCompleta.efeito || efeito.startsWith("HABILIDADES.")) {
        const efeitosBasicos = {
          ataquePoderoso: "Adiciona +2 ao dano em ataques corpo a corpo",
          defesaAprimorada: "+1 bônus permanente à Defesa",
          especializacaoArma: "+2 ataque com tipo específico de arma",
          ataqueDuplo: "Dois ataques por turno com -2 cada",
          resistencia: "+2 em testes de resistência física",
          liderancaCombate: "Aliados próximos ganham +1 em ataques",
          contraAtaque: "Ataque gratuito quando inimigo erra",
          berserker: "+3 dano, -2 Defesa por combate",
          rajadaArcana: "Ataque mágico (2d6 + Mental dano)",
          escudoMagico: "+2 Defesa por uma cena (2 PM)",
          misseisMagicos: "3 projéteis automáticos (3 PM)",
          detectarMagia: "Percebe auras mágicas (1 PM)",
          contraMagia: "Cancela magias inimigas (5 PM)",
          bolaFogo: "Área de efeito (6 PM)",
          invisibilidade: "Torna-se invisível (4 PM)",
          voo: "Capacidade de voar (6 PM)",
          teletransporte: "Movimento instantâneo (8 PM)",
          curaCompleta: "Restaura todos os PV (10 PM)",
          ataqueFurtivo: "+3 dano quando ataca pelas costas",
          furtividadeAprimorada: "+2 em testes de furtividade",
          desarmarArmadilhas: "Pode desarmar dispositivos complexos",
          tiroCerteiro: "+2 ataque com armas à distância",
          escaladaAprimorada: "+2 em testes de escalada",
          passoSombrio: "Movimento furtivo rápido",
          ataqueLetal: "Críticos em 11-12 nos dados",
          mestreSombras: "Invisibilidade natural em sombras",
          reflexosAprimorados: "+3 Iniciativa",
          venenos: "Conhecimento e uso de venenos",
          persuasaoIrresistivel: "+2 em testes de persuasão",
          lideranca: "Aliados ganham +1 quando inspirados",
          coletaInformacoes: "+2 para descobrir rumores e segredos",
          intimidacao: "+2 em testes de intimidação",
          redeContatos: "Conhece pessoas úteis em cidades",
          diplomacia: "+3 em negociações formais",
          inspiracao: "Aliados recuperam 1 PM por cena",
          comando: "Pode dar ordens que devem ser obedecidas",
          carismaSobrenatural: "Reroll automático em falhas sociais",
          mestreNegociador: "Pode resolver conflitos impossíveis",
          versatilidade: "Reroll uma vez por sessão",
          magiaNatureza: "Magias menores sem custo PM",
          resistenciaAna: "+2 vs venenos/doenças/magia",
          sorteHalfling: "Força inimigo a rerollar ataque",
          magiaInstavel: "Efeitos mágicos caóticos",
          astuciaComercial: "+2 em comércio e navegação urbana",
          primeirosSocorros: "Cura 1d6 PV uma vez por ferimento",
          sobrevivencia: "+2 em testes de sobrevivência",
          criacaoPocoes: "Pode criar poções básicas",
          montaria: "+2 em testes com animais montados",
          navegacao: "+2 em orientação e mapas",
          idiomas: "Conhece idiomas adicionais"
        };
        efeito = efeitosBasicos[id] || `Efeito especial de ${nome}`;
      }
      
      // Combinar dados processados
      habilidadesProcessadas[id] = {
        nome: nome,
        efeito: efeito,
        categoria: habilidadeConhecida.categoria
      };
    }
    
    return habilidadesProcessadas;
  }

  /**
   * Prepara habilidades disponíveis de uma categoria específica
   * @param {string} categoria - Nome da categoria
   * @param {Object} habilidadesCategoria - Habilidades da categoria
   * @returns {Object}
   */
  _prepararHabilidadesCategoria(categoria, habilidadesCategoria) {
    const habilidadesDisponiveis = {};
    
    for (const [id, habilidade] of Object.entries(habilidadesCategoria)) {
      // Não mostrar se já possui
      if (this.actor.system.habilidades?.[id]) continue;
      
      // Verificar pré-requisitos
      const atendeRequisitos = this.actor._verificarPreRequisitosHabilidade(habilidade);
      
      // Localizar nome e efeito
      let nomeLocalizado = game.i18n.localize(habilidade.nome);
      let efeitoLocalizado = game.i18n.localize(habilidade.efeito);
      
      // Se a localização falhou, criar manualmente baseado no ID
      if (nomeLocalizado === habilidade.nome || nomeLocalizado.startsWith("HABILIDADES.")) {
        // Mapear IDs para nomes limpos
        const nomesLimpos = {
          ataquePoderoso: "Ataque Poderoso",
          defesaAprimorada: "Defesa Aprimorada", 
          especializacaoArma: "Especialização em Arma",
          ataqueDuplo: "Ataque Duplo",
          resistencia: "Resistência",
          liderancaCombate: "Liderança de Combate",
          contraAtaque: "Contra-Ataque",
          berserker: "Berserker",
          rajadaArcana: "Rajada Arcana",
          escudoMagico: "Escudo Mágico",
          misseisMagicos: "Mísseis Mágicos",
          detectarMagia: "Detectar Magia",
          contraMagia: "Contra-Magia",
          bolaFogo: "Bola de Fogo",
          invisibilidade: "Invisibilidade",
          voo: "Voo",
          teletransporte: "Teletransporte",
          curaCompleta: "Cura Completa",
          ataqueFurtivo: "Ataque Furtivo",
          furtividadeAprimorada: "Furtividade Aprimorada",
          desarmarArmadilhas: "Desarmar Armadilhas",
          tiroCerteiro: "Tiro Certeiro",
          escaladaAprimorada: "Escalada Aprimorada",
          passoSombrio: "Passo Sombrio",
          ataqueLetal: "Ataque Letal",
          mestreSombras: "Mestre das Sombras",
          reflexosAprimorados: "Reflexos Aprimorados",
          venenos: "Venenos",
          persuasaoIrresistivel: "Persuasão Irresistível",
          lideranca: "Liderança",
          coletaInformacoes: "Coleta de Informações",
          intimidacao: "Intimidação",
          redeContatos: "Rede de Contatos",
          diplomacia: "Diplomacia",
          inspiracao: "Inspiração",
          comando: "Comando",
          carismaSobrenatural: "Carisma Sobrenatural",
          mestreNegociador: "Mestre Negociador",
          versatilidade: "Versatilidade",
          magiaNatureza: "Magia da Natureza",
          resistenciaAna: "Resistência Anã",
          sorteHalfling: "Sorte Halfling",
          magiaInstavel: "Magia Instável",
          astuciaComercial: "Astúcia Comercial",
          primeirosSocorros: "Primeiros Socorros",
          sobrevivencia: "Sobrevivência",
          criacaoPocoes: "Criação de Poções",
          montaria: "Montaria",
          navegacao: "Navegação",
          idiomas: "Idiomas"
        };
        
        nomeLocalizado = nomesLimpos[id] || id.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
      }
      
      if (efeitoLocalizado === habilidade.efeito || efeitoLocalizado.startsWith("HABILIDADES.")) {
        // Mapear efeitos básicos
        const efeitosBasicos = {
          ataquePoderoso: "Adiciona +2 ao dano em ataques corpo a corpo",
          defesaAprimorada: "+1 bônus permanente à Defesa",
          especializacaoArma: "+2 ataque com tipo específico de arma",
          ataqueDuplo: "Dois ataques por turno com -2 cada",
          resistencia: "+2 em testes de resistência física",
          liderancaCombate: "Aliados próximos ganham +1 em ataques",
          contraAtaque: "Ataque gratuito quando inimigo erra",
          berserker: "+3 dano, -2 Defesa por combate",
          rajadaArcana: "Ataque mágico (2d6 + Mental dano)",
          escudoMagico: "+2 Defesa por uma cena (2 PM)",
          misseisMagicos: "3 projéteis automáticos (3 PM)",
          detectarMagia: "Percebe auras mágicas (1 PM)",
          contraMagia: "Cancela magias inimigas (5 PM)",
          bolaFogo: "Área de efeito (6 PM)",
          invisibilidade: "Torna-se invisível (4 PM)",
          voo: "Capacidade de voar (6 PM)",
          teletransporte: "Movimento instantâneo (8 PM)",
          curaCompleta: "Restaura todos os PV (10 PM)",
          ataqueFurtivo: "+3 dano quando ataca pelas costas",
          furtividadeAprimorada: "+2 em testes de furtividade",
          desarmarArmadilhas: "Pode desarmar dispositivos complexos",
          tiroCerteiro: "+2 ataque com armas à distância",
          escaladaAprimorada: "+2 em testes de escalada",
          passoSombrio: "Movimento furtivo rápido",
          ataqueLetal: "Críticos em 11-12 nos dados",
          mestreSombras: "Invisibilidade natural em sombras",
          reflexosAprimorados: "+3 Iniciativa",
          venenos: "Conhecimento e uso de venenos",
          persuasaoIrresistivel: "+2 em testes de persuasão",
          lideranca: "Aliados ganham +1 quando inspirados",
          coletaInformacoes: "+2 para descobrir rumores e segredos",
          intimidacao: "+2 em testes de intimidação",
          redeContatos: "Conhece pessoas úteis em cidades",
          diplomacia: "+3 em negociações formais",
          inspiracao: "Aliados recuperam 1 PM por cena",
          comando: "Pode dar ordens que devem ser obedecidas",
          carismaSobrenatural: "Reroll automático em falhas sociais",
          mestreNegociador: "Pode resolver conflitos impossíveis",
          versatilidade: "Reroll uma vez por sessão",
          magiaNatureza: "Magias menores sem custo PM",
          resistenciaAna: "+2 vs venenos/doenças/magia",
          sorteHalfling: "Força inimigo a rerollar ataque",
          magiaInstavel: "Efeitos mágicos caóticos",
          astuciaComercial: "+2 em comércio e navegação urbana",
          primeirosSocorros: "Cura 1d6 PV uma vez por ferimento",
          sobrevivencia: "+2 em testes de sobrevivência",
          criacaoPocoes: "Pode criar poções básicas",
          montaria: "+2 em testes com animais montados",
          navegacao: "+2 em orientação e mapas",
          idiomas: "Conhece idiomas adicionais"
        };
        
        efeitoLocalizado = efeitosBasicos[id] || `Efeito especial de ${nomeLocalizado}`;
      }
      
      habilidadesDisponiveis[id] = {
        ...habilidade,
        nome: nomeLocalizado,
        efeito: efeitoLocalizado,
        disponivel: atendeRequisitos,
        motivo: atendeRequisitos ? "" : this._obterMotivoIndisponibilidade(habilidade)
      };
    }
    
    return habilidadesDisponiveis;
  }

  /**
   * Obtém o motivo pelo qual uma habilidade não está disponível
   * @param {Object} habilidade - Dados da habilidade
   * @returns {string}
   */
  _obterMotivoIndisponibilidade(habilidade) {
    const system = this.actor.system;
    
    // Verificar nível
    if (system.nivel < habilidade.nivelMin) {
      return `Nível mínimo: ${habilidade.nivelMin}`;
    }
    
    // Verificar atributos
    if (habilidade.preRequisito) {
      for (const [atributo, valorMinimo] of Object.entries(habilidade.preRequisito)) {
        const valorAtual = system.atributos[atributo]?.valor || 0;
        if (valorAtual < valorMinimo) {
          return `${atributo.charAt(0).toUpperCase() + atributo.slice(1)} mínimo: ${valorMinimo}`;
        }
      }
    }
    
    // Verificar raça
    if (habilidade.raca && system.raca?.nome !== habilidade.raca) {
      return `Restrito a: ${habilidade.raca}`;
    }
    
    return "Pré-requisitos não atendidos";
  }

  /**
   * Gerencia adição de habilidades
   * @param {Event} event - Evento de clique
   */
  async _onAdicionarHabilidade(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const habilidadeId = element.dataset.habilidade;
    const categoria = element.dataset.categoria;
    
    if (!habilidadeId || !categoria) {
      ui.notifications.error("Dados da habilidade inválidos");
      return;
    }

    await this.actor.adicionarHabilidade(habilidadeId, categoria);
  }

  /**
   * Gerencia remoção de habilidades
   * @param {Event} event - Evento de clique
   */
  async _onRemoverHabilidade(event) {
    event.preventDefault();
    
    const element = event.currentTarget;
    const habilidadeId = element.dataset.habilidade;
    
    if (!habilidadeId) {
      ui.notifications.error("ID da habilidade inválido");
      return;
    }

    // Buscar nome da habilidade
    const habilidadeData = this.actor.system.habilidades?.[habilidadeId];
    let nomeHabilidade = "habilidade";
    
    if (habilidadeData) {
      // Usar fallback para nomes em português
      const nomesLimpos = {
        ataquePoderoso: "Ataque Poderoso",
        defesaAprimorada: "Defesa Aprimorada", 
        especializacaoArma: "Especialização em Arma",
        ataqueDuplo: "Ataque Duplo",
        resistencia: "Resistência",
        liderancaCombate: "Liderança de Combate",
        contraAtaque: "Contra-Ataque",
        berserker: "Berserker",
        rajadaArcana: "Rajada Arcana",
        escudoMagico: "Escudo Mágico",
        misseisMagicos: "Mísseis Mágicos",
        detectarMagia: "Detectar Magia",
        contraMagia: "Contra-Magia",
        bolaFogo: "Bola de Fogo",
        invisibilidade: "Invisibilidade",
        voo: "Voo",
        teletransporte: "Teletransporte",
        curaCompleta: "Cura Completa",
        ataqueFurtivo: "Ataque Furtivo",
        furtividadeAprimorada: "Furtividade Aprimorada",
        desarmarArmadilhas: "Desarmar Armadilhas",
        tiroCerteiro: "Tiro Certeiro",
        escaladaAprimorada: "Escalada Aprimorada",
        passoSombrio: "Passo Sombrio",
        ataqueLetal: "Ataque Letal",
        mestreSombras: "Mestre das Sombras",
        reflexosAprimorados: "Reflexos Aprimorados",
        venenos: "Venenos",
        persuasaoIrresistivel: "Persuasão Irresistível",
        lideranca: "Liderança",
        coletaInformacoes: "Coleta de Informações",
        intimidacao: "Intimidação",
        redeContatos: "Rede de Contatos",
        diplomacia: "Diplomacia",
        inspiracao: "Inspiração",
        comando: "Comando",
        carismaSobrenatural: "Carisma Sobrenatural",
        mestreNegociador: "Mestre Negociador",
        versatilidade: "Versatilidade",
        magiaNatureza: "Magia da Natureza",
        resistenciaAna: "Resistência Anã",
        sorteHalfling: "Sorte Halfling",
        magiaInstavel: "Magia Instável",
        astuciaComercial: "Astúcia Comercial",
        primeirosSocorros: "Primeiros Socorros",
        sobrevivencia: "Sobrevivência",
        criacaoPocoes: "Criação de Poções",
        montaria: "Montaria",
        navegacao: "Navegação",
        idiomas: "Idiomas"
      };
      
      nomeHabilidade = nomesLimpos[habilidadeId] || habilidadeData.nome || habilidadeId;
    }

    // Confirmar remoção
    const confirmacao = await Dialog.confirm({
      title: "Remover Habilidade",
      content: `<p>Tem certeza que deseja remover a habilidade <strong>${nomeHabilidade}</strong>?</p>
                <p><em>A habilidade voltará para as habilidades disponíveis.</em></p>`,
      yes: () => true,
      no: () => false
    });

    if (confirmacao) {
      await this.actor.removerHabilidade(habilidadeId);
    }
  }

  /**
   * Filtra habilidades por categoria
   * @param {Event} event - Evento de mudança
   */
  _onFiltrarHabilidades(event) {
    event.preventDefault();
    const filtro = event.currentTarget.value;
    const habilidadesDisponiveis = this.element.find('.habilidades-disponiveis');
    const categorias = habilidadesDisponiveis.find('.categoria-section');
    
    categorias.each((i, categoria) => {
      const categoriaData = categoria.dataset.categoria;
      if (filtro === 'todas' || filtro === categoriaData) {
        categoria.style.display = 'block';
      } else {
        categoria.style.display = 'none';
      }
    });
  }

  /**
   * Mostra detalhes de uma habilidade
   * @param {Event} event - Evento de clique
   */
  async _onDetalhesHabilidade(event) {
    event.preventDefault();
    
    const element = event.currentTarget;
    const habilidadeId = element.dataset.habilidade;
    const categoria = element.dataset.categoria;
    
    if (!habilidadeId || !categoria) {
      ui.notifications.error("Dados da habilidade inválidos");
      return;
    }

    const { SISTEMA } = await import("../helpers/settings.mjs");
    const habilidadeData = SISTEMA.habilidades[categoria]?.[habilidadeId];
    
    if (!habilidadeData) {
      ui.notifications.error("Habilidade não encontrada");
      return;
    }

    // Preparar informações da habilidade
    let nome = game.i18n.localize(habilidadeData.nome);
    let efeito = game.i18n.localize(habilidadeData.efeito);
    
    // Usar fallback se localização falhar
    if (nome === habilidadeData.nome || nome.startsWith("HABILIDADES.")) {
      const nomesLimpos = {
        ataquePoderoso: "Ataque Poderoso",
        defesaAprimorada: "Defesa Aprimorada", 
        especializacaoArma: "Especialização em Arma",
        ataqueDuplo: "Ataque Duplo",
        resistencia: "Resistência",
        liderancaCombate: "Liderança de Combate",
        contraAtaque: "Contra-Ataque",
        berserker: "Berserker",
        rajadaArcana: "Rajada Arcana",
        escudoMagico: "Escudo Mágico",
        misseisMagicos: "Mísseis Mágicos",
        detectarMagia: "Detectar Magia",
        contraMagia: "Contra-Magia",
        bolaFogo: "Bola de Fogo",
        invisibilidade: "Invisibilidade",
        voo: "Voo",
        teletransporte: "Teletransporte",
        curaCompleta: "Cura Completa",
        ataqueFurtivo: "Ataque Furtivo",
        furtividadeAprimorada: "Furtividade Aprimorada",
        desarmarArmadilhas: "Desarmar Armadilhas",
        tiroCerteiro: "Tiro Certeiro",
        escaladaAprimorada: "Escalada Aprimorada",
        passoSombrio: "Passo Sombrio",
        ataqueLetal: "Ataque Letal",
        mestreSombras: "Mestre das Sombras",
        reflexosAprimorados: "Reflexos Aprimorados",
        venenos: "Venenos",
        persuasaoIrresistivel: "Persuasão Irresistível",
        lideranca: "Liderança",
        coletaInformacoes: "Coleta de Informações",
        intimidacao: "Intimidação",
        redeContatos: "Rede de Contatos",
        diplomacia: "Diplomacia",
        inspiracao: "Inspiração",
        comando: "Comando",
        carismaSobrenatural: "Carisma Sobrenatural",
        mestreNegociador: "Mestre Negociador",
        versatilidade: "Versatilidade",
        magiaNatureza: "Magia da Natureza",
        resistenciaAna: "Resistência Anã",
        sorteHalfling: "Sorte Halfling",
        magiaInstavel: "Magia Instável",
        astuciaComercial: "Astúcia Comercial",
        primeirosSocorros: "Primeiros Socorros",
        sobrevivencia: "Sobrevivência",
        criacaoPocoes: "Criação de Poções",
        montaria: "Montaria",
        navegacao: "Navegação",
        idiomas: "Idiomas"
      };
      nome = nomesLimpos[habilidadeId] || habilidadeId;
    }
    
    if (efeito === habilidadeData.efeito || efeito.startsWith("HABILIDADES.")) {
      const efeitosBasicos = {
        ataquePoderoso: "Adiciona +2 ao dano em ataques corpo a corpo",
        defesaAprimorada: "+1 bônus permanente à Defesa",
        especializacaoArma: "+2 ataque com tipo específico de arma",
        ataqueDuplo: "Dois ataques por turno com -2 cada",
        resistencia: "+2 em testes de resistência física",
        liderancaCombate: "Aliados próximos ganham +1 em ataques",
        contraAtaque: "Ataque gratuito quando inimigo erra",
        berserker: "+3 dano, -2 Defesa por combate",
        rajadaArcana: "Ataque mágico (2d6 + Mental dano)",
        escudoMagico: "+2 Defesa por uma cena (2 PM)",
        misseisMagicos: "3 projéteis automáticos (3 PM)",
        detectarMagia: "Percebe auras mágicas (1 PM)",
        contraMagia: "Cancela magias inimigas (5 PM)",
        bolaFogo: "Área de efeito (6 PM)",
        invisibilidade: "Torna-se invisível (4 PM)",
        voo: "Capacidade de voar (6 PM)",
        teletransporte: "Movimento instantâneo (8 PM)",
        curaCompleta: "Restaura todos os PV (10 PM)",
        ataqueFurtivo: "+3 dano quando ataca pelas costas",
        furtividadeAprimorada: "+2 em testes de furtividade",
        desarmarArmadilhas: "Pode desarmar dispositivos complexos",
        tiroCerteiro: "+2 ataque com armas à distância",
        escaladaAprimorada: "+2 em testes de escalada",
        passoSombrio: "Movimento furtivo rápido",
        ataqueLetal: "Críticos em 11-12 nos dados",
        mestreSombras: "Invisibilidade natural em sombras",
        reflexosAprimorados: "+3 Iniciativa",
        venenos: "Conhecimento e uso de venenos",
        persuasaoIrresistivel: "+2 em testes de persuasão",
        lideranca: "Aliados ganham +1 quando inspirados",
        coletaInformacoes: "+2 para descobrir rumores e segredos",
        intimidacao: "+2 em testes de intimidação",
        redeContatos: "Conhece pessoas úteis em cidades",
        diplomacia: "+3 em negociações formais",
        inspiracao: "Aliados recuperam 1 PM por cena",
        comando: "Pode dar ordens que devem ser obedecidas",
        carismaSobrenatural: "Reroll automático em falhas sociais",
        mestreNegociador: "Pode resolver conflitos impossíveis",
        versatilidade: "Reroll uma vez por sessão",
        magiaNatureza: "Magias menores sem custo PM",
        resistenciaAna: "+2 vs venenos/doenças/magia",
        sorteHalfling: "Força inimigo a rerollar ataque",
        magiaInstavel: "Efeitos mágicos caóticos",
        astuciaComercial: "+2 em comércio e navegação urbana",
        primeirosSocorros: "Cura 1d6 PV uma vez por ferimento",
        sobrevivencia: "+2 em testes de sobrevivência",
        criacaoPocoes: "Pode criar poções básicas",
        montaria: "+2 em testes com animais montados",
        navegacao: "+2 em orientação e mapas",
        idiomas: "Conhece idiomas adicionais"
      };
      efeito = efeitosBasicos[habilidadeId] || `Efeito especial de ${nome}`;
    }
    const nivelMin = habilidadeData.nivelMin;
    const preRequisitos = habilidadeData.preRequisito || {};
    const classesSugeridas = habilidadeData.classesSugeridas || [];
    const raca = habilidadeData.raca;
    
    // Verificar se atende pré-requisitos
    const atendeRequisitos = this.actor._verificarPreRequisitosHabilidade ? this.actor._verificarPreRequisitosHabilidade(habilidadeData) : true;
    
    // Montar lista de pré-requisitos
    let preReqText = "";
    if (Object.keys(preRequisitos).length > 0) {
      const reqList = Object.entries(preRequisitos).map(([attr, valor]) => 
        `${attr.charAt(0).toUpperCase() + attr.slice(1)}: ${valor}`
      );
      preReqText = reqList.join(", ");
    } else {
      preReqText = "Nenhum";
    }
    
    // Cor baseada em se atende requisitos
    const statusColor = atendeRequisitos ? "#28a745" : "#dc3545";
    const statusText = atendeRequisitos ? "✓ Requisitos atendidos" : "✗ Requisitos não atendidos";
    
    // Criar conteúdo do diálogo
    const content = `
      <div class="habilidade-detalhes">
        <h2 style="color: #8B4513; margin-bottom: 15px;">${nome}</h2>
        
        <div class="habilidade-info-grid">
          <div class="info-item">
            <strong>Categoria:</strong> ${categoria.charAt(0).toUpperCase() + categoria.slice(1)}
          </div>
          
          <div class="info-item">
            <strong>Nível Mínimo:</strong> ${nivelMin}
          </div>
          
          <div class="info-item">
            <strong>Pré-requisitos:</strong> ${preReqText}
          </div>
          
          ${raca ? `<div class="info-item"><strong>Restrita à raça:</strong> ${raca.charAt(0).toUpperCase() + raca.slice(1)}</div>` : ""}
          
          ${classesSugeridas.length > 0 ? `<div class="info-item"><strong>Classes sugeridas:</strong> ${classesSugeridas.join(", ")}</div>` : ""}
          
          <div class="info-item" style="color: ${statusColor};">
            <strong>${statusText}</strong>
          </div>
        </div>
        
        <div style="margin-top: 20px;">
          <h3 style="color: #D2691E;">Efeito:</h3>
          <p style="background: #f8f9fa; padding: 10px; border-radius: 5px; border-left: 4px solid #D2691E;">
            ${efeito}
          </p>
        </div>
      </div>
    `;

    // Mostrar diálogo
    const dialog = new Dialog({
      title: `Detalhes: ${nome}`,
      content: content,
      buttons: {
        adicionar: {
          icon: '<i class="fas fa-plus"></i>',
          label: "Adicionar Habilidade",
          condition: atendeRequisitos && (this.actor._calcularPontosHabilidadeDisponiveis ? this.actor._calcularPontosHabilidadeDisponiveis() > 0 : true) && !this.actor.system.habilidades?.[habilidadeId],
          callback: async () => {
            await this.actor.adicionarHabilidade(habilidadeId, categoria);
          }
        },
        fechar: {
          icon: '<i class="fas fa-times"></i>',
          label: "Fechar"
        }
      },
      default: "fechar"
    });

    dialog.render(true);
  }

  /**
   * Mostrar detalhes de uma habilidade conhecida
   * @param {Event} event - Evento de clique
   */
  async _onDetalhesHabilidadeConhecida(event) {
    event.preventDefault();
    const habilidadeId = event.currentTarget.dataset.habilidade;
    
    const { SISTEMA } = await import("../helpers/settings.mjs");
    
    // Buscar dados da habilidade
    let habilidadeData = null;
    for (const [categoria, habilidades] of Object.entries(SISTEMA.habilidades)) {
      if (habilidades[habilidadeId]) {
        habilidadeData = habilidades[habilidadeId];
        break;
      }
    }
    
    if (!habilidadeData) {
      ui.notifications.error("Habilidade não encontrada");
      return;
    }
    
    // Localizar nome e efeito
    let nome = game.i18n.localize(habilidadeData.nome);
    let efeito = game.i18n.localize(habilidadeData.efeito);
    
    // Fallback para nomes
    if (nome === habilidadeData.nome || nome.startsWith("HABILIDADES.")) {
      const nomesLimpos = {
        ataquePoderoso: "Ataque Poderoso",
        defesaAprimorada: "Defesa Aprimorada", 
        especializacaoArma: "Especialização em Arma",
        ataqueDuplo: "Ataque Duplo",
        resistencia: "Resistência",
        liderancaCombate: "Liderança de Combate",
        contraAtaque: "Contra-Ataque",
        berserker: "Berserker",
        rajadaArcana: "Rajada Arcana",
        escudoMagico: "Escudo Mágico",
        misseisMagicos: "Mísseis Mágicos",
        detectarMagia: "Detectar Magia",
        contraMagia: "Contra-Magia",
        bolaFogo: "Bola de Fogo",
        invisibilidade: "Invisibilidade",
        voo: "Voo",
        teletransporte: "Teletransporte",
        curaCompleta: "Cura Completa",
        ataqueFurtivo: "Ataque Furtivo",
        furtividadeAprimorada: "Furtividade Aprimorada",
        desarmarArmadilhas: "Desarmar Armadilhas",
        tiroCerteiro: "Tiro Certeiro",
        escaladaAprimorada: "Escalada Aprimorada",
        passoSombrio: "Passo Sombrio",
        ataqueLetal: "Ataque Letal",
        mestreSombras: "Mestre das Sombras",
        reflexosAprimorados: "Reflexos Aprimorados",
        venenos: "Venenos",
        persuasaoIrresistivel: "Persuasão Irresistível",
        lideranca: "Liderança",
        coletaInformacoes: "Coleta de Informações",
        intimidacao: "Intimidação",
        redeContatos: "Rede de Contatos",
        diplomacia: "Diplomacia",
        inspiracao: "Inspiração",
        comando: "Comando",
        carismaSobrenatural: "Carisma Sobrenatural",
        mestreNegociador: "Mestre Negociador",
        versatilidade: "Versatilidade",
        magiaNatureza: "Magia da Natureza",
        resistenciaAna: "Resistência Anã",
        sorteHalfling: "Sorte Halfling",
        magiaInstavel: "Magia Instável",
        astuciaComercial: "Astúcia Comercial",
        primeirosSocorros: "Primeiros Socorros",
        sobrevivencia: "Sobrevivência",
        criacaoPocoes: "Criação de Poções",
        montaria: "Montaria",
        navegacao: "Navegação",
        idiomas: "Idiomas"
      };
      nome = nomesLimpos[habilidadeId] || id.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
    }
    
    // Fallback para efeitos
    if (efeito === habilidadeData.efeito || efeito.startsWith("HABILIDADES.")) {
      const efeitosBasicos = {
        ataquePoderoso: "Adiciona +2 ao dano em ataques corpo a corpo",
        defesaAprimorada: "+1 bônus permanente à Defesa",
        especializacaoArma: "+2 ataque com tipo específico de arma",
        ataqueDuplo: "Dois ataques por turno com -2 cada",
        resistencia: "+2 em testes de resistência física",
        liderancaCombate: "Aliados próximos ganham +1 em ataques",
        contraAtaque: "Ataque gratuito quando inimigo erra",
        berserker: "+3 dano, -2 Defesa por combate",
        rajadaArcana: "Ataque mágico (2d6 + Mental dano)",
        escudoMagico: "+2 Defesa por uma cena (2 PM)",
        misseisMagicos: "3 projéteis automáticos (3 PM)",
        detectarMagia: "Percebe auras mágicas (1 PM)",
        contraMagia: "Cancela magias inimigas (5 PM)",
        bolaFogo: "Área de efeito (6 PM)",
        invisibilidade: "Torna-se invisível (4 PM)",
        voo: "Capacidade de voar (6 PM)",
        teletransporte: "Movimento instantâneo (8 PM)",
        curaCompleta: "Restaura todos os PV (10 PM)",
        ataqueFurtivo: "+3 dano quando ataca pelas costas",
        furtividadeAprimorada: "+2 em testes de furtividade",
        desarmarArmadilhas: "Pode desarmar dispositivos complexos",
        tiroCerteiro: "+2 ataque com armas à distância",
        escaladaAprimorada: "+2 em testes de escalada",
        passoSombrio: "Pode se mover silenciosamente",
        ataqueLetal: "Ataques críticos causam dano extra",
        mestreSombras: "Pode se esconder em sombras",
        reflexosAprimorados: "+2 em testes de reflexos",
        venenos: "Conhecimento e uso de venenos",
        persuasaoIrresistivel: "+2 em testes de persuasão",
        lideranca: "Aliados ganham +1 quando inspirados",
        coletaInformacoes: "+2 para descobrir rumores e segredos",
        intimidacao: "+2 em testes de intimidação",
        redeContatos: "Conhece pessoas úteis em cidades",
        diplomacia: "+3 em negociações formais",
        inspiracao: "Aliados recuperam 1 PM por cena",
        comando: "Pode dar ordens que devem ser obedecidas",
        carismaSobrenatural: "Reroll automático em falhas sociais",
        mestreNegociador: "Pode resolver conflitos impossíveis",
        versatilidade: "Reroll uma vez por sessão",
        magiaNatureza: "Magias menores sem custo PM",
        resistenciaAna: "+2 vs venenos/doenças/magia",
        sorteHalfling: "Força inimigo a rerollar ataque",
        magiaInstavel: "Efeitos mágicos caóticos",
        astuciaComercial: "+2 em comércio e navegação urbana",
        primeirosSocorros: "Cura 1d6 PV uma vez por ferimento",
        sobrevivencia: "+2 em testes de sobrevivência",
        criacaoPocoes: "Pode criar poções básicas",
        montaria: "+2 em testes com animais montados",
        navegacao: "+2 em orientação e mapas",
        idiomas: "Conhece idiomas adicionais"
      };
      efeito = efeitosBasicos[habilidadeId] || `Efeito especial de ${nome}`;
    }
    const nivelMin = habilidadeData.nivelMin;
    const preRequisitos = habilidadeData.preRequisito || {};
    const classesSugeridas = habilidadeData.classesSugeridas || [];
    const raca = habilidadeData.raca;
    
    // Verificar se atende pré-requisitos
    const atendeRequisitos = this.actor._verificarPreRequisitosHabilidade ? this.actor._verificarPreRequisitosHabilidade(habilidadeData) : true;
    
    // Montar lista de pré-requisitos
    let preReqText = "";
    if (Object.keys(preRequisitos).length > 0) {
      const preReqList = Object.entries(preRequisitos).map(([attr, valor]) => 
        `${game.i18n.localize(`ATRIBUTOS.${attr.toUpperCase()}`)} ${valor}`
      );
      preReqText = preReqList.join(", ");
    }
    
    // Montar lista de classes sugeridas
    let classesText = "";
    if (classesSugeridas.length > 0 && !classesSugeridas.includes("todas")) {
      const classesList = classesSugeridas.map(classe => 
        game.i18n.localize(`CLASSES.${classe.toUpperCase()}`)
      );
      classesText = classesList.join(", ");
    }
    
    // Mostrar dialog com detalhes
    new Dialog({
      title: `Detalhes: ${nome}`,
      content: `
        <div class="habilidade-detalhes">
          <p><strong>Efeito:</strong> ${efeito}</p>
          <p><strong>Nível Mínimo:</strong> ${nivelMin}</p>
          ${preReqText ? `<p><strong>Pré-requisitos:</strong> ${preReqText}</p>` : ''}
          ${classesText ? `<p><strong>Classes Sugeridas:</strong> ${classesText}</p>` : ''}
          ${raca ? `<p><strong>Raça:</strong> ${game.i18n.localize(`RACAS.${raca.toUpperCase()}`)}</p>` : ''}
          <p><strong>Nível Adquirido:</strong> ${this.actor.system.habilidades[habilidadeId].nivelAdquirido}</p>
        </div>
        
        <style>
          .habilidade-detalhes p {
            margin: 8px 0;
            line-height: 1.4;
          }
          .habilidade-detalhes strong {
            color: #8B4513;
          }
        </style>
      `,
      buttons: {
        close: {
          icon: '<i class="fas fa-times"></i>',
          label: "Fechar",
          callback: () => {}
        }
      },
      default: "close"
    }).render(true);
  }

  /**
   * Compra um equipamento
   * @param {Event} event - Evento de clique
   */
  async _onComprarEquipamento(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const equipamentoId = element.dataset.equipamento;
    const categoria = element.dataset.categoria;
    
    await this.actor.comprarEquipamento(equipamentoId, categoria);
  }

  /**
   * Mostra detalhes de um equipamento
   * @param {Event} event - Evento de clique
   */
  async _onDetalhesEquipamento(event) {
    event.preventDefault();
    const equipamentoId = event.currentTarget.dataset.equipamento;
    const categoria = event.currentTarget.dataset.categoria;
    
    const { SISTEMA } = await import("../helpers/settings.mjs");
    
    // Buscar dados do equipamento
    const equipamentoData = SISTEMA.equipamentos[categoria]?.[equipamentoId];
    
    if (!equipamentoData) {
      ui.notifications.error("Equipamento não encontrado");
      return;
    }
    
    // Localizar nome e descrição
    let nome = game.i18n.localize(equipamentoData.nome);
    let descricao = game.i18n.localize(equipamentoData.descricao);
    
    // Fallback para nomes
    if (nome === equipamentoData.nome || nome.startsWith("EQUIPAMENTOS.")) {
      const nomesLimpos = {
        espadaCurta: "Espada Curta",
        espadaLonga: "Espada Longa",
        machaxo: "Machado",
        arcoCurto: "Arco Curto",
        cajado: "Cajado",
        couro: "Armadura de Couro",
        malha: "Armadura de Malha",
        placa: "Armadura de Placas",
        vestes: "Vestes Mágicas",
        escudoPequeno: "Escudo Pequeno",
        escudoGrande: "Escudo Grande",
        mochila: "Mochila",
        corda: "Corda",
        lampiao: "Lampião",
        kitMedico: "Kit Médico",
        pocaoVida: "Poção de Vida",
        pocaoMana: "Poção de Mana",
        antidoto: "Antídoto"
      };
      nome = nomesLimpos[equipamentoId] || equipamentoId.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
    }
    
    // Fallback para descrições
    if (descricao === equipamentoData.descricao || descricao.startsWith("EQUIPAMENTOS.")) {
      const descricoesBasicas = {
        espadaCurta: "Uma espada curta e ágil, ideal para combate corpo a corpo",
        espadaLonga: "Uma espada longa e versátil, arma clássica dos guerreiros",
        machaxo: "Um machado pesado e poderoso para causar dano devastador",
        arcoCurto: "Um arco curto para ataques à distância",
        cajado: "Um cajado simples, arma básica para magos",
        couro: "Armadura leve feita de couro tratado",
        malha: "Armadura de malha metálica, oferece boa proteção",
        placa: "Armadura pesada de placas metálicas, máxima proteção",
        vestes: "Vestes encantadas que protegem magos",
        escudoPequeno: "Um escudo pequeno e ágil",
        escudoGrande: "Um escudo grande que oferece excelente proteção",
        mochila: "Uma mochila para carregar equipamentos",
        corda: "Uma corda resistente para escaladas e amarrações",
        lampiao: "Um lampião para iluminar áreas escuras",
        kitMedico: "Kit com bandagens e medicamentos básicos",
        pocaoVida: "Poção que restaura pontos de vida",
        pocaoMana: "Poção que restaura pontos de magia",
        antidoto: "Remédio que remove efeitos de veneno"
      };
      descricao = descricoesBasicas[equipamentoId] || `Equipamento ${nome}`;
    }
    
    const nivelMin = equipamentoData.nivelMin;
    const preRequisitos = equipamentoData.preRequisito || {};
    const classesSugeridas = equipamentoData.classesSugeridas || [];
    const preco = equipamentoData.preco;
    const peso = equipamentoData.peso;
    
    // Verificar se atende pré-requisitos
    const atendeRequisitos = this.actor._verificarPreRequisitosEquipamento ? this.actor._verificarPreRequisitosEquipamento(equipamentoData) : true;
    const podeComprar = atendeRequisitos && (this.actor._verificarDinheiroSuficiente ? this.actor._verificarDinheiroSuficiente(preco) : true);
    
    // Montar lista de pré-requisitos
    let preReqText = "";
    if (Object.keys(preRequisitos).length > 0) {
      const preReqList = Object.entries(preRequisitos).map(([attr, valor]) => 
        `${game.i18n.localize(`ATRIBUTOS.${attr.toUpperCase()}`)} ${valor}`
      );
      preReqText = preReqList.join(", ");
    }
    
    // Montar lista de classes sugeridas
    let classesText = "";
    if (classesSugeridas.length > 0 && !classesSugeridas.includes("todas")) {
      const classesList = classesSugeridas.map(classe => 
        game.i18n.localize(`CLASSES.${classe.toUpperCase()}`)
      );
      classesText = classesList.join(", ");
    }
    
    // Informações específicas por tipo
    let infoEspecifica = "";
    switch (equipamentoData.tipo) {
      case 'arma':
        infoEspecifica = `
          <p><strong>Dano:</strong> ${equipamentoData.dano}</p>
          <p><strong>Alcance:</strong> ${game.i18n.localize(`COMBATE.${equipamentoData.alcance.toUpperCase()}`)}</p>
          <p><strong>Tipo de Dano:</strong> ${equipamentoData.tipo_dano}</p>
        `;
        break;
      case 'armadura':
        infoEspecifica = `
          <p><strong>Proteção:</strong> ${equipamentoData.protecao}</p>
          <p><strong>Bônus Defesa:</strong> +${equipamentoData.mod_defesa}</p>
          <p><strong>Tipo:</strong> ${equipamentoData.tipo_armadura}</p>
        `;
        break;
      case 'escudo':
        infoEspecifica = `
          <p><strong>Proteção:</strong> ${equipamentoData.protecao}</p>
          <p><strong>Bônus Defesa:</strong> +${equipamentoData.mod_defesa}</p>
        `;
        break;
      case 'consumivel':
        infoEspecifica = `
          <p><strong>Efeito:</strong> ${equipamentoData.efeito}</p>
          <p><strong>Usos:</strong> ${equipamentoData.usos}</p>
        `;
        break;
      case 'varinha':
        infoEspecifica = `
          <p><strong>Efeito:</strong> ${equipamentoData.efeito}</p>
          <p><strong>Cargas:</strong> ${equipamentoData.cargas}/dia</p>
        `;
        break;
    }
    
    // Mostrar dialog com detalhes
    new Dialog({
      title: `Detalhes: ${nome}`,
      content: `
        <div class="equipamento-detalhes">
          <p><strong>Descrição:</strong> ${descricao}</p>
          <p><strong>Preço:</strong> ${preco} moedas de ouro</p>
          <p><strong>Peso:</strong> ${peso} kg</p>
          <p><strong>Nível Mínimo:</strong> ${nivelMin}</p>
          ${preReqText ? `<p><strong>Pré-requisitos:</strong> ${preReqText}</p>` : ''}
          ${classesText ? `<p><strong>Classes Sugeridas:</strong> ${classesText}</p>` : ''}
          ${infoEspecifica}
          <div class="status-compra">
            <p><strong>Status:</strong> 
              ${!atendeRequisitos ? '<span style="color: red;">Não atende pré-requisitos</span>' : 
                !podeComprar ? '<span style="color: orange;">Dinheiro insuficiente</span>' : 
                '<span style="color: green;">Pode comprar</span>'}
            </p>
          </div>
        </div>
        
        <style>
          .equipamento-detalhes p {
            margin: 8px 0;
            line-height: 1.4;
          }
          .equipamento-detalhes strong {
            color: #8B4513;
          }
          .status-compra {
            margin-top: 15px;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 4px;
          }
        </style>
      `,
      buttons: {
        close: {
          icon: '<i class="fas fa-times"></i>',
          label: "Fechar",
          callback: () => {}
        }
      },
      default: "close"
    }).render(true);
  }

  /**
   * Adiciona um ponto a um atributo
   * @param {Event} event - Evento de clique
   */
  async _onAdicionarPontoAtributo(event) {
    event.preventDefault();
    const atributo = event.currentTarget.dataset.atributo;
    await this.actor.adicionarPontoAtributo(atributo);
  }

  /**
   * Remove um ponto de um atributo (apenas durante distribuição inicial)
   * @param {Event} event - Evento de clique
   */
  async _onRemoverPontoAtributo(event) {
    event.preventDefault();
    const atributo = event.currentTarget.dataset.atributo;
    await this.actor.removerPontoAtributo(atributo);
  }

  /**
   * Finaliza a distribuição inicial de pontos de atributos
   * @param {Event} event - Evento de clique
   */
  async _onFinalizarDistribuicaoInicial(event) {
    event.preventDefault();
    await this.actor.finalizarDistribuicaoInicial();
  }



  /**
   * Adiciona uma magia ao personagem
   * @param {Event} event - Evento de clique
   */
  async _onAdicionarMagia(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const magiaId = element.dataset.magia;
    
    if (!magiaId) {
      ui.notifications.error("ID da magia inválido");
      return;
    }

    try {
      await this.actor._adicionarMagia(magiaId);
      this.render(true);
    } catch (error) {
      console.error("Erro ao adicionar magia:", error);
      ui.notifications.error("Erro ao adicionar magia: " + error.message);
    }
  }

  /**
   * Remove uma magia do personagem
   * @param {Event} event - Evento de clique
   */
  async _onRemoverMagia(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = element.dataset.itemId;

    try {
      const item = this.actor.items.get(itemId);
      if (item && item.type === 'magia') {
        const confirmacao = await Dialog.confirm({
          title: "Remover Magia",
          content: `<p>Tem certeza que deseja remover a magia <strong>${item.name}</strong>?</p>`,
          yes: () => true,
          no: () => false
        });

        if (confirmacao) {
          await item.delete();
          this.render(true);
        }
      }
    } catch (error) {
      console.error("Erro ao remover magia:", error);
      ui.notifications.error("Erro ao remover magia: " + error.message);
    }
  }

  /**
   * Mostra detalhes de uma magia conhecida
   * @param {Event} event - Evento de clique
   */
  async _onDetalhesMagia(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = element.dataset.itemId;

    const item = this.actor.items.get(itemId);
    if (item && item.type === 'magia') {
      const content = `
        <div class="magia-detalhes-popup">
          <h3>${item.name}</h3>
          <p><strong>Escola:</strong> ${item.system.escola || 'Evocação'}</p>
          <p><strong>Nível:</strong> ${item.system.nivel || 1}</p>
          <p><strong>Custo PM:</strong> ${item.system.custo_pm || 1}</p>
          <p><strong>Alcance:</strong> ${item.system.alcance || 'Toque'}</p>
          <p><strong>Duração:</strong> ${item.system.duracao || 'Instantânea'}</p>
          ${item.system.descricao ? `<p><strong>Descrição:</strong> ${item.system.descricao}</p>` : ''}
        </div>
      `;
      
      new Dialog({
        title: `Detalhes da Magia: ${item.name}`,
        content: content,
        buttons: {
          close: {
            label: "Fechar",
            callback: () => {}
          }
        }
      }).render(true);
    }
  }

  /**
   * Mostra detalhes de uma magia disponível
   * @param {Event} event - Evento de clique
   */
  async _onDetalhesMagiaDisponivel(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const magiaId = element.dataset.magia;

    // Buscar dados da magia nas listas disponíveis
    const magiasDisponiveis = this._organizarMagiasDisponiveisPorEscola();
    let magia = null;
    let escola = '';

    for (const [nomeEscola, lista] of Object.entries(magiasDisponiveis)) {
      const encontrada = lista.find(m => m.id === magiaId);
      if (encontrada) {
        magia = encontrada;
        escola = nomeEscola;
        break;
      }
    }

    if (magia) {
      const content = `
        <div class="magia-detalhes-popup">
          <h3>${magia.nome}</h3>
          <p><strong>Escola:</strong> ${escola}</p>
          <p><strong>Nível:</strong> ${magia.nivel}</p>
          <p><strong>Custo PM:</strong> ${magia.custo_pm}</p>
          <p><strong>Pré-requisitos:</strong> ${magia.prerequisitos}</p>
        </div>
      `;
      
      new Dialog({
        title: `Detalhes da Magia: ${magia.nome}`,
        content: content,
        buttons: {
          close: {
            label: "Fechar",
            callback: () => {}
          }
        }
      }).render(true);
    }
  }


} 