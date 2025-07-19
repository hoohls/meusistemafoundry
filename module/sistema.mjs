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

  // Configurar tipos de itens válidos
  CONFIG.Item.documentClass = ClubeItem;
  CONFIG.Item.types = ClubeItem.types;
  
  // Definir tipos de itens válidos para validação
  CONFIG.Item.validTypes = ["arma", "armadura", "escudo", "equipamento", "consumivel", "magia", "habilidade"];

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
  // await ChatMessage.create(chatData);

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

  // Helper para calcular porcentagem de XP
  Handlebars.registerHelper('calcularPorcentagemXP', function(actor) {
    if (!actor || !actor.system) return 0;
    
    try {
      const tabelaXP = [0, 10, 25, 45, 70, 100, 135, 175, 220, 270, 325, 385, 450, 520, 595, 675, 760, 850, 945, 1045];
      const nivelAtual = actor.system.nivel || 1;
      const xpAtual = actor.system.experiencia?.atual || 0;
      
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
  });

  // Helper para obter XP do próximo nível
  Handlebars.registerHelper('getXPProximoNivel', function(actor) {
    if (!actor || !actor.system) return 10;
    
    try {
      const tabelaXP = [0, 10, 25, 45, 70, 100, 135, 175, 220, 270, 325, 385, 450, 520, 595, 675, 760, 850, 945, 1045];
      const nivelAtual = actor.system.nivel || 1;
      
      if (nivelAtual >= tabelaXP.length - 1) {
        return actor.system.experiencia?.atual || 0;
      }
      
      return tabelaXP[nivelAtual + 1];
    } catch (error) {
      console.error("Erro ao obter XP do próximo nível:", error);
      return 10;
    }
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

  // Helper para simplificar nomes de itens
  Handlebars.registerHelper('simplificarNome', function(nome) {
    if (!nome) return "Item sem nome";
    
    // Mapeamento completo de nomes para simplificação
    const nomesLimpos = {
      // Nomes específicos em CAPSLOCK
      cajadocarvalho: "Cajado de Carvalho",
      cajadorunico: "Cajado Rúnico",
      roupasacolchadas: "Roupas Acolchadas",
      armaduramantoconjurador: "Armadura Manto do Conjurador",
      
      // Armas Simples
      punhal: "Punhal",
      adaga: "Adaga",
      adagaElfica: "Adaga Élfica",
      clava: "Clava",
      machadoMao: "Machado de Mão",
      cimitarra: "Cimitarra",
      rapiera: "Rapiera",
      espadaCurta: "Espada Curta",
      espadaElfica: "Espada Élfica",
      lanca: "Lança",
      espadaLonga: "Espada Longa",
      machado: "Machado",
      marteloGuerra: "Martelo de Guerra",
      bordao: "Bordão",
      lancaLonga: "Lança Longa",
      machadoGrande: "Machado Grande",
      montante: "Montante",
      
      // Armas de Arremesso
      pedra: "Pedra",
      dardo: "Dardo",
      azagaia: "Azagaia",
      
      // Armas de Distância
      arcoSimples: "Arco Simples",
      arcoCurto: "Arco Curto",
      arcoLongo: "Arco Longo",
      bestaMao: "Besta de Mão",
      bestaLeve: "Besta Leve",
      
      // Cajados
      cajado: "Cajado",
      cajadoSimples: "Cajado Simples",
      cajadoCarvalho: "Cajado de Carvalho",
      cajadoElfico: "Cajado Élfico",
      cajadoCristal: "Cajado de Cristal",
      cajadoRunico: "Cajado Rúnico",
      
      // Roupas e Armaduras Leves
      roupasComuns: "Roupas Comuns",
      roupasAcolchoadas: "Roupas Acolchoadas",
      couroMacio: "Couro Macio",
      couro: "Armadura de Couro",
      couroCravejado: "Couro Cravejado",
      couroElfico: "Couro Élfico",
      gibaoPeles: "Gibão de Peles",
      
      // Armaduras de Malha
      camisaoMalha: "Camisão de Malha",
      malha: "Armadura de Malha",
      brigantina: "Brigantina",
      cotaCompleta: "Cota Completa",
      
      // Armaduras Pesadas
      placasParciais: "Placas Parciais",
      placa: "Armadura de Placas",
      
      // Vestes Mágicas
      vestes: "Vestes Mágicas",
      vestes_arcanas: "Vestes Arcanas",
      manto_conjurador: "Manto do Conjurador",
      tunica_sombras: "Túnica das Sombras",
      manto_absorcao: "Manto de Absorção",
      vestes_arcanista: "Vestes do Arcanista",
      
      // Escudos
      broquel: "Broquel",
      escudoPequeno: "Escudo Pequeno",
      escudoMedio: "Escudo Médio",
      escudoGrande: "Escudo Grande",
      escudoTorre: "Escudo Torre",
      
      // Varinhas
      varinhaMissois: "Varinha de Mísseis",
      varinhaCura: "Varinha de Cura",
      varinhaFogo: "Varinha de Fogo",
      varinhaGelo: "Varinha de Gelo",
      varinhaRaio: "Varinha de Raio",
      
      // Equipamentos
      mochila: "Mochila",
      corda: "Corda",
      lampiao: "Lampião",
      kitMedico: "Kit Médico",
      
      // Poções de Cura
      pocaoVida: "Poção de Vida",
      pocao_menor: "Poção Menor",
      pocao_cura: "Poção de Cura",
      pocao_completa: "Poção Completa",
      
      // Poções de Atributos
      pocao_forca: "Poção de Força",
      pocao_agilidade: "Poção de Agilidade",
      pocao_inteligencia: "Poção de Inteligência",
      pocao_carisma: "Poção de Carisma",
      
      // Poções de Mana
      pocaoMana: "Poção de Mana",
      pocao_pm_menor: "Poção de PM Menor",
      pocao_pm_media: "Poção de PM Média",
      pocao_pm_maior: "Poção de PM Maior",
      pocao_pm_superior: "Poção de PM Superior",
      
      // Elixires Mágicos
      elixir_arcano: "Elixir Arcano",
      pocao_foco_mental: "Poção de Foco Mental",
      essencia_magica: "Essência Mágica",
      nectar_dos_magos: "Néctar dos Magos",
      pocao_concentracao: "Poção de Concentração",
      elixir_resistencia: "Elixir de Resistência",
      
      // Outros
      antidoto: "Antídoto",
      oleo_magico: "Óleo Mágico",
      
      // Anéis
      anel_protecao_1: "Anel de Proteção +1",
      anel_forca_1: "Anel de Força +1",
      anel_agilidade_1: "Anel de Agilidade +1",
      anel_inteligencia_1: "Anel de Inteligência +1",
      anel_carisma_1: "Anel de Carisma +1",
      anel_regeneracao: "Anel de Regeneração",
      anel_invisibilidade: "Anel de Invisibilidade",
      anel_voo: "Anel de Voo",
      
      // Chaves de localização (para compatibilidade)
      "equipamentos.cajado": "Cajado",
      "equipamentos.roupas_acolchadas": "Roupas Acolchadas",
      "equipamentos.espada_curta": "Espada Curta",
      "equipamentos.espada_longa": "Espada Longa",
      "equipamentos.machado": "Machado",
      "equipamentos.arco_curto": "Arco Curto",
      "equipamentos.armadura_couro": "Armadura de Couro",
      "equipamentos.armadura_malha": "Armadura de Malha",
      "equipamentos.armadura_placa": "Armadura de Placas",
      "equipamentos.vestes_magicas": "Vestes Mágicas",
      "equipamentos.escudo_pequeno": "Escudo Pequeno",
      "equipamentos.escudo_grande": "Escudo Grande",
      "equipamentos.mochila": "Mochila",
      "equipamentos.corda": "Corda",
      "equipamentos.lampiao": "Lampião",
      "equipamentos.kit_medico": "Kit Médico",
      "equipamentos.pocao_vida": "Poção de Vida",
      "equipamentos.pocao_mana": "Poção de Mana",
      "equipamentos.antidoto": "Antídoto"
    };
    
    // Se o nome for uma chave de localização, extrair um nome simples
    if (nome.startsWith("EQUIPAMENTOS.")) {
      const chave = nome.replace("EQUIPAMENTOS.", "").toLowerCase();
      return nomesLimpos[`equipamentos.${chave}`] || nomesLimpos[chave] || chave.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
    }
    
    // Se o nome contém underscore, tentar simplificar
    if (nome.includes('_')) {
      const chave = nome.toLowerCase();
      const resultado = nomesLimpos[chave] || nome.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
      
      // Aplicar correções de acentos para casos com underscore
      return resultado
        .replace(/\bElfico\b/g, 'Élfico')
        .replace(/\bGibao\b/g, 'Gibão')
        .replace(/\bCamisao\b/g, 'Camisão')
        .replace(/\bMagicas\b/g, 'Mágicas')
        .replace(/\bTunica\b/g, 'Túnica')
        .replace(/\bAbsorcao\b/g, 'Absorção')
        .replace(/\bMissois\b/g, 'Mísseis')
        .replace(/\bLampiao\b/g, 'Lampião')
        .replace(/\bMedico\b/g, 'Médico')
        .replace(/\bPocao\b/g, 'Poção')
        .replace(/\bForca\b/g, 'Força')
        .replace(/\bAgilidade\b/g, 'Agilidade')
        .replace(/\bInteligencia\b/g, 'Inteligência')
        .replace(/\bEssencia\b/g, 'Essência')
        .replace(/\bMagica\b/g, 'Mágica')
        .replace(/\bNectar\b/g, 'Néctar')
        .replace(/\bConcentracao\b/g, 'Concentração')
        .replace(/\bResistencia\b/g, 'Resistência')
        .replace(/\bAntidoto\b/g, 'Antídoto')
        .replace(/\bOleo\b/g, 'Óleo')
        .replace(/\bMagico\b/g, 'Mágico')
        .replace(/\bProtecao\b/g, 'Proteção')
        .replace(/\bRegeneracao\b/g, 'Regeneração')
        .replace(/\bInvisibilidade\b/g, 'Invisibilidade')
        .replace(/\bLanca\b/g, 'Lança')
        .replace(/\bBordao\b/g, 'Bordão')
        .replace(/\bConjurador\b/g, 'Conjurador')
        .replace(/\bSombras\b/g, 'Sombras')
        .replace(/\bArcanista\b/g, 'Arcanista')
        .replace(/\bMedio\b/g, 'Médio')
        .replace(/\bMedia\b/g, 'Média')
        .replace(/\bDos\b/g, 'dos')
        .replace(/\bMagos\b/g, 'Magos')
        .replace(/\bArcano\b/g, 'Arcano')
        .replace(/\bFoco\b/g, 'Foco')
        .replace(/\bMental\b/g, 'Mental')
        .replace(/\bCura\b/g, 'Cura')
        .replace(/\bFogo\b/g, 'Fogo')
        .replace(/\bGelo\b/g, 'Gelo')
        .replace(/\bRaio\b/g, 'Raio')
        .replace(/\bCorda\b/g, 'Corda')
        .replace(/\bVida\b/g, 'Vida')
        .replace(/\bMana\b/g, 'Mana')
        .replace(/\bMenor\b/g, 'Menor')
        .replace(/\bCompleta\b/g, 'Completa')
        .replace(/\bMaior\b/g, 'Maior')
        .replace(/\bSuperior\b/g, 'Superior')
        .replace(/\bVoo\b/g, 'Voo');
    }
    
    // Se o nome está em caixa alta e sem espaços, tentar mapear diretamente
    if (/^[A-Z]+$/.test(nome)) {
      const chave = nome.toLowerCase();
      // Tentar mapear diretamente primeiro
      if (nomesLimpos[chave]) {
        return nomesLimpos[chave];
      }
      
      // Tentar separar palavras comuns em CAPSLOCK
      const palavrasComuns = [
        "CAJADO", "CARVALHO", "RUNICO", "ROUPAS", "ACOLCHADAS", "ARMADURA", "MANTO", "CONJURADOR", "MAGICO"
      ];
      
      let nomeProcessado = nome;
      palavrasComuns.forEach(palavra => {
        const regex = new RegExp(palavra, 'g');
        nomeProcessado = nomeProcessado.replace(regex, palavra.charAt(0) + palavra.slice(1).toLowerCase() + ' ');
      });
      
      // Se conseguiu separar, processar o resultado
      if (nomeProcessado !== nome) {
        nomeProcessado = nomeProcessado.replace(/\s+/g, ' ').trim();
        nomeProcessado = nomeProcessado.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        
        // Aplicar correções de acentos
        nomeProcessado = nomeProcessado
          .replace(/\bElfico\b/g, 'Élfico')
          .replace(/\bMagico\b/g, 'Mágico')
          .replace(/\bConjurador\b/g, 'Conjurador');
        
        return nomeProcessado;
      }
      
      // Se não encontrar, tentar separar por palavras conhecidas
      const palavras = [
        "CAJADO", "SIMPLES", "ELFICO", "CARVALHO", "CRISTAL", "RUNICO",
        "ROUPAS", "ACOLCHADAS", "COMUNS", "COURO", "MACIO", "CRAVEJADO", "ELFICO", "GIBAO", "PELES",
        "CAMISAO", "MALHA", "BRIGANTINA", "COTA", "COMPLETA", "PLACAS", "PARCIAIS",
        "VESTES", "MAGICAS", "ARCANAS", "MANTO", "CONJURADOR", "TUNICA", "SOMBRAS", "ABSORCAO", "ARCANISTA",
        "BROQUEL", "ESCUDO", "PEQUENO", "MEDIO", "GRANDE", "TORRE",
        "VARINHA", "MISSOIS", "CURA", "FOGO", "GELO", "RAIO",
        "MOCHILA", "CORDA", "LAMPIAO", "KIT", "MEDICO",
        "POCAO", "VIDA", "MANA", "MENOR", "CURA", "COMPLETA", "FORCA", "AGILIDADE", "INTELIGENCIA", "CARISMA",
        "PM", "MEDIA", "MAIOR", "SUPERIOR",
        "ELIXIR", "ARCANO", "FOCO", "MENTAL", "ESSENCIA", "MAGICA", "NECTAR", "DOS", "MAGOS", "CONCENTRACAO", "RESISTENCIA",
        "ANTIDOTO", "OLEO", "MAGICO",
        "ANEL", "PROTECAO", "REGENERACAO", "INVISIBILIDADE", "VOO",
        "ESPADA", "CURTA", "LONGA", "MACHADO", "MAO", "CIMITARRA", "RAPIERA", "LANCA", "MARTELO", "GUERRA", "BORDAO", "LONGA", "GRANDE", "MONTANTE",
        "PEDRA", "DARDO", "AZAGAIA", "ARCO", "LONGO", "BESTA", "LEVE",
        "ARMADURA", "MAGICO", "MANTOCONJURADOR"
      ];
      
      let resultado = nome;
      palavras.forEach(palavra => {
        const regex = new RegExp(palavra, 'g');
        resultado = resultado.replace(regex, palavra.charAt(0) + palavra.slice(1).toLowerCase() + ' ');
      });
      resultado = resultado.replace(/\s+/g, ' ').trim();
      
      // Capitaliza cada palavra
      resultado = resultado.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      
      // Aplicar correções de acentos
      resultado = resultado
        .replace(/\bElfico\b/g, 'Élfico')
        .replace(/\bGibao\b/g, 'Gibão')
        .replace(/\bCamisao\b/g, 'Camisão')
        .replace(/\bMagicas\b/g, 'Mágicas')
        .replace(/\bTunica\b/g, 'Túnica')
        .replace(/\bAbsorcao\b/g, 'Absorção')
        .replace(/\bMissois\b/g, 'Mísseis')
        .replace(/\bLampiao\b/g, 'Lampião')
        .replace(/\bMedico\b/g, 'Médico')
        .replace(/\bPocao\b/g, 'Poção')
        .replace(/\bForca\b/g, 'Força')
        .replace(/\bAgilidade\b/g, 'Agilidade')
        .replace(/\bInteligencia\b/g, 'Inteligência')
        .replace(/\bEssencia\b/g, 'Essência')
        .replace(/\bMagica\b/g, 'Mágica')
        .replace(/\bNectar\b/g, 'Néctar')
        .replace(/\bConcentracao\b/g, 'Concentração')
        .replace(/\bResistencia\b/g, 'Resistência')
        .replace(/\bAntidoto\b/g, 'Antídoto')
        .replace(/\bOleo\b/g, 'Óleo')
        .replace(/\bMagico\b/g, 'Mágico')
        .replace(/\bProtecao\b/g, 'Proteção')
        .replace(/\bRegeneracao\b/g, 'Regeneração')
        .replace(/\bInvisibilidade\b/g, 'Invisibilidade')
        .replace(/\bLanca\b/g, 'Lança')
        .replace(/\bBordao\b/g, 'Bordão')
        .replace(/\bConjurador\b/g, 'Conjurador')
        .replace(/\bSombras\b/g, 'Sombras')
        .replace(/\bArcanista\b/g, 'Arcanista')
        .replace(/\bMedio\b/g, 'Médio')
        .replace(/\bMedia\b/g, 'Média')
        .replace(/\bDos\b/g, 'dos')
        .replace(/\bMagos\b/g, 'Magos')
        .replace(/\bArcano\b/g, 'Arcano')
        .replace(/\bFoco\b/g, 'Foco')
        .replace(/\bMental\b/g, 'Mental')
        .replace(/\bCura\b/g, 'Cura')
        .replace(/\bFogo\b/g, 'Fogo')
        .replace(/\bGelo\b/g, 'Gelo')
        .replace(/\bRaio\b/g, 'Raio')
        .replace(/\bCorda\b/g, 'Corda')
        .replace(/\bVida\b/g, 'Vida')
        .replace(/\bMana\b/g, 'Mana')
        .replace(/\bMenor\b/g, 'Menor')
        .replace(/\bCompleta\b/g, 'Completa')
        .replace(/\bMaior\b/g, 'Maior')
        .replace(/\bSuperior\b/g, 'Superior')
        .replace(/\bVoo\b/g, 'Voo');
      
      return resultado;
    }
    
    // Fallback: só capitaliza a primeira letra
    return nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();
  });

  // Helper para criar range de números
  Handlebars.registerHelper('range', function(start, end) {
    const result = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  });

  // Helper para formatar pré-requisitos de atributos
  Handlebars.registerHelper('formatarPreRequisitos', function(preRequisitos) {
    if (!preRequisitos) {
      return "";
    }
    
    // Se for uma string, retornar diretamente (para magias)
    if (typeof preRequisitos === 'string') {
      return preRequisitos;
    }
    
    // Se for um objeto vazio, retornar string vazia
    if (Object.keys(preRequisitos).length === 0) {
      return "";
    }
    
    const nomesAtributos = {
      fisico: "Físico",
      acao: "Ação",
      mental: "Mental",
      social: "Social"
    };
    
    const preReqList = Object.entries(preRequisitos).map(([attr, valor]) => {
      const nomeAtributo = nomesAtributos[attr] || attr.charAt(0).toUpperCase() + attr.slice(1);
      return `${nomeAtributo} ${valor}`;
    });
    
    return preReqList.join(", ");
  });

  // Helper para formatar classes sugeridas
  Handlebars.registerHelper('formatarClassesSugeridas', function(classesSugeridas) {
    if (!classesSugeridas || classesSugeridas.length === 0 || classesSugeridas.includes("todas")) {
      return "";
    }
    
    const nomesClasses = {
      guerreiro: "Guerreiro",
      mago: "Mago",
      ladino: "Ladino",
      diplomata: "Diplomata"
    };
    
    const classesList = classesSugeridas.map(classe => {
      const nomeClasse = nomesClasses[classe] || classe.charAt(0).toUpperCase() + classe.slice(1);
      return nomeClasse;
    });
    
    return classesList.join(", ");
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
    console.log("[HOOK] preUpdateActor chamado com dados:", data);
    
    // Verificar se os recursos já estão sendo atualizados (evitar conflito com adicionarPontoAtributo)
    const recursosJaAtualizados = data.system.recursos && (
      data.system.recursos.pv?.max !== undefined ||
      data.system.recursos.pm?.max !== undefined ||
      data.system.recursos.defesa?.valor !== undefined
    );
    
    if (recursosJaAtualizados) {
      console.log("[HOOK] Recursos já estão sendo atualizados, pulando hook para evitar conflito");
      return;
    }
    
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
      
      console.log(`[HOOK] Atualizando PV: novo máximo = ${novoPvMax}`);
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
      
      console.log(`[HOOK] Atualizando PM: novo máximo = ${novoPmMax}`);
    }
    
    // Atualizar Defesa se Ação mudou
    if (data.system.atributos.acao?.valor !== undefined) {
      const novaAcao = data.system.atributos.acao.valor;
      const defesaBase = 10 + novaAcao;
      const armadura = actor.system.recursos.defesa.armadura || 0;
      const escudo = actor.system.recursos.defesa.escudo || 0;
      const outros = actor.system.recursos.defesa.outros || 0;
      updateData["system.recursos.defesa.valor"] = defesaBase + armadura + escudo + outros;
      
      console.log(`[HOOK] Atualizando Defesa: nova base = ${defesaBase}, total = ${defesaBase + armadura + escudo + outros}`);
    }
    
    // Aplicar atualizações apenas se houver mudanças
    if (Object.keys(updateData).length > 0) {
      console.log("[HOOK] Aplicando atualizações:", updateData);
      foundry.utils.mergeObject(data, updateData);
    }
  }
});

// Exportar funções globais para macros
window.clube = {
  executarTeste,
  executarAtaque,
  conjurarMagia,
  ClubeRollerDialog
}; 