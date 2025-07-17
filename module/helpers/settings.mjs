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
      nome: "sistema.habilidade.ataquePoderoso",
      nivelMin: 1,
      preRequisito: { fisico: 5 },
      efeito: "sistema.habilidade.ataquePoderoso.efeito",
      classesSugeridas: ["guerreiro"]
    },
    defesaAprimorada: {
      nome: "sistema.habilidade.defesaAprimorada", 
      nivelMin: 1,
      preRequisito: { acao: 5 },
      efeito: "sistema.habilidade.defesaAprimorada.efeito",
      classesSugeridas: ["guerreiro"]
    },
    especializacaoArma: {
      nome: "sistema.habilidade.especializacaoArma",
      nivelMin: 2,
      preRequisito: { fisico: 6 },
      efeito: "sistema.habilidade.especializacaoArma.efeito", 
      classesSugeridas: ["guerreiro"]
    },
    ataqueDuplo: {
      nome: "sistema.habilidade.ataqueDuplo",
      nivelMin: 4,
      preRequisito: { acao: 7 },
      efeito: "sistema.habilidade.ataqueDuplo.efeito",
      classesSugeridas: ["guerreiro"]
    },
    resistencia: {
      nome: "sistema.habilidade.resistencia",
      nivelMin: 1,
      preRequisito: { fisico: 6 },
      efeito: "sistema.habilidade.resistencia.efeito",
      classesSugeridas: ["guerreiro"]
    },
    liderancaCombate: {
      nome: "sistema.habilidade.liderancaCombate",
      nivelMin: 3,
      preRequisito: { social: 6 },
      efeito: "sistema.habilidade.liderancaCombate.efeito",
      classesSugeridas: ["guerreiro"]
    },
    contraAtaque: {
      nome: "sistema.habilidade.contraAtaque",
      nivelMin: 5,
      preRequisito: { acao: 8 },
      efeito: "sistema.habilidade.contraAtaque.efeito",
      classesSugeridas: ["guerreiro"]
    },
    berserker: {
      nome: "sistema.habilidade.berserker",
      nivelMin: 6,
      preRequisito: { fisico: 8 },
      efeito: "sistema.habilidade.berserker.efeito",
      classesSugeridas: ["guerreiro"]
    }
  },
  magicas: {
    rajadaArcana: {
      nome: "sistema.habilidade.rajadaArcana",
      nivelMin: 1,
      preRequisito: { mental: 5 },
      efeito: "sistema.habilidade.rajadaArcana.efeito",
      classesSugeridas: ["mago"]
    },
    escudoMagico: {
      nome: "sistema.habilidade.escudoMagico",
      nivelMin: 1,
      preRequisito: { mental: 5 },
      efeito: "sistema.habilidade.escudoMagico.efeito",
      classesSugeridas: ["mago"]
    },
    misseisMagicos: {
      nome: "sistema.habilidade.misseisMagicos",
      nivelMin: 2,
      preRequisito: { mental: 6 },
      efeito: "sistema.habilidade.misseisMagicos.efeito",
      classesSugeridas: ["mago"]
    },
    detectarMagia: {
      nome: "sistema.habilidade.detectarMagia",
      nivelMin: 1,
      preRequisito: { mental: 5 },
      efeito: "sistema.habilidade.detectarMagia.efeito",
      classesSugeridas: ["mago"]
    },
    contraMagia: {
      nome: "sistema.habilidade.contraMagia",
      nivelMin: 3,
      preRequisito: { mental: 7 },
      efeito: "sistema.habilidade.contraMagia.efeito",
      classesSugeridas: ["mago"]
    },
    bolaFogo: {
      nome: "sistema.habilidade.bolaFogo",
      nivelMin: 4,
      preRequisito: { mental: 8 },
      efeito: "sistema.habilidade.bolaFogo.efeito",
      classesSugeridas: ["mago"]
    },
    invisibilidade: {
      nome: "sistema.habilidade.invisibilidade",
      nivelMin: 3,
      preRequisito: { mental: 7 },
      efeito: "sistema.habilidade.invisibilidade.efeito",
      classesSugeridas: ["mago"]
    },
    voo: {
      nome: "sistema.habilidade.voo",
      nivelMin: 5,
      preRequisito: { mental: 8 },
      efeito: "sistema.habilidade.voo.efeito",
      classesSugeridas: ["mago"]
    },
    teletransporte: {
      nome: "sistema.habilidade.teletransporte",
      nivelMin: 6,
      preRequisito: { mental: 9 },
      efeito: "sistema.habilidade.teletransporte.efeito",
      classesSugeridas: ["mago"]
    },
    curaCompleta: {
      nome: "sistema.habilidade.curaCompleta",
      nivelMin: 7,
      preRequisito: { mental: 9 },
      efeito: "sistema.habilidade.curaCompleta.efeito",
      classesSugeridas: ["mago"]
    }
  },
  furtividade: {
    ataqueFurtivo: {
      nome: "sistema.habilidade.ataqueFurtivo",
      nivelMin: 1,
      preRequisito: { acao: 5 },
      efeito: "sistema.habilidade.ataqueFurtivo.efeito",
      classesSugeridas: ["ladino"]
    },
    furtividadeAprimorada: {
      nome: "sistema.habilidade.furtividadeAprimorada",
      nivelMin: 1,
      preRequisito: { acao: 5 },
      efeito: "sistema.habilidade.furtividadeAprimorada.efeito",
      classesSugeridas: ["ladino"]
    },
    desarmarArmadilhas: {
      nome: "sistema.habilidade.desarmarArmadilhas",
      nivelMin: 2,
      preRequisito: { mental: 5 },
      efeito: "sistema.habilidade.desarmarArmadilhas.efeito",
      classesSugeridas: ["ladino"]
    },
    tiroCerteiro: {
      nome: "sistema.habilidade.tiroCerteiro",
      nivelMin: 1,
      preRequisito: { acao: 6 },
      efeito: "sistema.habilidade.tiroCerteiro.efeito",
      classesSugeridas: ["ladino"]
    },
    escaladaAprimorada: {
      nome: "sistema.habilidade.escaladaAprimorada",
      nivelMin: 1,
      preRequisito: { fisico: 5 },
      efeito: "sistema.habilidade.escaladaAprimorada.efeito",
      classesSugeridas: ["ladino"]
    },
    passoSombrio: {
      nome: "sistema.habilidade.passoSombrio",
      nivelMin: 3,
      preRequisito: { acao: 7 },
      efeito: "sistema.habilidade.passoSombrio.efeito",
      classesSugeridas: ["ladino"]
    },
    ataqueLetal: {
      nome: "sistema.habilidade.ataqueLetal",
      nivelMin: 5,
      preRequisito: { acao: 8 },
      efeito: "sistema.habilidade.ataqueLetal.efeito",
      classesSugeridas: ["ladino"]
    },
    mestreSombras: {
      nome: "sistema.habilidade.mestreSombras",
      nivelMin: 6,
      preRequisito: { acao: 8 },
      efeito: "sistema.habilidade.mestreSombras.efeito",
      classesSugeridas: ["ladino"]
    },
    reflexosAprimorados: {
      nome: "sistema.habilidade.reflexosAprimorados",
      nivelMin: 4,
      preRequisito: { acao: 7 },
      efeito: "sistema.habilidade.reflexosAprimorados.efeito",
      classesSugeridas: ["ladino"]
    },
    venenos: {
      nome: "sistema.habilidade.venenos",
      nivelMin: 3,
      preRequisito: { mental: 6 },
      efeito: "sistema.habilidade.venenos.efeito",
      classesSugeridas: ["ladino"]
    }
  },
  sociais: {
    persuasaoIrresistivel: {
      nome: "sistema.habilidade.persuasaoIrresistivel",
      nivelMin: 1,
      preRequisito: { social: 5 },
      efeito: "sistema.habilidade.persuasaoIrresistivel.efeito",
      classesSugeridas: ["diplomata"]
    },
    lideranca: {
      nome: "sistema.habilidade.lideranca",
      nivelMin: 1,
      preRequisito: { social: 6 },
      efeito: "sistema.habilidade.lideranca.efeito",
      classesSugeridas: ["diplomata"]
    },
    coletaInformacoes: {
      nome: "sistema.habilidade.coletaInformacoes",
      nivelMin: 1,
      preRequisito: { social: 5 },
      efeito: "sistema.habilidade.coletaInformacoes.efeito",
      classesSugeridas: ["diplomata"]
    },
    intimidacao: {
      nome: "sistema.habilidade.intimidacao",
      nivelMin: 1,
      preRequisito: { social: 5 },
      efeito: "sistema.habilidade.intimidacao.efeito",
      classesSugeridas: ["diplomata"]
    },
    redeContatos: {
      nome: "sistema.habilidade.redeContatos",
      nivelMin: 2,
      preRequisito: { social: 6 },
      efeito: "sistema.habilidade.redeContatos.efeito",
      classesSugeridas: ["diplomata"]
    },
    diplomacia: {
      nome: "sistema.habilidade.diplomacia",
      nivelMin: 3,
      preRequisito: { social: 7 },
      efeito: "sistema.habilidade.diplomacia.efeito",
      classesSugeridas: ["diplomata"]
    },
    inspiracao: {
      nome: "sistema.habilidade.inspiracao",
      nivelMin: 4,
      preRequisito: { social: 8 },
      efeito: "sistema.habilidade.inspiracao.efeito",
      classesSugeridas: ["diplomata"]
    },
    comando: {
      nome: "sistema.habilidade.comando",
      nivelMin: 5,
      preRequisito: { social: 8 },
      efeito: "sistema.habilidade.comando.efeito",
      classesSugeridas: ["diplomata"]
    },
    carismaSobrenatural: {
      nome: "sistema.habilidade.carismaSobrenatural",
      nivelMin: 6,
      preRequisito: { social: 9 },
      efeito: "sistema.habilidade.carismaSobrenatural.efeito",
      classesSugeridas: ["diplomata"]
    },
    mestreNegociador: {
      nome: "sistema.habilidade.mestreNegociador",
      nivelMin: 7,
      preRequisito: { social: 9 },
      efeito: "sistema.habilidade.mestreNegociador.efeito",
      classesSugeridas: ["diplomata"]
    }
  },
  gerais: {
    // Habilidades raciais
    versatilidade: {
      nome: "sistema.habilidade.versatilidade",
      nivelMin: 1,
      preRequisito: {},
      efeito: "sistema.habilidade.versatilidade.efeito",
      raca: "humano"
    },
    magiaNatureza: {
      nome: "sistema.habilidade.magiaNatureza",
      nivelMin: 1,
      preRequisito: {},
      efeito: "sistema.habilidade.magiaNatureza.efeito",
      raca: "elfo"
    },
    resistenciaAna: {
      nome: "sistema.habilidade.resistenciaAna",
      nivelMin: 1,
      preRequisito: {},
      efeito: "sistema.habilidade.resistenciaAna.efeito",
      raca: "anao"
    },
    sorteHalfling: {
      nome: "sistema.habilidade.sorteHalfling",
      nivelMin: 1,
      preRequisito: {},
      efeito: "sistema.habilidade.sorteHalfling.efeito",
      raca: "halfling"
    },
    magiaInstavel: {
      nome: "sistema.habilidade.magiaInstavel",
      nivelMin: 1,
      preRequisito: {},
      efeito: "sistema.habilidade.magiaInstavel.efeito",
      raca: "tiefling"
    },
    astuciaComercial: {
      nome: "sistema.habilidade.astuciaComercial",
      nivelMin: 1,
      preRequisito: {},
      efeito: "sistema.habilidade.astuciaComercial.efeito",
      raca: "goblin"
    },
    // Habilidades gerais
    primeirosSocorros: {
      nome: "sistema.habilidade.primeirosSocorros",
      nivelMin: 1,
      preRequisito: { mental: 4 },
      efeito: "sistema.habilidade.primeirosSocorros.efeito",
      classesSugeridas: ["todas"]
    },
    sobrevivencia: {
      nome: "sistema.habilidade.sobrevivencia",
      nivelMin: 1,
      preRequisito: { mental: 5 },
      efeito: "sistema.habilidade.sobrevivencia.efeito",
      classesSugeridas: ["todas"]
    },
    criacaoPocoes: {
      nome: "sistema.habilidade.criacaoPocoes",
      nivelMin: 2,
      preRequisito: { mental: 6 },
      efeito: "sistema.habilidade.criacaoPocoes.efeito",
      classesSugeridas: ["todas"]
    },
    montaria: {
      nome: "sistema.habilidade.montaria",
      nivelMin: 1,
      preRequisito: { acao: 5 },
      efeito: "sistema.habilidade.montaria.efeito",
      classesSugeridas: ["todas"]
    },
    navegacao: {
      nome: "sistema.habilidade.navegacao",
      nivelMin: 2,
      preRequisito: { mental: 5 },
      efeito: "sistema.habilidade.navegacao.efeito",
      classesSugeridas: ["todas"]
    },
    idiomas: {
      nome: "sistema.habilidade.idiomas",
      nivelMin: 1,
      preRequisito: { mental: 5 },
      efeito: "sistema.habilidade.idiomas.efeito",
      classesSugeridas: ["todas"]
    }
  }
}; 