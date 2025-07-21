/**
 * Magias expandidas baseadas no Livro do Jogador
 * Sistema Clube dos Taberneiros
 */

export const MAGIAS_EXPANDIDAS = {
  // EVOCAÇÃO
  "raio": {
    name: "Raio",
    type: "magia",
    img: "icons/magic/lightning/bolt-strike-blue.webp",
    system: {
      escola: "evocacao",
      nivel: 3,
      custo_pm: 4,
      alcance: "80m",
      duracao: "instantaneo",
      componentes: {
        verbal: true,
        somatico: true,
        material: false
      },
      alvo: "linha",
      area_efeito: "linha reta",
      efeito: "3d6 + Mental dano elétrico em linha reta",
      descricao: "Dispara um raio elétrico em linha reta causando 3d6 + Mental de dano."
    }
  },

  "chuva_meteoros": {
    name: "Chuva de Meteoros",
    type: "magia",
    img: "icons/magic/fire/meteor-fireball-orange.webp",
    system: {
      escola: "evocacao",
      nivel: 8,
      custo_pm: 12,
      alcance: "200m",
      duracao: "instantaneo",
      componentes: {
        verbal: true,
        somatico: true,
        material: true
      },
      alvo: "area",
      area_efeito: "20m raio",
      efeito: "8d6 dano em área de 20 metros",
      descricao: "Invoca meteoros que causam 8d6 de dano em área de 20 metros."
    }
  },

  "explosao_elemental": {
    name: "Explosão Elemental",
    type: "magia",
    img: "icons/magic/fire/explosion-fireball-medium-orange.webp",
    system: {
      escola: "evocacao",
      nivel: 4,
      custo_pm: 7,
      alcance: "60m",
      duracao: "instantaneo",
      componentes: {
        verbal: true,
        somatico: true,
        material: false
      },
      alvo: "area",
      area_efeito: "5m raio",
      efeito: "4d6 dano elemental, Ação ND 12 reduz metade",
      descricao: "Causa 4d6 de dano elemental em área de 5 metros. Teste de Ação ND 12 reduz pela metade."
    }
  },

  "tempestade_arcana": {
    name: "Tempestade Arcana",
    type: "magia",
    img: "icons/magic/lightning/storm-cloud-lightning.webp",
    system: {
      escola: "evocacao",
      nivel: 5,
      custo_pm: 9,
      alcance: "60m",
      duracao: "3 turnos",
      componentes: {
        verbal: true,
        somatico: true,
        material: true
      },
      alvo: "area",
      area_efeito: "6m raio",
      efeito: "3d6/turno + Atordoar (Físico ND 12)",
      descricao: "Área de 6 metros sofre 3d6 de dano por turno durante 3 turnos. Físico ND 12 evita atordoamento."
    }
  },

  "cataclismo": {
    name: "Cataclismo",
    type: "magia",
    img: "icons/magic/earth/explosion-lava-stone-orange.webp",
    system: {
      escola: "evocacao",
      nivel: 6,
      custo_pm: 12,
      alcance: "100m",
      duracao: "instantaneo",
      componentes: {
        verbal: true,
        somatico: true,
        material: true
      },
      alvo: "area",
      area_efeito: "10m raio",
      efeito: "6d6 dano, Físico ND 15 reduz metade. 1x/dia",
      descricao: "Causa 6d6 de dano em área de 10 metros. Físico ND 15 reduz pela metade. Limitado a 1x/dia."
    }
  },

  // ABJURAÇÃO
  "protecao": {
    name: "Proteção",
    type: "magia",
    img: "icons/magic/defensive/shield-barrier-blue.webp",
    system: {
      escola: "abjuracao",
      nivel: 2,
      custo_pm: 3,
      alcance: "toque",
      duracao: "1 hora",
      componentes: {
        verbal: true,
        somatico: true,
        material: false
      },
      alvo: "criatura",
      area_efeito: "individual",
      efeito: "+1 Defesa, +2 vs magia",
      descricao: "Concede +1 à Defesa e +2 contra magia por 1 hora."
    }
  },

  "barreira": {
    name: "Barreira",
    type: "magia",
    img: "icons/magic/defensive/barrier-wall-blue.webp",
    system: {
      escola: "abjuracao",
      nivel: 4,
      custo_pm: 6,
      alcance: "10m",
      duracao: "10 minutos",
      componentes: {
        verbal: true,
        somatico: true,
        material: false
      },
      alvo: "area",
      area_efeito: "parede",
      efeito: "Parede de força que bloqueia movimento",
      descricao: "Cria uma parede de força que bloqueia movimento e ataques por 10 minutos."
    }
  },

  "imunidade": {
    name: "Imunidade",
    type: "magia",
    img: "icons/magic/defensive/shield-barrier-flaming-pentagon-blue.webp",
    system: {
      escola: "abjuracao",
      nivel: 6,
      custo_pm: 8,
      alcance: "toque",
      duracao: "1 hora",
      componentes: {
        verbal: true,
        somatico: true,
        material: true
      },
      alvo: "criatura",
      area_efeito: "individual",
      efeito: "Imune a um tipo de dano",
      descricao: "Torna o alvo imune a um tipo específico de dano por 1 hora."
    }
  },

  "barreira_mistica": {
    name: "Barreira Mística",
    type: "magia",
    img: "icons/magic/defensive/shield-barrier-glowing-triangle-blue.webp",
    system: {
      escola: "abjuracao",
      nivel: 4,
      custo_pm: 8,
      alcance: "6m raio",
      duracao: "10 min",
      componentes: {
        verbal: true,
        somatico: true,
        material: false
      },
      alvo: "aliados",
      area_efeito: "6m raio",
      efeito: "+5 Defesa para aliados (concentração)",
      descricao: "Concede +5 Defesa para aliados em 6 metros de raio por 10 minutos (concentração)."
    }
  },

  "escudo_supremo": {
    name: "Escudo Supremo",
    type: "magia",
    img: "icons/magic/defensive/shield-barrier-glowing-pentagon-blue.webp",
    system: {
      escola: "abjuracao",
      nivel: 5,
      custo_pm: 9,
      alcance: "pessoal",
      duracao: "5 min",
      componentes: {
        verbal: true,
        somatico: true,
        material: true
      },
      alvo: "conjurador",
      area_efeito: "individual",
      efeito: "+8 Defesa, imune magias ≤nível 2",
      descricao: "Concede +8 Defesa e imunidade a magias de nível 2 ou menor por 5 minutos."
    }
  },

  // TRANSMUTAÇÃO
  "levitacao": {
    name: "Levitação",
    type: "magia",
    img: "icons/magic/movement/trail-streak-zigzag-yellow.webp",
    system: {
      escola: "transmutacao",
      nivel: 2,
      custo_pm: 3,
      alcance: "pessoal",
      duracao: "10 min",
      componentes: {
        verbal: true,
        somatico: true,
        material: false
      },
      alvo: "conjurador",
      area_efeito: "individual",
      efeito: "Flutua 3m do chão",
      descricao: "Permite ao conjurador flutuar 3 metros do chão por 10 minutos."
    }
  },

  "forma_animal": {
    name: "Forma Animal",
    type: "magia",
    img: "icons/magic/nature/wolf-paw-glow-large-green.webp",
    system: {
      escola: "transmutacao",
      nivel: 4,
      custo_pm: 5,
      alcance: "pessoal",
      duracao: "1 hora",
      componentes: {
        verbal: true,
        somatico: true,
        material: true
      },
      alvo: "conjurador",
      area_efeito: "individual",
      efeito: "Transforma em animal",
      descricao: "Transforma o conjurador em um animal por 1 hora. As capacidades físicas mudam conforme o animal escolhido."
    }
  },

  "gigantismo": {
    name: "Gigantismo",
    type: "magia",
    img: "icons/magic/control/buff-strength-muscle-damage-orange.webp",
    system: {
      escola: "transmutacao",
      nivel: 5,
      custo_pm: 7,
      alcance: "toque",
      duracao: "10 min",
      componentes: {
        verbal: true,
        somatico: true,
        material: false
      },
      alvo: "criatura",
      area_efeito: "individual",
      efeito: "Dobra tamanho e força",
      descricao: "Dobra o tamanho e força do alvo por 10 minutos. Aumenta significativamente o poder de combate."
    }
  },

  "deslocamento_dimensional": {
    name: "Deslocamento Dimensional",
    type: "magia",
    img: "icons/magic/movement/portal-vortex-blue.webp",
    system: {
      escola: "transmutacao",
      nivel: 4,
      custo_pm: 7,
      alcance: "20m",
      duracao: "instantaneo",
      componentes: {
        verbal: true,
        somatico: true,
        material: false
      },
      alvo: "conjurador + 2 aliados",
      area_efeito: "grupo",
      efeito: "Teleporta conjurador + 2 aliados",
      descricao: "Teleporta o conjurador e até 2 aliados para local dentro de 20 metros."
    }
  },

  "forma_eterea": {
    name: "Forma Etérea",
    type: "magia",
    img: "icons/magic/movement/abstract-ribbons-red-orange.webp",
    system: {
      escola: "transmutacao",
      nivel: 5,
      custo_pm: 9,
      alcance: "pessoal",
      duracao: "3 turnos",
      componentes: {
        verbal: true,
        somatico: true,
        material: true
      },
      alvo: "conjurador",
      area_efeito: "individual",
      efeito: "Intangível, imune dano físico",
      descricao: "Torna-se intangível e imune a dano físico por 3 turnos."
    }
  },

  "controle_mental": {
    name: "Controle Mental",
    type: "magia",
    img: "icons/magic/control/hypnosis-mesmerism-eye-tan.webp",
    system: {
      escola: "transmutacao",
      nivel: 5,
      custo_pm: 10,
      alcance: "30m",
      duracao: "1-3 turnos",
      componentes: {
        verbal: true,
        somatico: true,
        material: false
      },
      alvo: "criatura",
      area_efeito: "individual",
      efeito: "Mental ND 15 ou obedece comandos",
      descricao: "Controla ações de um alvo por 1-3 turnos. Mental ND 15 para resistir."
    }
  },

  "tempo_congelado": {
    name: "Tempo Congelado",
    type: "magia",
    img: "icons/magic/time/clock-stopwatch-white-blue.webp",
    system: {
      escola: "transmutacao",
      nivel: 6,
      custo_pm: 12,
      alcance: "30m raio",
      duracao: "1 turno",
      componentes: {
        verbal: true,
        somatico: true,
        material: true
      },
      alvo: "area",
      area_efeito: "30m raio",
      efeito: "Todos perdem próximo turno. 1x/dia",
      descricao: "Todos em 30 metros perdem o próximo turno. Limitado a 1x/dia."
    }
  },

  "prisao_gelo": {
    name: "Prisão de Gelo",
    type: "magia",
    img: "icons/magic/water/barrier-ice-crystal-wall-jagged-blue.webp",
    system: {
      escola: "transmutacao",
      nivel: 6,
      custo_pm: 11,
      alcance: "30m",
      duracao: "ate quebrada",
      componentes: {
        verbal: true,
        somatico: true,
        material: true
      },
      alvo: "criatura",
      area_efeito: "4m",
      efeito: "Prisão 4m (20 PV ou Físico ND 15)",
      descricao: "Cria prisão de gelo de 4 metros com 20 PV ou Físico ND 15 para quebrar."
    }
  },

  // ILUSÃO
  "ilusao_menor": {
    name: "Ilusão Menor",
    type: "magia",
    img: "icons/magic/perception/eye-ringed-glow-angry-small-red.webp",
    system: {
      escola: "ilusao",
      nivel: 1,
      custo_pm: 2,
      alcance: "20m",
      duracao: "1 min",
      componentes: {
        verbal: false,
        somatico: true,
        material: false
      },
      alvo: "area",
      area_efeito: "pequena",
      efeito: "Imagem ou som simples",
      descricao: "Cria uma imagem ou som simples que dura 1 minuto. Ideal para distrações básicas."
    }
  },

  "disfarce": {
    name: "Disfarce",
    type: "magia",
    img: "icons/magic/perception/mask-carnival-gold.webp",
    system: {
      escola: "ilusao",
      nivel: 2,
      custo_pm: 3,
      alcance: "pessoal",
      duracao: "1 hora",
      componentes: {
        verbal: true,
        somatico: true,
        material: false
      },
      alvo: "conjurador",
      area_efeito: "individual",
      efeito: "Muda aparência",
      descricao: "Muda a aparência do conjurador por 1 hora. Não altera tamanho ou capacidades básicas."
    }
  },

  "ilusao_maior": {
    name: "Ilusão Maior",
    type: "magia",
    img: "icons/magic/perception/eye-ringed-glow-angry-large-red.webp",
    system: {
      escola: "ilusao",
      nivel: 4,
      custo_pm: 6,
      alcance: "50m",
      duracao: "10 min",
      componentes: {
        verbal: true,
        somatico: true,
        material: false
      },
      alvo: "area",
      area_efeito: "grande",
      efeito: "Ilusão complexa",
      descricao: "Cria uma ilusão complexa que afeta múltiplos sentidos por 10 minutos."
    }
  },

  "invisibilidade_massa": {
    name: "Invisibilidade em Massa",
    type: "magia",
    img: "icons/magic/perception/silhouette-stealth-shadow.webp",
    system: {
      escola: "ilusao",
      nivel: 7,
      custo_pm: 10,
      alcance: "10m",
      duracao: "10 min",
      componentes: {
        verbal: true,
        somatico: true,
        material: true
      },
      alvo: "grupo",
      area_efeito: "10m raio",
      efeito: "Grupo fica invisível",
      descricao: "Torna um grupo inteiro invisível por 10 minutos. Afeta até 6 pessoas próximas."
    }
  },

  "ilusao_avancada": {
    name: "Ilusão Avançada",
    type: "magia",
    img: "icons/magic/perception/eye-ringed-glow-angry-red.webp",
    system: {
      escola: "ilusao",
      nivel: 4,
      custo_pm: 7,
      alcance: "30m",
      duracao: "10 min",
      componentes: {
        verbal: true,
        somatico: true,
        material: false
      },
      alvo: "area",
      area_efeito: "variável",
      efeito: "Ilusão multi-sensorial, Mental ND 15 detecta",
      descricao: "Cria ilusão multi-sensorial por 10 minutos. Mental ND 15 para detectar."
    }
  },

  // DIVINAÇÃO
  "ver_invisivel": {
    name: "Ver Invisível",
    type: "magia",
    img: "icons/magic/perception/eye-ringed-glow-angry-blue.webp",
    system: {
      escola: "divinacao",
      nivel: 4,
      custo_pm: 4,
      alcance: "pessoal",
      duracao: "10 min",
      componentes: {
        verbal: true,
        somatico: false,
        material: true
      },
      alvo: "conjurador",
      area_efeito: "individual",
      efeito: "Vê criaturas invisíveis",
      descricao: "Permite ver criaturas e objetos invisíveis por 10 minutos."
    }
  },

  "localizar": {
    name: "Localizar",
    type: "magia",
    img: "icons/magic/perception/eye-ringed-glow-angry-yellow.webp",
    system: {
      escola: "divinacao",
      nivel: 3,
      custo_pm: 3,
      alcance: "1km",
      duracao: "instantaneo",
      componentes: {
        verbal: true,
        somatico: true,
        material: true
      },
      alvo: "objeto/pessoa",
      area_efeito: "1km raio",
      efeito: "Encontra objeto/pessoa",
      descricao: "Encontra um objeto ou pessoa específica dentro de 1km instantaneamente."
    }
  },

  "clarividiencia": {
    name: "Clarividência",
    type: "magia",
    img: "icons/magic/perception/eye-ringed-glow-angry-green.webp",
    system: {
      escola: "divinacao",
      nivel: 5,
      custo_pm: 6,
      alcance: "especial",
      duracao: "10 min",
      componentes: {
        verbal: true,
        somatico: true,
        material: true
      },
      alvo: "local distante",
      area_efeito: "visão",
      efeito: "Vê local distante",
      descricao: "Permite ver um local distante por 10 minutos como se estivesse presente."
    }
  },

  "premonicao": {
    name: "Premonição",
    type: "magia",
    img: "icons/magic/perception/eye-ringed-glow-angry-purple.webp",
    system: {
      escola: "divinacao",
      nivel: 6,
      custo_pm: 8,
      alcance: "pessoal",
      duracao: "1 dia",
      componentes: {
        verbal: true,
        somatico: true,
        material: true
      },
      alvo: "conjurador",
      area_efeito: "individual",
      efeito: "Aviso de perigo",
      descricao: "Concede avisos sobrenaturais de perigo por 1 dia inteiro."
    }
  },

  // NECROMANCIA
  "cura_menor": {
    name: "Cura Menor",
    type: "magia",
    img: "icons/magic/life/heart-cross-strong-flame-green.webp",
    system: {
      escola: "necromancia",
      nivel: 1,
      custo_pm: 2,
      alcance: "toque",
      duracao: "instantaneo",
      componentes: {
        verbal: true,
        somatico: true,
        material: false
      },
      alvo: "criatura",
      area_efeito: "individual",
      efeito: "Cura 2d6 + Mental PV",
      descricao: "Cura 2d6 + Mental pontos de vida instantaneamente através do toque."
    }
  },

  "cura_maior": {
    name: "Cura Maior",
    type: "magia",
    img: "icons/magic/life/heart-cross-strong-flame-blue.webp",
    system: {
      escola: "necromancia",
      nivel: 3,
      custo_pm: 4,
      alcance: "toque",
      duracao: "instantaneo",
      componentes: {
        verbal: true,
        somatico: true,
        material: false
      },
      alvo: "criatura",
      area_efeito: "individual",
      efeito: "Cura 4d6 + Mental PV",
      descricao: "Cura 4d6 + Mental pontos de vida instantaneamente através do toque."
    }
  },

  "drenar_vida": {
    name: "Drenar Vida",
    type: "magia",
    img: "icons/magic/death/skull-energy-light-purple.webp",
    system: {
      escola: "necromancia",
      nivel: 4,
      custo_pm: 5,
      alcance: "toque",
      duracao: "instantaneo",
      componentes: {
        verbal: true,
        somatico: true,
        material: false
      },
      alvo: "criatura",
      area_efeito: "individual",
      efeito: "3d6 dano, cura metade",
      descricao: "Causa 3d6 de dano ao alvo e cura metade do dano causado no conjurador."
    }
  },

  "ressurreicao": {
    name: "Ressurreição",
    type: "magia",
    img: "icons/magic/life/ankh-gold-blue.webp",
    system: {
      escola: "necromancia",
      nivel: 9,
      custo_pm: 15,
      alcance: "toque",
      duracao: "instantaneo",
      componentes: {
        verbal: true,
        somatico: true,
        material: true
      },
      alvo: "morto",
      area_efeito: "individual",
      efeito: "Revive morto recente",
      descricao: "Revive um morto recente, restaurando-o à vida com metade dos PV máximos."
    }
  },

  "cura_grupo": {
    name: "Cura de Grupo",
    type: "magia",
    img: "icons/magic/life/heart-cross-strong-flame-white.webp",
    system: {
      escola: "necromancia",
      nivel: 4,
      custo_pm: 8,
      alcance: "6m raio",
      duracao: "instantaneo",
      componentes: {
        verbal: true,
        somatico: true,
        material: false
      },
      alvo: "até 3 aliados",
      area_efeito: "6m raio",
      efeito: "Cura 2d6+Mental em até 3 aliados",
      descricao: "Cura 2d6 + Mental PV em até 3 aliados dentro de 6 metros."
    }
  },

  "toque_paralisante": {
    name: "Toque Paralisante",
    type: "magia",
    img: "icons/magic/death/hand-undead-skeleton-fire-blue.webp",
    system: {
      escola: "necromancia",
      nivel: 5,
      custo_pm: 10,
      alcance: "toque",
      duracao: "1 turno",
      componentes: {
        verbal: true,
        somatico: true,
        material: false
      },
      alvo: "criatura",
      area_efeito: "individual",
      efeito: "3d6 dano + Paralisia (Físico ND 14)",
      descricao: "Causa 3d6 de dano e paralisia por 1 turno. Físico ND 14 evita paralisia."
    }
  },

  "ressurreicao_menor": {
    name: "Ressurreição Menor",
    type: "magia",
    img: "icons/magic/life/cross-worn-green.webp",
    system: {
      escola: "necromancia",
      nivel: 6,
      custo_pm: 11,
      alcance: "toque",
      duracao: "instantaneo",
      componentes: {
        verbal: true,
        somatico: true,
        material: true
      },
      alvo: "morto recente",
      area_efeito: "individual",
      efeito: "Revive morto (≤3 rodadas) com metade PV. 1x/semana",
      descricao: "Revive morto recente (até 3 rodadas) com metade dos PV. Limitado a 1x/semana."
    }
  },

  "cura_suprema": {
    name: "Cura Suprema",
    type: "magia",
    img: "icons/magic/life/heart-cross-strong-flame-gold.webp",
    system: {
      escola: "necromancia",
      nivel: 6,
      custo_pm: 12,
      alcance: "toque",
      duracao: "instantaneo",
      componentes: {
        verbal: true,
        somatico: true,
        material: true
      },
      alvo: "criatura",
      area_efeito: "individual",
      efeito: "Cura todos PV + remove condições",
      descricao: "Cura todos os PV e remove todas as condições negativas."
    }
  }
};