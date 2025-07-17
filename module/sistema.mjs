/**
 * Sistema Clube dos Taberneiros para FoundryVTT
 * Sistema de RPG baseado em 2d6 com quatro atributos fundamentais
 */

// Importar classes do sistema
import { ClubeActor } from "./documents/actor.mjs";
import { ClubeActorSheet } from "./sheets/actor-sheet.mjs";
import { ClubeItem } from "./documents/item.mjs";
import { ClubeItemSheet } from "./sheets/item-sheet.mjs";
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { registerSystemSettings } from "./helpers/settings.mjs";
import { ClubeRollerDialog } from "./apps/roller-dialog.mjs";

/* -------------------------------------------- */
/*  Inicialização do Sistema                    */
/* -------------------------------------------- */

Hooks.once('init', function() {
  console.log(`Sistema Clube dos Taberneiros | Inicializando sistema v${game.system.version}`);

  // Atribuir classes customizadas
  CONFIG.Actor.documentClass = ClubeActor;
  CONFIG.Item.documentClass = ClubeItem;

  // Registrar tipos de Actor
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("clube-dos-taberneiros-foundry", ClubeActorSheet, {
    types: ["personagem", "npc", "criatura"],
    makeDefault: true,
    label: "FICHA.PERSONAGEM"
  });

  // Registrar tipos de Item
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("clube-dos-taberneiros-foundry", ClubeItemSheet, {
    types: ["arma", "armadura", "escudo", "equipamento", "consumivel", "magia", "habilidade"],
    makeDefault: true,
    label: "EQUIPAMENTOS.EQUIPAMENTO"
  });

  // Registrar configurações do sistema
  registerSystemSettings();

  // Carregar templates Handlebars
  preloadHandlebarsTemplates();

  // Registrar helpers Handlebars
  registerHandlebarsHelpers();

  // Configurações globais do sistema
  CONFIG.clube = {
    atributos: {
      fisico: "ATRIBUTOS.FISICO",
      acao: "ATRIBUTOS.ACAO", 
      mental: "ATRIBUTOS.MENTAL",
      social: "ATRIBUTOS.SOCIAL"
    },
    classes: {
      guerreiro: "CLASSES.GUERREIRO",
      mago: "CLASSES.MAGO",
      ladino: "CLASSES.LADINO",
      diplomata: "CLASSES.DIPLOMATA"
    },
    racas: {
      humano: "RACAS.HUMANO",
      elfo: "RACAS.ELFO",
      anao: "RACAS.ANAO",
      halfling: "RACAS.HALFLING",
      tiefling: "RACAS.TIEFLING",
      goblin: "RACAS.GOBLIN"
    },
    escolasMagia: {
      evocacao: "MAGIAS.ESCOLAS.EVOCACAO",
      abjuracao: "MAGIAS.ESCOLAS.ABJURACAO",
      transmutacao: "MAGIAS.ESCOLAS.TRANSMUTACAO",
      ilusao: "MAGIAS.ESCOLAS.ILUSAO",
      divinacao: "MAGIAS.ESCOLAS.DIVINACAO",
      necromancia: "MAGIAS.ESCOLAS.NECROMANCIA"
    },
    dificuldades: {
      5: "TESTES.DIFICULDADES.TRIVIAL",
      7: "TESTES.DIFICULDADES.FACIL",
      9: "TESTES.DIFICULDADES.MODERADA",
      11: "TESTES.DIFICULDADES.DIFICIL",
      13: "TESTES.DIFICULDADES.MUITO_DIFICIL",
      15: "TESTES.DIFICULDADES.HEROICA"
    }
  };
});

/* -------------------------------------------- */
/*  Sistema de Testes (2d6 + Atributo vs ND)   */
/* -------------------------------------------- */

/**
 * Executa um teste do sistema
 * @param {Object} options - Opções do teste
 * @param {string} options.atributo - Nome do atributo
 * @param {number} options.valor - Valor do atributo
 * @param {number} options.nd - Número de Dificuldade
 * @param {number} options.modificador - Modificadores extras
 * @param {string} options.nome - Nome do teste
 * @param {Actor} options.ator - Ator realizando o teste
 */
