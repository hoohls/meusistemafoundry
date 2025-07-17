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