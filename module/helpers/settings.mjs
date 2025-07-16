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