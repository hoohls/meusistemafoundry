/**
 * Registra configurações personalizadas do sistema
 */
export const registerSystemSettings = function() {

  // Configurações gerais do sistema
  game.settings.register("clube-dos-taberneiros-foundry", "mostraDetalhesTooltip", {
    name: "Mostrar detalhes em tooltips",
    hint: "Exibe informações detalhadas quando passar o mouse sobre itens",
    scope: "client",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register("clube-dos-taberneiros-foundry", "autoCalcularDefesa", {
    name: "Calcular defesa automaticamente",
    hint: "Atualiza a defesa automaticamente ao equipar armaduras e escudos",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register("clube-dos-taberneiros-foundry", "usarCriticosAvancados", {
    name: "Usar sistema de críticos avançado",
    hint: "Ativa efeitos especiais para duplas nos dados (sucessos e falhas críticas)",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  // Configurações de combate
  game.settings.register("clube-dos-taberneiros-foundry", "aplicarDanoAutomatico", {
    name: "Aplicar dano automaticamente",
    hint: "Aplica dano automaticamente quando ataques acertam (apenas para GM)",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register("clube-dos-taberneiros-foundry", "mostrarDefesaInimigos", {
    name: "Mostrar defesa de inimigos",
    hint: "Exibe a defesa de NPCs e criaturas para jogadores",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  // Configurações de magia
  game.settings.register("clube-dos-taberneiros-foundry", "verificarPMAutomatico", {
    name: "Verificar PM automaticamente",
    hint: "Impede conjuração se não houver PM suficientes",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register("clube-dos-taberneiros-foundry", "recuperacaoPMAutomatica", {
    name: "Recuperação de PM automática",
    hint: "Recupera PM automaticamente durante descansos",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  // Configurações de automação
  game.settings.register("clube-dos-taberneiros-foundry", "atualizarRecursosAutomatico", {
    name: "Atualizar recursos automaticamente",
    hint: "Recalcula PV, PM e defesa automaticamente ao mudar atributos",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register("clube-dos-taberneiros-foundry", "aplicarModificadoresRaca", {
    name: "Aplicar modificadores de raça",
    hint: "Aplica automaticamente os modificadores raciais aos atributos",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  // Configurações de progressão
  game.settings.register("clube-dos-taberneiros-foundry", "limitarAtributos", {
    name: "Limitar valores de atributos",
    hint: "Impede que atributos ultrapassem o valor máximo (18)",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register("clube-dos-taberneiros-foundry", "verificarPrerequisitos", {
    name: "Verificar pré-requisitos",
    hint: "Verifica automaticamente pré-requisitos para habilidades e equipamentos",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  // Configurações de interface
  game.settings.register("clube-dos-taberneiros-foundry", "temaInterface", {
    name: "Tema da interface",
    hint: "Escolha o tema visual das fichas de personagem",
    scope: "client",
    config: true,
    type: String,
    choices: {
      "padrao": "Padrão",
      "escuro": "Escuro", 
      "pergaminho": "Pergaminho",
      "moderno": "Moderno"
    },
    default: "padrao"
  });

  game.settings.register("clube-dos-taberneiros-foundry", "exibirAjudaInicial", {
    name: "Exibir ajuda inicial",
    hint: "Mostra dicas de ajuda para novos usuários do sistema",
    scope: "client",
    config: true,
    type: Boolean,
    default: true
  });

  // Configurações de desenvolvimento/debug
  game.settings.register("clube-dos-taberneiros-foundry", "modoDebug", {
    name: "Modo debug",
    hint: "Ativa logs detalhados para desenvolvimento (apenas para GMs)",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register("clube-dos-taberneiros-foundry", "versaoSistema", {
    name: "Versão do sistema",
    hint: "Versão atual instalada do sistema",
    scope: "world",
    config: false,
    type: String,
    default: "1.0.0"
  });
};

// Configurações e constantes do sistema
export const SISTEMA = {};

// Configurar namespace
SISTEMA.nomeCompleto = "Sistema Clube dos Taberneiros";
SISTEMA.versao = "1.0.0";

// Atributos do sistema
SISTEMA.atributos = {
  fisico: "sistema.atributo.fisico",
  acao: "sistema.atributo.acao", 
  mental: "sistema.atributo.mental",
  social: "sistema.atributo.social"
};

// Base de dados de habilidades
SISTEMA.habilidades = {
  combate: {
    ataquePoderoso: {
      nome: "HABILIDADES.ATAQUE_PODEROSO",
      nivelMin: 1,
      preRequisito: { fisico: 5 },
      efeito: "HABILIDADES.ATAQUE_PODEROSO_EFEITO",
      classesSugeridas: ["guerreiro"]
    },
    defesaAprimorada: {
      nome: "HABILIDADES.DEFESA_APRIMORADA", 
      nivelMin: 1,
      preRequisito: { acao: 5 },
      efeito: "HABILIDADES.DEFESA_APRIMORADA_EFEITO",
      classesSugeridas: ["guerreiro"]
    },
    especializacaoArma: {
      nome: "HABILIDADES.ESPECIALIZACAO_ARMA",
      nivelMin: 2,
      preRequisito: { fisico: 6 },
      efeito: "HABILIDADES.ESPECIALIZACAO_ARMA_EFEITO", 
      classesSugeridas: ["guerreiro"]
    },
    ataqueDuplo: {
      nome: "HABILIDADES.ATAQUE_DUPLO",
      nivelMin: 4,
      preRequisito: { acao: 7 },
      efeito: "HABILIDADES.ATAQUE_DUPLO_EFEITO",
      classesSugeridas: ["guerreiro"]
    },
    resistencia: {
      nome: "HABILIDADES.RESISTENCIA",
      nivelMin: 1,
      preRequisito: { fisico: 6 },
      efeito: "HABILIDADES.RESISTENCIA_EFEITO",
      classesSugeridas: ["guerreiro"]
    },
    liderancaCombate: {
      nome: "HABILIDADES.LIDERANCA_COMBATE",
      nivelMin: 3,
      preRequisito: { social: 6 },
      efeito: "HABILIDADES.LIDERANCA_COMBATE_EFEITO",
      classesSugeridas: ["guerreiro"]
    },
    contraAtaque: {
      nome: "HABILIDADES.CONTRA_ATAQUE",
      nivelMin: 5,
      preRequisito: { acao: 8 },
      efeito: "HABILIDADES.CONTRA_ATAQUE_EFEITO",
      classesSugeridas: ["guerreiro"]
    },
    berserker: {
      nome: "HABILIDADES.BERSERKER",
      nivelMin: 6,
      preRequisito: { fisico: 8 },
      efeito: "HABILIDADES.BERSERKER_EFEITO",
      classesSugeridas: ["guerreiro"]
    }
  },
  magicas: {
    rajadaArcana: {
      nome: "HABILIDADES.RAJADA_ARCANA",
      nivelMin: 1,
      preRequisito: { mental: 5 },
      efeito: "HABILIDADES.RAJADA_ARCANA_EFEITO",
      classesSugeridas: ["mago"]
    },
    escudoMagico: {
      nome: "HABILIDADES.ESCUDO_MAGICO",
      nivelMin: 1,
      preRequisito: { mental: 5 },
      efeito: "HABILIDADES.ESCUDO_MAGICO_EFEITO",
      classesSugeridas: ["mago"]
    },
    misseisMagicos: {
      nome: "HABILIDADES.MISSEIS_MAGICOS",
      nivelMin: 2,
      preRequisito: { mental: 6 },
      efeito: "HABILIDADES.MISSEIS_MAGICOS_EFEITO",
      classesSugeridas: ["mago"]
    },
    detectarMagia: {
      nome: "HABILIDADES.DETECTAR_MAGIA",
      nivelMin: 1,
      preRequisito: { mental: 5 },
      efeito: "HABILIDADES.DETECTAR_MAGIA_EFEITO",
      classesSugeridas: ["mago"]
    },
    contraMagia: {
      nome: "HABILIDADES.CONTRA_MAGIA",
      nivelMin: 3,
      preRequisito: { mental: 7 },
      efeito: "HABILIDADES.CONTRA_MAGIA_EFEITO",
      classesSugeridas: ["mago"]
    },
    bolaFogo: {
      nome: "HABILIDADES.BOLA_FOGO",
      nivelMin: 4,
      preRequisito: { mental: 8 },
      efeito: "HABILIDADES.BOLA_FOGO_EFEITO",
      classesSugeridas: ["mago"]
    },
    invisibilidade: {
      nome: "HABILIDADES.INVISIBILIDADE",
      nivelMin: 3,
      preRequisito: { mental: 7 },
      efeito: "HABILIDADES.INVISIBILIDADE_EFEITO",
      classesSugeridas: ["mago"]
    },
    voo: {
      nome: "HABILIDADES.VOO",
      nivelMin: 5,
      preRequisito: { mental: 8 },
      efeito: "HABILIDADES.VOO_EFEITO",
      classesSugeridas: ["mago"]
    },
    teletransporte: {
      nome: "HABILIDADES.TELETRANSPORTE",
      nivelMin: 6,
      preRequisito: { mental: 9 },
      efeito: "HABILIDADES.TELETRANSPORTE_EFEITO",
      classesSugeridas: ["mago"]
    },
    curaCompleta: {
      nome: "HABILIDADES.CURA_COMPLETA",
      nivelMin: 7,
      preRequisito: { mental: 9 },
      efeito: "HABILIDADES.CURA_COMPLETA_EFEITO",
      classesSugeridas: ["mago"]
    }
  },
  furtividade: {
    ataqueFurtivo: {
      nome: "HABILIDADES.ATAQUE_FURTIVO",
      nivelMin: 1,
      preRequisito: { acao: 5 },
      efeito: "HABILIDADES.ATAQUE_FURTIVO_EFEITO",
      classesSugeridas: ["ladino"]
    },
    furtividadeAprimorada: {
      nome: "HABILIDADES.FURTIVIDADE_APRIMORADA",
      nivelMin: 1,
      preRequisito: { acao: 5 },
      efeito: "HABILIDADES.FURTIVIDADE_APRIMORADA_EFEITO",
      classesSugeridas: ["ladino"]
    },
    desarmarArmadilhas: {
      nome: "HABILIDADES.DESARMAR_ARMADILHAS",
      nivelMin: 2,
      preRequisito: { mental: 5 },
      efeito: "HABILIDADES.DESARMAR_ARMADILHAS_EFEITO",
      classesSugeridas: ["ladino"]
    },
    tiroCerteiro: {
      nome: "HABILIDADES.TIRO_CERTEIRO",
      nivelMin: 1,
      preRequisito: { acao: 6 },
      efeito: "HABILIDADES.TIRO_CERTEIRO_EFEITO",
      classesSugeridas: ["ladino"]
    },
    escaladaAprimorada: {
      nome: "HABILIDADES.ESCALADA_APRIMORADA",
      nivelMin: 1,
      preRequisito: { fisico: 5 },
      efeito: "HABILIDADES.ESCALADA_APRIMORADA_EFEITO",
      classesSugeridas: ["ladino"]
    },
    passoSombrio: {
      nome: "HABILIDADES.PASSO_SOMBRIO",
      nivelMin: 3,
      preRequisito: { acao: 7 },
      efeito: "HABILIDADES.PASSO_SOMBRIO_EFEITO",
      classesSugeridas: ["ladino"]
    },
    ataqueLetal: {
      nome: "HABILIDADES.ATAQUE_LETAL",
      nivelMin: 5,
      preRequisito: { acao: 8 },
      efeito: "HABILIDADES.ATAQUE_LETAL_EFEITO",
      classesSugeridas: ["ladino"]
    },
    mestreSombras: {
      nome: "HABILIDADES.MESTRE_SOMBRAS",
      nivelMin: 6,
      preRequisito: { acao: 8 },
      efeito: "HABILIDADES.MESTRE_SOMBRAS_EFEITO",
      classesSugeridas: ["ladino"]
    },
    reflexosAprimorados: {
      nome: "HABILIDADES.REFLEXOS_APRIMORADOS",
      nivelMin: 4,
      preRequisito: { acao: 7 },
      efeito: "HABILIDADES.REFLEXOS_APRIMORADOS_EFEITO",
      classesSugeridas: ["ladino"]
    },
    venenos: {
      nome: "HABILIDADES.VENENOS",
      nivelMin: 3,
      preRequisito: { mental: 6 },
      efeito: "HABILIDADES.VENENOS_EFEITO",
      classesSugeridas: ["ladino"]
    }
  },
  sociais: {
    persuasaoIrresistivel: {
      nome: "HABILIDADES.PERSUASAO_IRRESISTIVEL",
      nivelMin: 1,
      preRequisito: { social: 5 },
      efeito: "HABILIDADES.PERSUASAO_IRRESISTIVEL_EFEITO",
      classesSugeridas: ["diplomata"]
    },
    lideranca: {
      nome: "HABILIDADES.LIDERANCA",
      nivelMin: 1,
      preRequisito: { social: 6 },
      efeito: "HABILIDADES.LIDERANCA_EFEITO",
      classesSugeridas: ["diplomata"]
    },
    coletaInformacoes: {
      nome: "HABILIDADES.COLETA_INFORMACOES",
      nivelMin: 1,
      preRequisito: { social: 5 },
      efeito: "HABILIDADES.COLETA_INFORMACOES_EFEITO",
      classesSugeridas: ["diplomata"]
    },
    intimidacao: {
      nome: "HABILIDADES.INTIMIDACAO",
      nivelMin: 1,
      preRequisito: { social: 5 },
      efeito: "HABILIDADES.INTIMIDACAO_EFEITO",
      classesSugeridas: ["diplomata"]
    },
    redeContatos: {
      nome: "HABILIDADES.REDE_CONTATOS",
      nivelMin: 2,
      preRequisito: { social: 6 },
      efeito: "HABILIDADES.REDE_CONTATOS_EFEITO",
      classesSugeridas: ["diplomata"]
    },
    diplomacia: {
      nome: "HABILIDADES.DIPLOMACIA",
      nivelMin: 3,
      preRequisito: { social: 7 },
      efeito: "HABILIDADES.DIPLOMACIA_EFEITO",
      classesSugeridas: ["diplomata"]
    },
    inspiracao: {
      nome: "HABILIDADES.INSPIRACAO",
      nivelMin: 4,
      preRequisito: { social: 8 },
      efeito: "HABILIDADES.INSPIRACAO_EFEITO",
      classesSugeridas: ["diplomata"]
    },
    comando: {
      nome: "HABILIDADES.COMANDO",
      nivelMin: 5,
      preRequisito: { social: 8 },
      efeito: "HABILIDADES.COMANDO_EFEITO",
      classesSugeridas: ["diplomata"]
    },
    carismaSobrenatural: {
      nome: "HABILIDADES.CARISMA_SOBRENATURAL",
      nivelMin: 6,
      preRequisito: { social: 9 },
      efeito: "HABILIDADES.CARISMA_SOBRENATURAL_EFEITO",
      classesSugeridas: ["diplomata"]
    },
    mestreNegociador: {
      nome: "HABILIDADES.MESTRE_NEGOCIADOR",
      nivelMin: 7,
      preRequisito: { social: 9 },
      efeito: "HABILIDADES.MESTRE_NEGOCIADOR_EFEITO",
      classesSugeridas: ["diplomata"]
    }
  },
  gerais: {
    // Habilidades raciais
    versatilidade: {
      nome: "HABILIDADES.VERSATILIDADE",
      nivelMin: 1,
      preRequisito: {},
      efeito: "HABILIDADES.VERSATILIDADE_EFEITO",
      raca: "humano"
    },
    magiaNatureza: {
      nome: "HABILIDADES.MAGIA_NATUREZA",
      nivelMin: 1,
      preRequisito: {},
      efeito: "HABILIDADES.MAGIA_NATUREZA_EFEITO",
      raca: "elfo"
    },
    resistenciaAna: {
      nome: "HABILIDADES.RESISTENCIA_ANA",
      nivelMin: 1,
      preRequisito: {},
      efeito: "HABILIDADES.RESISTENCIA_ANA_EFEITO",
      raca: "anao"
    },
    sorteHalfling: {
      nome: "HABILIDADES.SORTE_HALFLING",
      nivelMin: 1,
      preRequisito: {},
      efeito: "HABILIDADES.SORTE_HALFLING_EFEITO",
      raca: "halfling"
    },
    magiaInstavel: {
      nome: "HABILIDADES.MAGIA_INSTAVEL",
      nivelMin: 1,
      preRequisito: {},
      efeito: "HABILIDADES.MAGIA_INSTAVEL_EFEITO",
      raca: "tiefling"
    },
    astuciaComercial: {
      nome: "HABILIDADES.ASTUCIA_COMERCIAL",
      nivelMin: 1,
      preRequisito: {},
      efeito: "HABILIDADES.ASTUCIA_COMERCIAL_EFEITO",
      raca: "goblin"
    },
    // Habilidades gerais
    primeirosSocorros: {
      nome: "HABILIDADES.PRIMEIROS_SOCORROS",
      nivelMin: 1,
      preRequisito: { mental: 4 },
      efeito: "HABILIDADES.PRIMEIROS_SOCORROS_EFEITO",
      classesSugeridas: ["todas"]
    },
    sobrevivencia: {
      nome: "HABILIDADES.SOBREVIVENCIA",
      nivelMin: 1,
      preRequisito: { mental: 5 },
      efeito: "HABILIDADES.SOBREVIVENCIA_EFEITO",
      classesSugeridas: ["todas"]
    },
    criacaoPocoes: {
      nome: "HABILIDADES.CRIACAO_POCOES",
      nivelMin: 2,
      preRequisito: { mental: 6 },
      efeito: "HABILIDADES.CRIACAO_POCOES_EFEITO",
      classesSugeridas: ["todas"]
    },
    montaria: {
      nome: "HABILIDADES.MONTARIA",
      nivelMin: 1,
      preRequisito: { acao: 5 },
      efeito: "HABILIDADES.MONTARIA_EFEITO",
      classesSugeridas: ["todas"]
    },
    navegacao: {
      nome: "HABILIDADES.NAVEGACAO",
      nivelMin: 2,
      preRequisito: { mental: 5 },
      efeito: "HABILIDADES.NAVEGACAO_EFEITO",
      classesSugeridas: ["todas"]
    },
    idiomas: {
      nome: "HABILIDADES.IDIOMAS",
      nivelMin: 1,
      preRequisito: { mental: 5 },
      efeito: "HABILIDADES.IDIOMAS_EFEITO",
      classesSugeridas: ["todas"]
    }
  }
}; 

// Base de dados de equipamentos disponíveis para compra
SISTEMA.equipamentos = {
  armas: {
    // ARMAS LEVES (Uma Mão)
    punhal: {
      nome: "EQUIPAMENTOS.PUNHAL",
      tipo: "arma",
      nivelMin: 1,
      preRequisito: { fisico: 3 },
      classesSugeridas: ["ladino", "guerreiro"],
      preco: 1,
      peso: 0.3,
      dano: "1d4",
      alcance: "corpo_a_corpo",
      tipo_dano: "perfurante",
      caracteristicas: ["oculta", "arremessavel"],
      descricao: "EQUIPAMENTOS.PUNHAL_DESC"
    },
    adaga: {
      nome: "EQUIPAMENTOS.ADAGA",
      tipo: "arma",
      nivelMin: 1,
      preRequisito: { fisico: 3 },
      classesSugeridas: ["ladino", "guerreiro"],
      preco: 2,
      peso: 0.5,
      dano: "1d4+1",
      alcance: "corpo_a_corpo",
      tipo_dano: "perfurante",
      caracteristicas: ["arremessavel", "oculta"],
      descricao: "EQUIPAMENTOS.ADAGA_DESC"
    },
    adagaElfica: {
      nome: "EQUIPAMENTOS.ADAGA_ELFICA",
      tipo: "arma",
      nivelMin: 3,
      preRequisito: { fisico: 4 },
      classesSugeridas: ["ladino", "guerreiro"],
      preco: 15,
      peso: 0.4,
      dano: "1d4+2",
      alcance: "corpo_a_corpo",
      tipo_dano: "perfurante",
      caracteristicas: ["elfica", "arremessavel"],
      bonus: { ataque: 1 },
      descricao: "EQUIPAMENTOS.ADAGA_ELFICA_DESC"
    },
    // ARMAS MÉDIAS (Uma Mão)
    clava: {
      nome: "EQUIPAMENTOS.CLAVA",
      tipo: "arma",
      nivelMin: 1,
      preRequisito: { fisico: 3 },
      classesSugeridas: ["guerreiro"],
      preco: 1,
      peso: 1,
      dano: "1d6",
      alcance: "corpo_a_corpo",
      tipo_dano: "concussao",
      caracteristicas: ["simples", "barata"],
      descricao: "EQUIPAMENTOS.CLAVA_DESC"
    },
    machadoMao: {
      nome: "EQUIPAMENTOS.MACHAXO_MAO",
      tipo: "arma",
      nivelMin: 1,
      preRequisito: { fisico: 4 },
      classesSugeridas: ["guerreiro"],
      preco: 8,
      peso: 1.5,
      dano: "1d6+1",
      alcance: "corpo_a_corpo",
      tipo_dano: "cortante",
      caracteristicas: ["arremessavel"],
      descricao: "EQUIPAMENTOS.MACHAXO_MAO_DESC"
    },
    espadaCurta: {
      nome: "EQUIPAMENTOS.ESPADA_CURTA",
      tipo: "arma",
      nivelMin: 1,
      preRequisito: { fisico: 4 },
      classesSugeridas: ["guerreiro", "ladino"],
      preco: 10,
      peso: 1,
      dano: "1d6+1",
      alcance: "corpo_a_corpo",
      tipo_dano: "cortante",
      caracteristicas: ["equilibrada", "versatil"],
      descricao: "EQUIPAMENTOS.ESPADA_CURTA_DESC"
    },
    cimitarra: {
      nome: "EQUIPAMENTOS.CIMITARRA",
      tipo: "arma",
      nivelMin: 2,
      preRequisito: { fisico: 5 },
      classesSugeridas: ["guerreiro", "ladino"],
      preco: 15,
      peso: 1,
      dano: "1d6+2",
      alcance: "corpo_a_corpo",
      tipo_dano: "cortante",
      caracteristicas: ["rapida"],
      bonus: { iniciativa: 1 },
      descricao: "EQUIPAMENTOS.CIMITARRA_DESC"
    },
    rapiera: {
      nome: "EQUIPAMENTOS.RAPIERA",
      tipo: "arma",
      nivelMin: 3,
      preRequisito: { fisico: 5 },
      classesSugeridas: ["guerreiro", "ladino"],
      preco: 20,
      peso: 1,
      dano: "1d6+2",
      alcance: "corpo_a_corpo",
      tipo_dano: "perfurante",
      caracteristicas: ["finesse"],
      bonus: { vs_armaduras_leves: 2 },
      descricao: "EQUIPAMENTOS.RAPIERA_DESC"
    },
    espadaElfica: {
      nome: "EQUIPAMENTOS.ESPADA_ELFICA",
      tipo: "arma",
      nivelMin: 4,
      preRequisito: { fisico: 6 },
      classesSugeridas: ["guerreiro", "ladino"],
      preco: 40,
      peso: 1,
      dano: "1d8+1",
      alcance: "corpo_a_corpo",
      tipo_dano: "cortante",
      caracteristicas: ["elfica", "elegante"],
      bonus: { ataque: 1 },
      descricao: "EQUIPAMENTOS.ESPADA_ELFICA_DESC"
    },
    // ARMAS PESADAS (Uma Mão)
    lanca: {
      nome: "EQUIPAMENTOS.LANCA",
      tipo: "arma",
      nivelMin: 1,
      preRequisito: { fisico: 4 },
      classesSugeridas: ["guerreiro"],
      preco: 12,
      peso: 2,
      dano: "1d8+1",
      alcance: "corpo_a_corpo",
      tipo_dano: "perfurante",
      caracteristicas: ["alcance_3m", "arremessavel"],
      descricao: "EQUIPAMENTOS.LANCA_DESC"
    },
    espadaLonga: {
      nome: "EQUIPAMENTOS.ESPADA_LONGA",
      tipo: "arma",
      nivelMin: 2,
      preRequisito: { fisico: 6 },
      classesSugeridas: ["guerreiro"],
      preco: 25,
      peso: 1.5,
      dano: "1d8+2",
      alcance: "corpo_a_corpo",
      tipo_dano: "cortante",
      caracteristicas: ["versatil", "elegante"],
      descricao: "EQUIPAMENTOS.ESPADA_LONGA_DESC"
    },
    machado: {
      nome: "EQUIPAMENTOS.MACHAXO",
      tipo: "arma",
      nivelMin: 2,
      preRequisito: { fisico: 6 },
      classesSugeridas: ["guerreiro"],
      preco: 20,
      peso: 2,
      dano: "1d8+2",
      alcance: "corpo_a_corpo",
      tipo_dano: "cortante",
      caracteristicas: ["penetrante"],
      descricao: "EQUIPAMENTOS.MACHAXO_DESC"
    },
    marteloGuerra: {
      nome: "EQUIPAMENTOS.MARTELO_GUERRA",
      tipo: "arma",
      nivelMin: 3,
      preRequisito: { fisico: 7 },
      classesSugeridas: ["guerreiro"],
      preco: 30,
      peso: 3,
      dano: "1d8+3",
      alcance: "corpo_a_corpo",
      tipo_dano: "concussao",
      caracteristicas: ["esmagador"],
      bonus: { vs_armaduras: 2 },
      descricao: "EQUIPAMENTOS.MARTELO_GUERRA_DESC"
    },
    // ARMAS DUAS MÃOS
    bordao: {
      nome: "EQUIPAMENTOS.BORDAO",
      tipo: "arma",
      nivelMin: 1,
      preRequisito: { fisico: 4 },
      classesSugeridas: ["guerreiro", "mago"],
      preco: 5,
      peso: 2,
      dano: "1d6+1",
      alcance: "corpo_a_corpo",
      tipo_dano: "concussao",
      caracteristicas: ["duas_maos", "alcance_2m"],
      descricao: "EQUIPAMENTOS.BORDAO_DESC"
    },
    lancaLonga: {
      nome: "EQUIPAMENTOS.LANCA_LONGA",
      tipo: "arma",
      nivelMin: 2,
      preRequisito: { fisico: 5 },
      classesSugeridas: ["guerreiro"],
      preco: 18,
      peso: 3,
      dano: "1d10+1",
      alcance: "corpo_a_corpo",
      tipo_dano: "perfurante",
      caracteristicas: ["alcance_4m", "anti_cavalaria"],
      descricao: "EQUIPAMENTOS.LANCA_LONGA_DESC"
    },
    machadoGrande: {
      nome: "EQUIPAMENTOS.MACHAXO_GRANDE",
      tipo: "arma",
      nivelMin: 3,
      preRequisito: { fisico: 7 },
      classesSugeridas: ["guerreiro"],
      preco: 35,
      peso: 4,
      dano: "1d12+2",
      alcance: "corpo_a_corpo",
      tipo_dano: "cortante",
      caracteristicas: ["cleave"],
      descricao: "EQUIPAMENTOS.MACHAXO_GRANDE_DESC"
    },
    montante: {
      nome: "EQUIPAMENTOS.MONTANTE",
      tipo: "arma",
      nivelMin: 5,
      preRequisito: { fisico: 8 },
      classesSugeridas: ["guerreiro"],
      preco: 60,
      peso: 3,
      dano: "2d6+2",
      alcance: "corpo_a_corpo",
      tipo_dano: "cortante",
      caracteristicas: ["alcance_2m", "intimidante"],
      descricao: "EQUIPAMENTOS.MONTANTE_DESC"
    },
    // ARMAS À DISTÂNCIA - ARREMESSO
    pedra: {
      nome: "EQUIPAMENTOS.PEDRA",
      tipo: "arma",
      nivelMin: 1,
      preRequisito: { acao: 3 },
      classesSugeridas: ["todas"],
      preco: 0,
      peso: 0.1,
      dano: "1d3",
      alcance: "distancia",
      tipo_dano: "concussao",
      caracteristicas: ["improvisada"],
      alcance_detalhes: "8/15/25m",
      descricao: "EQUIPAMENTOS.PEDRA_DESC"
    },
    dardo: {
      nome: "EQUIPAMENTOS.DARDO",
      tipo: "arma",
      nivelMin: 1,
      preRequisito: { acao: 4 },
      classesSugeridas: ["guerreiro", "ladino"],
      preco: 5,
      peso: 0.2,
      dano: "1d4",
      alcance: "distancia",
      tipo_dano: "perfurante",
      caracteristicas: ["leve", "barato"],
      alcance_detalhes: "10/20/30m",
      descricao: "EQUIPAMENTOS.DARDO_DESC"
    },
    azagaia: {
      nome: "EQUIPAMENTOS.AZAGAIA",
      tipo: "arma",
      nivelMin: 1,
      preRequisito: { acao: 4 },
      classesSugeridas: ["guerreiro"],
      preco: 1,
      peso: 1,
      dano: "1d6",
      alcance: "distancia",
      tipo_dano: "perfurante",
      caracteristicas: ["penetrante"],
      alcance_detalhes: "12/25/40m",
      descricao: "EQUIPAMENTOS.AZAGAIA_DESC"
    },
    // ARCOS
    arcoSimples: {
      nome: "EQUIPAMENTOS.ARCO_SIMPLES",
      tipo: "arma",
      nivelMin: 1,
      preRequisito: { acao: 4 },
      classesSugeridas: ["guerreiro", "ladino"],
      preco: 10,
      peso: 1,
      dano: "1d6",
      alcance: "distancia",
      tipo_dano: "perfurante",
      caracteristicas: ["basico"],
      alcance_detalhes: "25/50/100m",
      descricao: "EQUIPAMENTOS.ARCO_SIMPLES_DESC"
    },
    arcoCurto: {
      nome: "EQUIPAMENTOS.ARCO_CURTO",
      tipo: "arma",
      nivelMin: 2,
      preRequisito: { acao: 5 },
      classesSugeridas: ["guerreiro", "ladino"],
      preco: 15,
      peso: 1,
      dano: "1d6+1",
      alcance: "distancia",
      tipo_dano: "perfurante",
      caracteristicas: ["rapido"],
      bonus: { iniciativa: 1 },
      alcance_detalhes: "30/60/120m",
      descricao: "EQUIPAMENTOS.ARCO_CURTO_DESC"
    },
    arcoLongo: {
      nome: "EQUIPAMENTOS.ARCO_LONGO",
      tipo: "arma",
      nivelMin: 3,
      preRequisito: { acao: 6 },
      classesSugeridas: ["guerreiro"],
      preco: 30,
      peso: 1.5,
      dano: "1d8+2",
      alcance: "distancia",
      tipo_dano: "perfurante",
      caracteristicas: ["precisao", "penetrante"],
      alcance_detalhes: "50/100/200m",
      descricao: "EQUIPAMENTOS.ARCO_LONGO_DESC"
    },
    // BESTAS
    bestaMao: {
      nome: "EQUIPAMENTOS.BESTA_MAO",
      tipo: "arma",
      nivelMin: 1,
      preRequisito: { acao: 4 },
      classesSugeridas: ["guerreiro", "ladino"],
      preco: 20,
      peso: 1,
      dano: "1d6",
      alcance: "distancia",
      tipo_dano: "perfurante",
      caracteristicas: ["uma_mao", "lenta"],
      alcance_detalhes: "20/40/80m",
      descricao: "EQUIPAMENTOS.BESTA_MAO_DESC"
    },
    bestaLeve: {
      nome: "EQUIPAMENTOS.BESTA_LEVE",
      tipo: "arma",
      nivelMin: 2,
      preRequisito: { acao: 5 },
      classesSugeridas: ["guerreiro", "ladino"],
      preco: 25,
      peso: 2,
      dano: "1d8+1",
      alcance: "distancia",
      tipo_dano: "perfurante",
      caracteristicas: ["facil_uso"],
      alcance_detalhes: "40/80/120m",
      descricao: "EQUIPAMENTOS.BESTA_LEVE_DESC"
    },
    // CAJADOS MÁGICOS
    cajado: {
      nome: "EQUIPAMENTOS.CAJADO",
      tipo: "arma",
      nivelMin: 1,
      preRequisito: { fisico: 3 },
      classesSugeridas: ["mago"],
      preco: 5,
      peso: 1,
      dano: "1d4",
      alcance: "corpo_a_corpo",
      tipo_dano: "concussao",
      descricao: "EQUIPAMENTOS.CAJADO_DESC"
    },
    cajadoSimples: {
      nome: "EQUIPAMENTOS.CAJADO_SIMPLES",
      tipo: "arma",
      nivelMin: 1,
      preRequisito: { mental: 4 },
      classesSugeridas: ["mago"],
      preco: 10,
      peso: 2,
      dano: "1d4 + 1",
      alcance: "corpo_a_corpo",
      tipo_dano: "concussao",
      bonus: { pm_maximo: 1 },
      descricao: "EQUIPAMENTOS.CAJADO_SIMPLES_DESC"
    },
    cajadoCarvalho: {
      nome: "EQUIPAMENTOS.CAJADO_CARVALHO",
      tipo: "arma",
      nivelMin: 2,
      preRequisito: { mental: 5 },
      classesSugeridas: ["mago"],
      preco: 25,
      peso: 2.5,
      dano: "1d6",
      alcance: "corpo_a_corpo",
      tipo_dano: "concussao",
      bonus: { pm_maximo: 2 },
      descricao: "EQUIPAMENTOS.CAJADO_CARVALHO_DESC"
    },
    cajadoElfico: {
      nome: "EQUIPAMENTOS.CAJADO_ELFICO",
      tipo: "arma",
      nivelMin: 3,
      preRequisito: { mental: 6 },
      classesSugeridas: ["mago"],
      preco: 60,
      peso: 1.5,
      dano: "1d8",
      alcance: "corpo_a_corpo",
      tipo_dano: "concussao",
      caracteristicas: ["elfico"],
      bonus: { pm_maximo: 3, conjuracao: 1 },
      descricao: "EQUIPAMENTOS.CAJADO_ELFICO_DESC"
    },
    cajadoCristal: {
      nome: "EQUIPAMENTOS.CAJADO_CRISTAL",
      tipo: "arma",
      nivelMin: 4,
      preRequisito: { mental: 7 },
      classesSugeridas: ["mago"],
      preco: 100,
      peso: 2,
      dano: "1d12",
      alcance: "corpo_a_corpo",
      tipo_dano: "concussao",
      bonus: { pm_maximo: 4, dano_magico: 1 },
      descricao: "EQUIPAMENTOS.CAJADO_CRISTAL_DESC"
    },
    cajadoRunico: {
      nome: "EQUIPAMENTOS.CAJADO_RUNICO",
      tipo: "arma",
      nivelMin: 5,
      preRequisito: { mental: 8 },
      classesSugeridas: ["mago"],
      preco: 200,
      peso: 2,
      dano: "1d20",
      alcance: "corpo_a_corpo",
      tipo_dano: "concussao",
      caracteristicas: ["runico"],
      bonus: { pm_maximo: 5, conjuracao: 2 },
      descricao: "EQUIPAMENTOS.CAJADO_RUNICO_DESC"
    }
  },
  armaduras: {
    // ARMADURAS LEVES
    roupasComuns: {
      nome: "EQUIPAMENTOS.ROUPAS_COMUNS",
      tipo: "armadura",
      nivelMin: 1,
      preRequisito: {},
      classesSugeridas: ["todas"],
      preco: 2,
      peso: 1,
      protecao: 0,
      mod_defesa: 0,
      tipo_armadura: "leve",
      descricao: "EQUIPAMENTOS.ROUPAS_COMUNS_DESC"
    },
    roupasAcolchoadas: {
      nome: "EQUIPAMENTOS.ROUPAS_ACOLCHADAS",
      tipo: "armadura",
      nivelMin: 1,
      preRequisito: {},
      classesSugeridas: ["todas"],
      preco: 5,
      peso: 2,
      protecao: 1,
      mod_defesa: 1,
      tipo_armadura: "leve",
      descricao: "EQUIPAMENTOS.ROUPAS_ACOLCHADAS_DESC"
    },
    couroMacio: {
      nome: "EQUIPAMENTOS.COURO_MACIO",
      tipo: "armadura",
      nivelMin: 1,
      preRequisito: { fisico: 3 },
      classesSugeridas: ["guerreiro", "ladino"],
      preco: 10,
      peso: 3,
      protecao: 1,
      mod_defesa: 1,
      tipo_armadura: "leve",
      descricao: "EQUIPAMENTOS.COURO_MACIO_DESC"
    },
    couro: {
      nome: "EQUIPAMENTOS.ARMADURA_COURO",
      tipo: "armadura",
      nivelMin: 1,
      preRequisito: { fisico: 4 },
      classesSugeridas: ["guerreiro", "ladino"],
      preco: 15,
      peso: 5,
      protecao: 2,
      mod_defesa: 1,
      tipo_armadura: "leve",
      penalidades: { furtividade: -1 },
      descricao: "EQUIPAMENTOS.ARMADURA_COURO_DESC"
    },
    couroCravejado: {
      nome: "EQUIPAMENTOS.COURO_CRAVEJADO",
      tipo: "armadura",
      nivelMin: 2,
      preRequisito: { fisico: 5 },
      classesSugeridas: ["guerreiro"],
      preco: 35,
      peso: 8,
      protecao: 3,
      mod_defesa: 2,
      tipo_armadura: "leve",
      penalidades: { furtividade: -2 },
      descricao: "EQUIPAMENTOS.COURO_CRAVEJADO_DESC"
    },
    couroElfico: {
      nome: "EQUIPAMENTOS.COURO_ELFICO",
      tipo: "armadura",
      nivelMin: 3,
      preRequisito: { fisico: 5 },
      classesSugeridas: ["guerreiro", "ladino"],
      preco: 60,
      peso: 4,
      protecao: 3,
      mod_defesa: 2,
      tipo_armadura: "leve",
      caracteristicas: ["elfica"],
      penalidades: { furtividade: -1 },
      descricao: "EQUIPAMENTOS.COURO_ELFICO_DESC"
    },
    // ARMADURAS MÉDIAS
    gibaoPeles: {
      nome: "EQUIPAMENTOS.GIBAO_PELES",
      tipo: "armadura",
      nivelMin: 2,
      preRequisito: { fisico: 5 },
      classesSugeridas: ["guerreiro"],
      preco: 25,
      peso: 6,
      protecao: 3,
      mod_defesa: 2,
      tipo_armadura: "media",
      penalidades: { furtividade: -1 },
      descricao: "EQUIPAMENTOS.GIBAO_PELES_DESC"
    },
    camisaoMalha: {
      nome: "EQUIPAMENTOS.CAMISAO_MALHA",
      tipo: "armadura",
      nivelMin: 2,
      preRequisito: { fisico: 5 },
      classesSugeridas: ["guerreiro"],
      preco: 40,
      peso: 8,
      protecao: 3,
      mod_defesa: 2,
      tipo_armadura: "media",
      penalidades: { furtividade: -2 },
      descricao: "EQUIPAMENTOS.CAMISAO_MALHA_DESC"
    },
    malha: {
      nome: "EQUIPAMENTOS.ARMADURA_MALHA",
      tipo: "armadura",
      nivelMin: 3,
      preRequisito: { fisico: 6 },
      classesSugeridas: ["guerreiro"],
      preco: 50,
      peso: 12,
      protecao: 4,
      mod_defesa: 3,
      tipo_armadura: "media",
      penalidades: { furtividade: -3 },
      descricao: "EQUIPAMENTOS.ARMADURA_MALHA_DESC"
    },
    brigantina: {
      nome: "EQUIPAMENTOS.BRIGANTINA",
      tipo: "armadura",
      nivelMin: 4,
      preRequisito: { fisico: 6 },
      classesSugeridas: ["guerreiro"],
      preco: 60,
      peso: 10,
      protecao: 4,
      mod_defesa: 3,
      tipo_armadura: "media",
      penalidades: { furtividade: -2 },
      descricao: "EQUIPAMENTOS.BRIGANTINA_DESC"
    },
    cotaCompleta: {
      nome: "EQUIPAMENTOS.COTA_COMPLETA",
      tipo: "armadura",
      nivelMin: 4,
      preRequisito: { fisico: 7 },
      classesSugeridas: ["guerreiro"],
      preco: 80,
      peso: 15,
      protecao: 5,
      mod_defesa: 4,
      tipo_armadura: "media",
      penalidades: { furtividade: -4 },
      descricao: "EQUIPAMENTOS.COTA_COMPLETA_DESC"
    },
    // ARMADURAS PESADAS
    placasParciais: {
      nome: "EQUIPAMENTOS.PLACAS_PARCIAIS",
      tipo: "armadura",
      nivelMin: 5,
      preRequisito: { fisico: 7 },
      classesSugeridas: ["guerreiro"],
      preco: 150,
      peso: 20,
      protecao: 6,
      mod_defesa: 5,
      tipo_armadura: "pesada",
      penalidades: { furtividade: -6, acao: -1 },
      descricao: "EQUIPAMENTOS.PLACAS_PARCIAIS_DESC"
    },
    placa: {
      nome: "EQUIPAMENTOS.ARMADURA_PLACA",
      tipo: "armadura",
      nivelMin: 6,
      preRequisito: { fisico: 8 },
      classesSugeridas: ["guerreiro"],
      preco: 300,
      peso: 25,
      protecao: 7,
      mod_defesa: 6,
      tipo_armadura: "pesada",
      penalidades: { furtividade: -8, acao: -2 },
      descricao: "EQUIPAMENTOS.ARMADURA_PLACA_DESC"
    },
    vestes: {
      nome: "EQUIPAMENTOS.VESTES_MAGICAS",
      tipo: "armadura",
      nivelMin: 1,
      preRequisito: { mental: 5 },
      classesSugeridas: ["mago"],
      preco: 30,
      peso: 1,
      protecao: 0,
      mod_defesa: 1,
      tipo_armadura: "leve",
      descricao: "EQUIPAMENTOS.VESTES_MAGICAS_DESC"
    },
    vestes_arcanas: {
      nome: "EQUIPAMENTOS.ARMADURA_VESTES_ARCANAS",
      tipo: "armadura",
      nivelMin: 2,
      preRequisito: { mental: 5 },
      classesSugeridas: ["mago"],
      preco: 30,
      peso: 1,
      protecao: 1,
      mod_defesa: 1,
      tipo_armadura: "leve",
      penalidades: {},
      descricao: "EQUIPAMENTOS.ARMADURA_VESTES_ARCANAS_DESC"
    },
    manto_conjurador: {
      nome: "EQUIPAMENTOS.ARMADURA_MANTO_CONJURADOR",
      tipo: "armadura",
      nivelMin: 3,
      preRequisito: { mental: 6 },
      classesSugeridas: ["mago"],
      preco: 80,
      peso: 1.5,
      protecao: 2,
      mod_defesa: 1,
      tipo_armadura: "leve",
      penalidades: {},
      descricao: "EQUIPAMENTOS.ARMADURA_MANTO_CONJURADOR_DESC"
    },
    tunica_sombras: {
      nome: "EQUIPAMENTOS.ARMADURA_TUNICA_SOMBRAS",
      tipo: "armadura",
      nivelMin: 4,
      preRequisito: { mental: 6 },
      classesSugeridas: ["mago", "ladino"],
      preco: 150,
      peso: 2,
      protecao: 2,
      mod_defesa: 2,
      tipo_armadura: "leve",
      penalidades: { social: -1 },
      descricao: "EQUIPAMENTOS.ARMADURA_TUNICA_SOMBRAS_DESC"
    },
    manto_absorcao: {
      nome: "EQUIPAMENTOS.ARMADURA_MANTO_ABSORCAO",
      tipo: "armadura",
      nivelMin: 5,
      preRequisito: { mental: 7 },
      classesSugeridas: ["mago"],
      preco: 200,
      peso: 2.5,
      protecao: 3,
      mod_defesa: 2,
      tipo_armadura: "leve",
      penalidades: {},
      descricao: "EQUIPAMENTOS.ARMADURA_MANTO_ABSORCAO_DESC"
    },
    vestes_arcanista: {
      nome: "EQUIPAMENTOS.ARMADURA_VESTES_ARCANISTA",
      tipo: "armadura",
      nivelMin: 7,
      preRequisito: { mental: 8 },
      classesSugeridas: ["mago"],
      preco: 500,
      peso: 2,
      protecao: 4,
      mod_defesa: 3,
      tipo_armadura: "leve",
      penalidades: {},
      descricao: "EQUIPAMENTOS.ARMADURA_VESTES_ARCANISTA_DESC"
    }
  },
  escudos: {
    broquel: {
      nome: "EQUIPAMENTOS.BROQUEL",
      tipo: "escudo",
      nivelMin: 1,
      preRequisito: { fisico: 3 },
      classesSugeridas: ["guerreiro"],
      preco: 8,
      peso: 1,
      protecao: 1,
      mod_defesa: 1,
      caracteristicas: ["leve", "nao_impede_conjuracao"],
      descricao: "EQUIPAMENTOS.BROQUEL_DESC"
    },
    escudoPequeno: {
      nome: "EQUIPAMENTOS.ESCUDO_PEQUENO",
      tipo: "escudo",
      nivelMin: 1,
      preRequisito: { fisico: 4 },
      classesSugeridas: ["guerreiro"],
      preco: 12,
      peso: 2,
      protecao: 1,
      mod_defesa: 1,
      caracteristicas: ["arremessavel"],
      descricao: "EQUIPAMENTOS.ESCUDO_PEQUENO_DESC"
    },
    escudoMedio: {
      nome: "EQUIPAMENTOS.ESCUDO_MEDIO",
      tipo: "escudo",
      nivelMin: 2,
      preRequisito: { fisico: 5 },
      classesSugeridas: ["guerreiro"],
      preco: 15,
      peso: 3,
      protecao: 2,
      mod_defesa: 2,
      caracteristicas: ["equilibrado"],
      descricao: "EQUIPAMENTOS.ESCUDO_MEDIO_DESC"
    },
    escudoGrande: {
      nome: "EQUIPAMENTOS.ESCUDO_GRANDE",
      tipo: "escudo",
      nivelMin: 3,
      preRequisito: { fisico: 6 },
      classesSugeridas: ["guerreiro"],
      preco: 25,
      peso: 5,
      protecao: 3,
      mod_defesa: 3,
      caracteristicas: ["protecao_maxima"],
      descricao: "EQUIPAMENTOS.ESCUDO_GRANDE_DESC"
    },
    escudoTorre: {
      nome: "EQUIPAMENTOS.ESCUDO_TORRE",
      tipo: "escudo",
      nivelMin: 4,
      preRequisito: { fisico: 7 },
      classesSugeridas: ["guerreiro"],
      preco: 40,
      peso: 8,
      protecao: 4,
      mod_defesa: 4,
      caracteristicas: ["cobertura_total"],
      descricao: "EQUIPAMENTOS.ESCUDO_TORRE_DESC"
    }
  },
  varinhas: {
    varinhaMissois: {
      nome: "EQUIPAMENTOS.VARINHA_MISSOIS",
      tipo: "varinha",
      nivelMin: 3,
      preRequisito: { mental: 6 },
      classesSugeridas: ["mago"],
      preco: 80,
      peso: 0.5,
      efeito: "Missois Magicos",
      cargas: 5,
      descricao: "EQUIPAMENTOS.VARINHA_MISSOIS_DESC"
    },
    varinhaCura: {
      nome: "EQUIPAMENTOS.VARINHA_CURA",
      tipo: "varinha",
      nivelMin: 3,
      preRequisito: { mental: 6 },
      classesSugeridas: ["mago"],
      preco: 100,
      peso: 0.5,
      efeito: "Cura Menor",
      cargas: 3,
      descricao: "EQUIPAMENTOS.VARINHA_CURA_DESC"
    },
    varinhaFogo: {
      nome: "EQUIPAMENTOS.VARINHA_FOGO",
      tipo: "varinha",
      nivelMin: 4,
      preRequisito: { mental: 7 },
      classesSugeridas: ["mago"],
      preco: 120,
      peso: 0.5,
      efeito: "Rajada de Fogo",
      cargas: 3,
      descricao: "EQUIPAMENTOS.VARINHA_FOGO_DESC"
    },
    varinhaGelo: {
      nome: "EQUIPAMENTOS.VARINHA_GELO",
      tipo: "varinha",
      nivelMin: 4,
      preRequisito: { mental: 7 },
      classesSugeridas: ["mago"],
      preco: 120,
      peso: 0.5,
      efeito: "Rajada de Gelo",
      cargas: 3,
      descricao: "EQUIPAMENTOS.VARINHA_GELO_DESC"
    },
    varinhaRaio: {
      nome: "EQUIPAMENTOS.VARINHA_RAIO",
      tipo: "varinha",
      nivelMin: 5,
      preRequisito: { mental: 8 },
      classesSugeridas: ["mago"],
      preco: 200,
      peso: 0.5,
      efeito: "Raio Eletrico",
      cargas: 2,
      descricao: "EQUIPAMENTOS.VARINHA_RAIO_DESC"
    }
  },
  equipamentos: {
    mochila: {
      nome: "EQUIPAMENTOS.MOCHILA",
      tipo: "equipamento",
      nivelMin: 1,
      preRequisito: {},
      classesSugeridas: ["todas"],
      preco: 5,
      peso: 0.5,
      descricao: "EQUIPAMENTOS.MOCHILA_DESC"
    },
    corda: {
      nome: "EQUIPAMENTOS.CORDA",
      tipo: "equipamento",
      nivelMin: 1,
      preRequisito: {},
      classesSugeridas: ["todas"],
      preco: 2,
      peso: 1,
      descricao: "EQUIPAMENTOS.CORDA_DESC"
    },
    lampiao: {
      nome: "EQUIPAMENTOS.LAMPIAO",
      tipo: "equipamento",
      nivelMin: 1,
      preRequisito: {},
      classesSugeridas: ["todas"],
      preco: 3,
      peso: 0.5,
      descricao: "EQUIPAMENTOS.LAMPIAO_DESC"
    },
    kitMedico: {
      nome: "EQUIPAMENTOS.KIT_MEDICO",
      tipo: "equipamento",
      nivelMin: 1,
      preRequisito: { mental: 4 },
      classesSugeridas: ["todas"],
      preco: 15,
      peso: 1,
      descricao: "EQUIPAMENTOS.KIT_MEDICO_DESC"
    }
  },
  aneis: {
    anel_protecao_1: {
      nome: "EQUIPAMENTOS.ANEL_PROTECAO_1",
      tipo: "item_magico",
      nivelMin: 3,
      preco: 500,
      peso: 0.1,
      efeito: "+1 Defesa permanente",
      descricao: "EQUIPAMENTOS.ANEL_PROTECAO_1_DESC"
    },
    anel_forca_1: {
      nome: "EQUIPAMENTOS.ANEL_FORCA_1",
      tipo: "item_magico",
      nivelMin: 3,
      preco: 600,
      peso: 0.1,
      efeito: "+1 Físico permanente",
      descricao: "EQUIPAMENTOS.ANEL_FORCA_1_DESC"
    },
    anel_agilidade_1: {
      nome: "EQUIPAMENTOS.ANEL_AGILIDADE_1",
      tipo: "item_magico",
      nivelMin: 3,
      preco: 600,
      peso: 0.1,
      efeito: "+1 Ação permanente",
      descricao: "EQUIPAMENTOS.ANEL_AGILIDADE_1_DESC"
    },
    anel_inteligencia_1: {
      nome: "EQUIPAMENTOS.ANEL_INTELIGENCIA_1",
      tipo: "item_magico",
      nivelMin: 3,
      preco: 600,
      peso: 0.1,
      efeito: "+1 Mental permanente",
      descricao: "EQUIPAMENTOS.ANEL_INTELIGENCIA_1_DESC"
    },
    anel_carisma_1: {
      nome: "EQUIPAMENTOS.ANEL_CARISMA_1",
      tipo: "item_magico",
      nivelMin: 3,
      preco: 600,
      peso: 0.1,
      efeito: "+1 Social permanente",
      descricao: "EQUIPAMENTOS.ANEL_CARISMA_1_DESC"
    },
    anel_regeneracao: {
      nome: "EQUIPAMENTOS.ANEL_REGENERACAO",
      tipo: "item_magico",
      nivelMin: 5,
      preco: 1200,
      peso: 0.1,
      efeito: "Recupera 1 PV por turno",
      descricao: "EQUIPAMENTOS.ANEL_REGENERACAO_DESC"
    },
    anel_invisibilidade: {
      nome: "EQUIPAMENTOS.ANEL_INVISIBILIDADE",
      tipo: "item_magico",
      nivelMin: 6,
      preco: 2000,
      peso: 0.1,
      efeito: "Invisibilidade 3×/dia",
      descricao: "EQUIPAMENTOS.ANEL_INVISIBILIDADE_DESC"
    },
    anel_voo: {
      nome: "EQUIPAMENTOS.ANEL_VOO",
      tipo: "item_magico",
      nivelMin: 7,
      preco: 3000,
      peso: 0.1,
      efeito: "Voo 1×/dia por 1 hora",
      descricao: "EQUIPAMENTOS.ANEL_VOO_DESC"
    }
  },
  consumiveis: {
    // POÇÕES DE CURA
    pocao_menor: {
      nome: "EQUIPAMENTOS.POCAO_MENOR",
      tipo: "consumivel",
      nivelMin: 1,
      preco: 50,
      peso: 0.2,
      efeito: "Cura 2d6+2 PV",
      duracao: "Instantâneo",
      descricao: "EQUIPAMENTOS.POCAO_MENOR_DESC"
    },
    pocao_cura: {
      nome: "EQUIPAMENTOS.POCAO_CURA",
      tipo: "consumivel",
      nivelMin: 3,
      preco: 200,
      peso: 0.2,
      efeito: "Cura 4d6+4 PV",
      duracao: "Instantâneo",
      descricao: "EQUIPAMENTOS.POCAO_CURA_DESC"
    },
    pocao_completa: {
      nome: "EQUIPAMENTOS.POCAO_COMPLETA",
      tipo: "consumivel",
      nivelMin: 3,
      preco: 500,
      peso: 0.2,
      efeito: "Cura todos os PV",
      duracao: "Instantâneo",
      descricao: "EQUIPAMENTOS.POCAO_COMPLETA_DESC"
    },
    pocaoVida: {
      nome: "EQUIPAMENTOS.POCAO_VIDA",
      tipo: "consumivel",
      nivelMin: 1,
      preRequisito: {},
      classesSugeridas: ["todas"],
      preco: 25,
      peso: 0.2,
      efeito: "Restaura 2d6 + Mental PV",
      descricao: "EQUIPAMENTOS.POCAO_VIDA_DESC"
    },
    
    // POÇÕES DE ATRIBUTOS
    pocao_forca: {
      nome: "EQUIPAMENTOS.POCAO_FORCA",
      tipo: "consumivel",
      nivelMin: 2,
      preco: 100,
      peso: 0.2,
      efeito: "+2 Físico",
      duracao: "1 hora",
      descricao: "EQUIPAMENTOS.POCAO_FORCA_DESC"
    },
    pocao_agilidade: {
      nome: "EQUIPAMENTOS.POCAO_AGILIDADE",
      tipo: "consumivel",
      nivelMin: 2,
      preco: 100,
      peso: 0.2,
      efeito: "+2 Ação",
      duracao: "1 hora",
      descricao: "EQUIPAMENTOS.POCAO_AGILIDADE_DESC"
    },
    pocao_inteligencia: {
      nome: "EQUIPAMENTOS.POCAO_INTELIGENCIA",
      tipo: "consumivel",
      nivelMin: 2,
      preco: 100,
      peso: 0.2,
      efeito: "+2 Mental",
      duracao: "1 hora",
      descricao: "EQUIPAMENTOS.POCAO_INTELIGENCIA_DESC"
    },
    pocao_carisma: {
      nome: "EQUIPAMENTOS.POCAO_CARISMA",
      tipo: "consumivel",
      nivelMin: 2,
      preco: 100,
      peso: 0.2,
      efeito: "+2 Social",
      duracao: "1 hora",
      descricao: "EQUIPAMENTOS.POCAO_CARISMA_DESC"
    },
    
    // POÇÕES DE MANA
    pocao_pm_menor: {
      nome: "EQUIPAMENTOS.POCAO_PM_MENOR",
      tipo: "consumivel",
      nivelMin: 1,
      preco: 30,
      peso: 0.2,
      efeito: "Recupera 1d4 PM",
      duracao: "Ação",
      limitacao: "3x/dia",
      descricao: "EQUIPAMENTOS.POCAO_PM_MENOR_DESC"
    },
    pocao_pm_media: {
      nome: "EQUIPAMENTOS.POCAO_PM_MEDIA",
      tipo: "consumivel",
      nivelMin: 3,
      preco: 80,
      peso: 0.2,
      efeito: "Recupera 2d4 PM",
      duracao: "Ação",
      limitacao: "3x/dia",
      descricao: "EQUIPAMENTOS.POCAO_PM_MEDIA_DESC"
    },
    pocao_pm_maior: {
      nome: "EQUIPAMENTOS.POCAO_PM_MAIOR",
      tipo: "consumivel",
      nivelMin: 5,
      preco: 150,
      peso: 0.2,
      efeito: "Recupera 3d4 PM",
      duracao: "Ação",
      limitacao: "3x/dia",
      descricao: "EQUIPAMENTOS.POCAO_PM_MAIOR_DESC"
    },
    pocao_pm_superior: {
      nome: "EQUIPAMENTOS.POCAO_PM_SUPERIOR",
      tipo: "consumivel",
      nivelMin: 7,
      preco: 300,
      peso: 0.2,
      efeito: "Recupera 4d4 PM",
      duracao: "Ação",
      limitacao: "1x/dia",
      descricao: "EQUIPAMENTOS.POCAO_PM_SUPERIOR_DESC"
    },
    pocaoMana: {
      nome: "EQUIPAMENTOS.POCAO_MANA",
      tipo: "consumivel",
      nivelMin: 1,
      preRequisito: {},
      classesSugeridas: ["todas"],
      preco: 30,
      peso: 0.2,
      efeito: "Restaura 1d6 + Mental PM",
      descricao: "EQUIPAMENTOS.POCAO_MANA_DESC"
    },
    
    // ELIXIRES MÁGICOS
    elixir_arcano: {
      nome: "EQUIPAMENTOS.ELIXIR_ARCANO",
      tipo: "consumivel",
      nivelMin: 4,
      preco: 200,
      peso: 0.2,
      efeito: "+50% PM máximo",
      duracao: "1 hora",
      limitacao: "1x/dia",
      descricao: "EQUIPAMENTOS.ELIXIR_ARCANO_DESC"
    },
    pocao_foco_mental: {
      nome: "EQUIPAMENTOS.POCAO_FOCO_MENTAL",
      tipo: "consumivel",
      nivelMin: 3,
      preco: 120,
      peso: 0.2,
      efeito: "+1 turno sem gastar magia",
      duracao: "30 min",
      limitacao: "1x/dia",
      descricao: "EQUIPAMENTOS.POCAO_FOCO_MENTAL_DESC"
    },
    essencia_magica: {
      nome: "EQUIPAMENTOS.ESSENCIA_MAGICA",
      tipo: "consumivel",
      nivelMin: 6,
      preco: 400,
      peso: 0.2,
      efeito: "Recupera todos os PM",
      duracao: "Instantâneo",
      limitacao: "1x/semana",
      descricao: "EQUIPAMENTOS.ESSENCIA_MAGICA_DESC"
    },
    nectar_dos_magos: {
      nome: "EQUIPAMENTOS.NECTAR_DOS_MAGOS",
      tipo: "consumivel",
      nivelMin: 8,
      preco: 800,
      peso: 0.2,
      efeito: "PM infinito por 3 turnos",
      duracao: "3 turnos",
      limitacao: "1x/mês",
      descricao: "EQUIPAMENTOS.NECTAR_DOS_MAGOS_DESC"
    },
    pocao_concentracao: {
      nome: "EQUIPAMENTOS.POCAO_CONCENTRACAO",
      tipo: "consumivel",
      nivelMin: 5,
      preco: 180,
      peso: 0.2,
      efeito: "+2 testes de conjuração",
      duracao: "1 hora",
      limitacao: "1x/dia",
      descricao: "EQUIPAMENTOS.POCAO_CONCENTRACAO_DESC"
    },
    elixir_resistencia: {
      nome: "EQUIPAMENTOS.ELIXIR_RESISTENCIA",
      tipo: "consumivel",
      nivelMin: 5,
      preco: 250,
      peso: 0.2,
      efeito: "+3 contra interrupção mágica",
      duracao: "1 hora",
      limitacao: "1x/dia",
      descricao: "EQUIPAMENTOS.ELIXIR_RESISTENCIA_DESC"
    },
    
    // OUTROS CONSUMÍVEIS
    antidoto: {
      nome: "EQUIPAMENTOS.ANTIDOTO",
      tipo: "consumivel",
      nivelMin: 1,
      preco: 50,
      peso: 0.1,
      efeito: "Remove venenos",
      duracao: "Instantâneo",
      descricao: "EQUIPAMENTOS.ANTIDOTO_DESC"
    },
    oleo_magico: {
      nome: "EQUIPAMENTOS.OLEO_MAGICO",
      tipo: "consumivel",
      nivelMin: 3,
      preco: 150,
      peso: 0.1,
      efeito: "Arma +1 por 1 combate",
      duracao: "1 combate",
      descricao: "EQUIPAMENTOS.OLEO_MAGICO_DESC"
    }
  }
}; 