async function executarTeste({
  atributo = "fisico",
  valor = 0,
  nd = 9,
  modificador = 0,
  nome = "Teste",
  ator = null
} = {}) {

  // Rolagem dos dados
  const roll = new Roll("2d6 + @valor + @mod", {
    valor: valor,
    mod: modificador
  });

  await roll.evaluate();

  // Verificar críticos (duplas)
  const dados = roll.terms[0].results;
  const ehDupla = dados[0].result === dados[1].result;
  const valorDados = dados[0].result + dados[1].result;
  
  let critico = null;
  if (ehDupla) {
    if (valorDados >= 8) critico = "sucesso";
    else if (valorDados <= 6) critico = "falha";
  }

  // Resultado
  const total = roll.total;
  const sucesso = total >= nd;
  const margem = Math.abs(total - nd);

  // Preparar dados para o chat
  const chatData = {
    user: game.user.id,
    speaker: ChatMessage.getSpeaker({actor: ator}),
    roll: roll,
    content: await renderTemplate("systems/clube-dos-taberneiros-foundry/templates/chat/teste-resultado.hbs", {
      nome: nome,
      atributo: game.i18n.localize(`ATRIBUTOS.${atributo.toUpperCase()}`),
      valor: valor,
      modificador: modificador,
      nd: nd,
      total: total,
      sucesso: sucesso,
      margem: margem,
      critico: critico,
      dados: dados
    }),
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    rollMode: game.settings.get("core", "rollMode")
  };

  // Enviar para o chat
  await ChatMessage.create(chatData);

  return {
    roll: roll,
    total: total,
    sucesso: sucesso,
    margem: margem,
    critico: critico
  };
}

/* -------------------------------------------- */
/*  Sistema de Combate                         */
/* -------------------------------------------- */

/**
 * Executa um ataque
 * @param {Object} options - Opções do ataque
 */
async function executarAtaque({
  atacante,
  alvo = null,
  arma = null,
  tipo = "corpo_a_corpo",
  modificador = 0
} = {}) {

  if (!atacante) {
    ui.notifications.error("Atacante não especificado");
    return;
  }

  const data = atacante.system;
  const atributo = tipo === "corpo_a_corpo" ? "fisico" : "acao";
  const valorAtributo = data.atributos[atributo].valor;

  // Preparar dados do ataque
  let danoBase = "1d6";
  let propriedades = [];
  
  if (arma) {
    danoBase = arma.system.dano.base;
    propriedades = Object.keys(arma.system.propriedades).filter(p => arma.system.propriedades[p]);
  }

  // Rolagem de ataque
  const ataqueRoll = new Roll("2d6 + @atributo + @mod", {
    atributo: valorAtributo,
    mod: modificador
  });

  await ataqueRoll.evaluate();

  // Verificar acerto
  let defesaAlvo = 10;
  if (alvo) {
    defesaAlvo = alvo.system.recursos.defesa.valor;
  }

  const acertou = ataqueRoll.total >= defesaAlvo;
  
  // Se acertou, rolar dano
  let danoRoll = null;
  if (acertou) {
    danoRoll = new Roll(`${danoBase} + @atributo`, {
      atributo: valorAtributo
    });
    await danoRoll.evaluate();

    // Aplicar dano se há alvo
    if (alvo) {
      const pvAtual = alvo.system.recursos.pv.valor;
      const novoPv = Math.max(0, pvAtual - danoRoll.total);
      await alvo.update({"system.recursos.pv.valor": novoPv});
    }
  }

  // Preparar dados para o chat
  const chatData = {
    user: game.user.id,
    speaker: ChatMessage.getSpeaker({actor: atacante}),
    content: await renderTemplate("systems/clube-dos-taberneiros-foundry/templates/chat/ataque-resultado.hbs", {
      atacante: atacante.name,
      alvo: alvo?.name || "Alvo",
      arma: arma?.name || "Ataque Desarmado",
      ataqueRoll: ataqueRoll,
      defesa: defesaAlvo,
      acertou: acertou,
      danoRoll: danoRoll,
      dano: danoRoll?.total || 0,
      propriedades: propriedades
    }),
    rolls: acertou ? [ataqueRoll, danoRoll] : [ataqueRoll],
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    rollMode: game.settings.get("core", "rollMode")
  };

  await ChatMessage.create(chatData);

  return {
    ataqueRoll: ataqueRoll,
    acertou: acertou,
    danoRoll: danoRoll,
    dano: danoRoll?.total || 0
  };
}

