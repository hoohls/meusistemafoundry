/**
 * Poções e consumíveis expandidos baseados no Livro do Jogador
 * Sistema Clube dos Taberneiros
 */

export const POCOES_EXPANDIDAS = {
  // POÇÕES AVANÇADAS
  "pocao_forca_superior": {
    name: "Poção de Força Superior",
    type: "consumivel",
    img: "icons/consumables/potions/bottle-round-corked-red.webp",
    system: {
      tipo: "pocao",
      usos: { atual: 1, max: 1 },
      nivel_minimo: 4,
      qualidade: "superior",
      peso: 0.5,
      preco: { valor: 200, moeda: "mp" },
      efeito: "+3 Físico por 1 hora",
      duracao: "1 hora",
      descricao: "Poção que concede +3 Físico por 1 hora"
    }
  },

  "pocao_agilidade_superior": {
    name: "Poção de Agilidade Superior",
    type: "consumivel",
    img: "icons/consumables/potions/bottle-round-corked-green.webp",
    system: {
      tipo: "pocao",
      usos: { atual: 1, max: 1 },
      nivel_minimo: 4,
      qualidade: "superior",
      peso: 0.5,
      preco: { valor: 200, moeda: "mp" },
      efeito: "+3 Ação por 1 hora",
      duracao: "1 hora",
      descricao: "Poção que concede +3 Ação por 1 hora"
    }
  },

  "pocao_inteligencia_superior": {
    name: "Poção de Inteligência Superior",
    type: "consumivel",
    img: "icons/consumables/potions/bottle-round-corked-blue.webp",
    system: {
      tipo: "pocao",
      usos: { atual: 1, max: 1 },
      nivel_minimo: 4,
      qualidade: "superior",
      peso: 0.5,
      preco: { valor: 200, moeda: "mp" },
      efeito: "+3 Mental por 1 hora",
      duracao: "1 hora",
      descricao: "Poção que concede +3 Mental por 1 hora"
    }
  },

  "pocao_carisma_superior": {
    name: "Poção de Carisma Superior",
    type: "consumivel",
    img: "icons/consumables/potions/bottle-round-corked-yellow.webp",
    system: {
      tipo: "pocao",
      usos: { atual: 1, max: 1 },
      nivel_minimo: 4,
      qualidade: "superior",
      peso: 0.5,
      preco: { valor: 200, moeda: "mp" },
      efeito: "+3 Social por 1 hora",
      duracao: "1 hora",
      descricao: "Poção que concede +3 Social por 1 hora"
    }
  },

  "pocao_invisibilidade": {
    name: "Poção de Invisibilidade",
    type: "consumivel",
    img: "icons/consumables/potions/bottle-round-corked-clear.webp",
    system: {
      tipo: "pocao",
      usos: { atual: 1, max: 1 },
      nivel_minimo: 5,
      qualidade: "magica",
      peso: 0.5,
      preco: { valor: 400, moeda: "mp" },
      efeito: "Invisibilidade por 10 minutos",
      duracao: "10 minutos",
      descricao: "Poção que torna invisível por 10 minutos"
    }
  },

  "pocao_voo": {
    name: "Poção de Voo",
    type: "consumivel",
    img: "icons/consumables/potions/bottle-round-corked-white.webp",
    system: {
      tipo: "pocao",
      usos: { atual: 1, max: 1 },
      nivel_minimo: 6,
      qualidade: "magica",
      peso: 0.5,
      preco: { valor: 600, moeda: "mp" },
      efeito: "Voo por 30 minutos",
      duracao: "30 minutos",
      descricao: "Poção que permite voar por 30 minutos"
    }
  },

  "pocao_gigantismo": {
    name: "Poção de Gigantismo",
    type: "consumivel",
    img: "icons/consumables/potions/bottle-round-corked-orange.webp",
    system: {
      tipo: "pocao",
      usos: { atual: 1, max: 1 },
      nivel_minimo: 6,
      qualidade: "magica",
      peso: 0.5,
      preco: { valor: 500, moeda: "mp" },
      efeito: "Dobra tamanho e força por 10 minutos",
      duracao: "10 minutos",
      descricao: "Poção que dobra tamanho e força por 10 minutos"
    }
  },

  "pocao_imortalidade": {
    name: "Poção da Imortalidade",
    type: "consumivel",
    img: "icons/consumables/potions/bottle-round-corked-gold.webp",
    system: {
      tipo: "pocao",
      usos: { atual: 1, max: 1 },
      nivel_minimo: 8,
      qualidade: "lendaria",
      peso: 0.5,
      preco: { valor: 2000, moeda: "mp" },
      efeito: "Imune à morte por 1 dia",
      duracao: "1 dia",
      descricao: "Poção que torna imune à morte por 1 dia"
    }
  }
};

