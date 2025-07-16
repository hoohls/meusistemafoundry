/**
 * Define uma lista de templates para pré-carregamento
 * Templates que são carregados antes do sistema ser inicializado
 */
export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([
    // Templates de Actor
    "systems/clube-dos-taberneiros/templates/actor/personagem-sheet.hbs",
    "systems/clube-dos-taberneiros/templates/actor/npc-sheet.hbs",
    "systems/clube-dos-taberneiros/templates/actor/criatura-sheet.hbs",

    // Partials de Actor
    "systems/clube-dos-taberneiros/templates/actor/parts/atributos.hbs",
    "systems/clube-dos-taberneiros/templates/actor/parts/recursos.hbs",
    "systems/clube-dos-taberneiros/templates/actor/parts/habilidades.hbs",
    "systems/clube-dos-taberneiros/templates/actor/parts/equipamentos.hbs",
    "systems/clube-dos-taberneiros/templates/actor/parts/magias.hbs",
    "systems/clube-dos-taberneiros/templates/actor/parts/detalhes.hbs",
    "systems/clube-dos-taberneiros/templates/actor/parts/condicoes.hbs",
    "systems/clube-dos-taberneiros/templates/actor/parts/inventario.hbs",

    // Templates de Item
    "systems/clube-dos-taberneiros/templates/item/arma-sheet.hbs",
    "systems/clube-dos-taberneiros/templates/item/armadura-sheet.hbs",
    "systems/clube-dos-taberneiros/templates/item/escudo-sheet.hbs",
    "systems/clube-dos-taberneiros/templates/item/equipamento-sheet.hbs",
    "systems/clube-dos-taberneiros/templates/item/consumivel-sheet.hbs",
    "systems/clube-dos-taberneiros/templates/item/magia-sheet.hbs",
    "systems/clube-dos-taberneiros/templates/item/habilidade-sheet.hbs",

    // Partials de Item
    "systems/clube-dos-taberneiros/templates/item/parts/item-header.hbs",
    "systems/clube-dos-taberneiros/templates/item/parts/item-detalhes.hbs",
    "systems/clube-dos-taberneiros/templates/item/parts/item-propriedades.hbs",
    "systems/clube-dos-taberneiros/templates/item/parts/item-efeitos.hbs",

    // Templates de Chat
    "systems/clube-dos-taberneiros/templates/chat/teste-resultado.hbs",
    "systems/clube-dos-taberneiros/templates/chat/ataque-resultado.hbs",
    "systems/clube-dos-taberneiros/templates/chat/magia-resultado.hbs",
    "systems/clube-dos-taberneiros/templates/chat/habilidade-uso.hbs",
    "systems/clube-dos-taberneiros/templates/chat/item-tooltip.hbs",

    // Templates de Apps/Dialogs
    "systems/clube-dos-taberneiros/templates/apps/roller-dialog.hbs",
    "systems/clube-dos-taberneiros/templates/apps/criacao-personagem.hbs",
    "systems/clube-dos-taberneiros/templates/apps/seletor-alvo.hbs",
    "systems/clube-dos-taberneiros/templates/apps/descanso.hbs",

    // Templates de HUD
    "systems/clube-dos-taberneiros/templates/hud/token-hud.hbs"
  ]);
}; 