/* -------------------------------------------- */
/*  Sistema de Magia                           */
/* -------------------------------------------- */

/**
 * Conjura uma magia
 * @param {Object} options - Opções da conjuração
 */
async function conjurarMagia({
  conjurador,
  magia,
  alvo = null,
  nd = null
} = {}) {

  if (!conjurador || !magia) {
    ui.notifications.error("Conjurador ou magia não especificados");
    return;
  }

  const data = conjurador.system;
  const magiaData = magia.system;

  // Verificar PM suficientes
  if (data.recursos.pm.valor < magiaData.custo_pm) {
    ui.notifications.warn(game.i18n.localize("DIALOGS.PM_INSUFICIENTE"));
    return;
  }

  // ND da conjuração (5 + nível da magia)
  const ndConjuracao = nd || (5 + magiaData.nivel);

  // Teste de conjuração
  const resultado = await executarTeste({
    atributo: "mental",
    valor: data.atributos.mental.valor,
    nd: ndConjuracao,
    nome: `Conjurar ${magia.name}`,
    ator: conjurador
  });

  // Se bem-sucedido, gastar PM e aplicar efeitos
  if (resultado.sucesso) {
    const novoPm = data.recursos.pm.valor - magiaData.custo_pm;
    await conjurador.update({"system.recursos.pm.valor": novoPm});

    // Efeitos específicos da magia seriam implementados aqui
    ui.notifications.info(`${magia.name} conjurada com sucesso!`);
  } else {
    ui.notifications.warn(`Falha ao conjurar ${magia.name}`);
  }

  return resultado;
}

/* -------------------------------------------- */
/*  Helpers Handlebars                         */
/* -------------------------------------------- */

function registerHandlebarsHelpers() {
  console.log("Registrando helpers Handlebars...");

  // Helper para localizar atributos
  Handlebars.registerHelper('localizeAtributo', function(atributo) {
    return game.i18n.localize(`ATRIBUTOS.${atributo.toUpperCase()}`);
  });

  // Helper para localizar classes
  Handlebars.registerHelper('localizeClasse', function(classe) {
    return game.i18n.localize(`CLASSES.${classe.toUpperCase()}`);
  });

  // Helper para localizar raças
  Handlebars.registerHelper('localizeRaca', function(raca) {
    return game.i18n.localize(`RACAS.${raca.toUpperCase()}`);
  });

  // Helper para localizar escolas de magia
  Handlebars.registerHelper('localizeEscola', function(escola) {
    return game.i18n.localize(`MAGIAS.ESCOLAS.${escola.toUpperCase()}`);
  });

  // Helper para localizar condições
  Handlebars.registerHelper('localizeCondicao', function(condicao) {
    return game.i18n.localize(`CONDICOES.${condicao.toUpperCase()}`);
  });

  // Helper para localizar equipamentos
  Handlebars.registerHelper('localizeEquipamento', function(equipamento) {
    return game.i18n.localize(`EQUIPAMENTOS.${equipamento.toUpperCase()}`);
  });

  // Helper para calcular modificador de atributo
  Handlebars.registerHelper('modificadorAtributo', function(valor) {
    return Math.floor((valor - 10) / 2);
  });

  // Helper para formatar modificador
  Handlebars.registerHelper('formatarModificador', function(mod) {
    if (mod >= 0) return `+${mod}`;
    return `${mod}`;
  });

  // Helper para calcular porcentagem
  Handlebars.registerHelper('porcentagem', function(valor, total) {
    if (total === 0) return 0;
    return Math.round((valor / total) * 100);
  });

  // Helper para verificar se item está equipado
  Handlebars.registerHelper('isEquipado', function(item) {
    return item.system?.equipado || false;
  });

  // Helper para verificar se habilidade está disponível
  Handlebars.registerHelper('isHabilidadeDisponivel', function(habilidade, nivel, atributos) {
    if (habilidade.nivelMin > nivel) return false;
    
    if (habilidade.preRequisito) {
      for (const [atributo, valorMinimo] of Object.entries(habilidade.preRequisito)) {
        if (atributos[atributo]?.valor < valorMinimo) return false;
      }
    }
    
    return true;
  });

  // Helper para calcular defesa
  Handlebars.registerHelper('calcularDefesa', function(acao, armadura, escudo, outros) {
    return 10 + acao + (armadura || 0) + (escudo || 0) + (outros || 0);
  });

  // Helper para comparação de igualdade
  Handlebars.registerHelper('eq', function(a, b) {
    return a === b;
  });

  // Helper para maior que
  Handlebars.registerHelper('gt', function(a, b) {
    return a > b;
  });

  // Helper para menor que
  Handlebars.registerHelper('lt', function(a, b) {
    return a < b;
  });

  // Helper para determinar limite máximo de atributos
  Handlebars.registerHelper('limiteMaximoAtributo', function(atributosInicializados) {
    return atributosInicializados ? 18 : 8;
  });

  // Helper para operações matemáticas
  Handlebars.registerHelper('math', function(lvalue, operator, rvalue, options) {
    const operators = {
      '+': (l, r) => l + r,
      '-': (l, r) => l - r,
      '*': (l, r) => l * r,
      '/': (l, r) => l / r,
      '%': (l, r) => l % r
    };
    
    if (!operators[operator]) {
      throw new Error(`Operador não suportado: ${operator}`);
    }
    
    return operators[operator](lvalue, rvalue);
  });

  // Helper para concatenação de strings
  Handlebars.registerHelper('concat', function() {
    return Array.prototype.slice.call(arguments, 0, -1).join('');
  });

  // Helper para conversão para maiúscula
  Handlebars.registerHelper('uppercase', function(str) {
    return str ? str.toUpperCase() : '';
  });

  // Helper para criar range de números
  Handlebars.registerHelper('range', function(start, end) {
    const result = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  });

  console.log("Helpers Handlebars registrados com sucesso!");
}