export const PERGAMINHOS_MAGICOS = {
  "pergaminho_cura_menor": {
    name: "Pergaminho de Cura Menor",
    type: "consumivel",
    img: "icons/sundries/scrolls/scroll-worn-tan.webp",
    system: {
      tipo: "pergaminho",
      usos: { atual: 1, max: 1 },
      nivel_minimo: 1,
      qualidade: "comum",
      peso: 0.1,
      preco: { valor: 25, moeda: "mp" },
      efeito: "Cura Menor (uso único)",
      magia: "cura_menor",
      descricao: "Pergaminho de uso único com Cura Menor"
    }
  },

  "pergaminho_misseis": {
    name: "Pergaminho de Mísseis",
    type: "consumivel",
    img: "icons/sundries/scrolls/scroll-worn-blue.webp",
    system: {
      tipo: "pergaminho",
      usos: { atual: 1, max: 1 },
      nivel_minimo: 2,
      qualidade: "comum",
      peso: 0.1,
      preco: { valor: 40, moeda: "mp" },
      efeito: "Mísseis Mágicos (uso único)",
      magia: "misseis_magicos",
      descricao: "Pergaminho de uso único com Mísseis Mágicos"
    }
  },

  "pergaminho_bola_fogo": {
    name: "Pergaminho de Bola de Fogo",
    type: "consumivel",
    img: "icons/sundries/scrolls/scroll-worn-red.webp",
    system: {
      tipo: "pergaminho",
      usos: { atual: 1, max: 1 },
      nivel_minimo: 4,
      qualidade: "superior",
      peso: 0.1,
      preco: { valor: 80, moeda: "mp" },
      efeito: "Bola de Fogo (uso único)",
      magia: "bola_de_fogo",
      descricao: "Pergaminho de uso único com Bola de Fogo"
    }
  },

  "pergaminho_cura_maior": {
    name: "Pergaminho de Cura Maior",
    type: "consumivel",
    img: "icons/sundries/scrolls/scroll-worn-green.webp",
    system: {
      tipo: "pergaminho",
      usos: { atual: 1, max: 1 },
      nivel_minimo: 4,
      qualidade: "superior",
      peso: 0.1,
      preco: { valor: 100, moeda: "mp" },
      efeito: "Cura Maior (uso único)",
      magia: "cura_maior",
      descricao: "Pergaminho de uso único com Cura Maior"
    }
  },

  "pergaminho_ressurreicao": {
    name: "Pergaminho de Ressurreição",
    type: "consumivel",
    img: "icons/sundries/scrolls/scroll-worn-gold.webp",
    system: {
      tipo: "pergaminho",
      usos: { atual: 1, max: 1 },
      nivel_minimo: 8,
      qualidade: "lendaria",
      peso: 0.1,
      preco: { valor: 500, moeda: "mp" },
      efeito: "Ressurreição (uso único)",
      magia: "ressurreicao",
      descricao: "Pergaminho de uso único com Ressurreição"
    }
  }
};

export const COMPONENTES_MAGICOS = {
  "po_diamante": {
    name: "Pó de Diamante",
    type: "equipamento",
    img: "icons/commodities/gems/gem-faceted-white.webp",
    system: {
      tipo: "componente",
      equipavel: false,
      nivel_minimo: 3,
      qualidade: "raro",
      peso: 0.1,
      preco: { valor: 100, moeda: "mp" },
      uso: "Componente para magias nível 3+",
      descricao: "Componente necessário para magias de nível 3+"
    }
  },

  "essencia_elemental": {
    name: "Essência Elemental",
    type: "equipamento",
    img: "icons/commodities/materials/bowl-liquid-glowing.webp",
    system: {
      tipo: "componente",
      equipavel: false,
      nivel_minimo: 4,
      qualidade: "raro",
      peso: 0.2,
      preco: { valor: 150, moeda: "mp" },
      uso: "Potencializa magias elementais",
      descricao: "Componente que potencializa magias elementais"
    }
  },

  "sangue_dragao": {
    name: "Sangue de Dragão",
    type: "equipamento",
    img: "icons/commodities/biological/blood-vial-red.webp",
    system: {
      tipo: "componente",
      equipavel: false,
      nivel_minimo: 6,
      qualidade: "muito_raro",
      peso: 0.1,
      preco: { valor: 500, moeda: "mp" },
      uso: "Componente para magias épicas",
      descricao: "Componente raro para magias épicas"
    }
  },

  "cristal_temporal": {
    name: "Cristal Temporal",
    type: "equipamento",
    img: "icons/commodities/gems/gem-rough-blue.webp",
    system: {
      tipo: "componente",
      equipavel: false,
      nivel_minimo: 7,
      qualidade: "muito_raro",
      peso: 0.3,
      preco: { valor: 1000, moeda: "mp" },
      uso: "Magias de tempo",
      descricao: "Componente para magias de tempo"
    }
  },

  "fragmento_divino": {
    name: "Fragmento Divino",
    type: "equipamento",
    img: "icons/commodities/gems/gem-faceted-gold.webp",
    system: {
      tipo: "componente",
      equipavel: false,
      nivel_minimo: 9,
      qualidade: "lendario",
      peso: 0.1,
      preco: { valor: 2000, moeda: "mp" },
      uso: "Magias de ressurreição",
      descricao: "Componente para magias de ressurreição"
    }
  }
};