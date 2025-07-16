/**
 * Define uma lista de templates para pré-carregamento
 * Templates que são carregados antes do sistema ser inicializado
 */
export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([
    // Templates de Actor (apenas os que existem)
    "systems/clube-dos-taberneiros-foundry/templates/actor/personagem-sheet.hbs",
    "systems/clube-dos-taberneiros-foundry/templates/actor/personagem-sheet-simple.hbs",

    // Templates de Chat (apenas os que existem)
    "systems/clube-dos-taberneiros-foundry/templates/chat/teste-resultado.hbs",
    "systems/clube-dos-taberneiros-foundry/templates/chat/ataque-resultado.hbs"

    // TODO: Adicionar mais templates conforme forem criados:
    // - Templates de NPC e criaturas
    // - Templates de itens 
    // - Partials de actor e item
    // - Templates de apps/dialogs
    // - Templates de HUD
  ]);
}; 