/* -------------------------------------------- */
/*  Hooks do Sistema                           */
/* -------------------------------------------- */

// Pronto para uso
Hooks.once("ready", function() {
  console.log("Sistema Clube dos Taberneiros | Sistema carregado e pronto!");
  
  // Configurar barra de hotkeys se necessário
  // Registrar macros do sistema se necessário
});

// Hook para modificar dados derivados ao atualizar atributos
Hooks.on("preUpdateActor", function(actor, data, options, userId) {
  if (actor.type === "personagem" && data.system?.atributos) {
    const updateData = {};
    
    // Atualizar PV máximo se Físico mudou
    if (data.system.atributos.fisico?.valor !== undefined) {
      const novoFisico = data.system.atributos.fisico.valor;
      const novoPvMax = novoFisico * 3 + 10;
      updateData["system.recursos.pv.max"] = novoPvMax;
      
      // Ajustar PV atual se necessário
      const pvAtual = actor.system.recursos.pv.valor;
      if (pvAtual > novoPvMax) {
        updateData["system.recursos.pv.valor"] = novoPvMax;
      }
    }
    
    // Atualizar PM máximo se Mental mudou
    if (data.system.atributos.mental?.valor !== undefined) {
      const novoMental = data.system.atributos.mental.valor;
      const novoPmMax = novoMental * 2 + 5;
      updateData["system.recursos.pm.max"] = novoPmMax;
      
      // Ajustar PM atual se necessário
      const pmAtual = actor.system.recursos.pm.valor;
      if (pmAtual > novoPmMax) {
        updateData["system.recursos.pm.valor"] = novoPmMax;
      }
    }
    
    // Atualizar Defesa se Ação mudou
    if (data.system.atributos.acao?.valor !== undefined) {
      const novaAcao = data.system.atributos.acao.valor;
      const defesaBase = 10 + novaAcao;
      const armadura = actor.system.recursos.defesa.armadura || 0;
      const escudo = actor.system.recursos.defesa.escudo || 0;
      const outros = actor.system.recursos.defesa.outros || 0;
      updateData["system.recursos.defesa.valor"] = defesaBase + armadura + escudo + outros;
    }
    
    // Aplicar atualizações
    foundry.utils.mergeObject(data, updateData);
  }
});

// Exportar funções globais para macros
window.clube = {
  executarTeste,
  executarAtaque,
  conjurarMagia,
  ClubeRollerDialog
}; 