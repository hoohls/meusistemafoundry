/**
 * Equipamentos expandidos baseados no Livro do Jogador
 * Sistema Clube dos Taberneiros
 */

export const EQUIPAMENTOS_EXPANDIDOS = {
    // ARMAS CORPO A CORPO AVANÇADAS
    "punhal_envenenado": {
        name: "Punhal Envenenado",
        type: "arma",
        img: "icons/weapons/daggers/dagger-curved-poison-green.webp",
        system: {
            tipo: "corpo_a_corpo",
            dano: { base: "1d4+1" },
            propriedades: {
                oculta: true,
                arremesso: true,
                veneno: true
            },
            nivel_minimo: 4,
            qualidade: "superior",
            peso: 0.5,
            preco: { valor: 25, moeda: "mp" },
            descricao: "Punhal com lâmina tratada com veneno. Físico ND 12 ou 1d4 dano/turno"
        }
    },

    "lamina_sombria": {
        name: "Lâmina Sombria",
        type: "arma",
        img: "icons/weapons/daggers/dagger-straight-black.webp",
        system: {
            tipo: "corpo_a_corpo",
            dano: { base: "1d6+1" },
            propriedades: {
                furtividade: true,
                critico_aprimorado: true
            },
            nivel_minimo: 6,
            qualidade: "magica",
            peso: 0.6,
            preco: { valor: 50, moeda: "mp" },
            bonus: {
                furtividade: 2,
                critico: "11-12"
            },
            descricao: "Lâmina encantada que concede +2 Furtividade e crítico em 11-12"
        }
    },

    "lamina_flamejante": {
        name: "Lâmina Flamejante",
        type: "arma",
        img: "icons/weapons/swords/sword-broad-flame-orange.webp",
        system: {
            tipo: "corpo_a_corpo",
            dano: { base: "1d6+3" },
            propriedades: {
                flamejante: true,
                iluminacao: true
            },
            nivel_minimo: 5,
            qualidade: "magica",
            peso: 1.2,
            preco: { valor: 80, moeda: "mp" },
            bonus: {
                dano_fogo: "1d4",
                iluminacao: "6m"
            },
            descricao: "Espada mágica que causa +1d4 dano de fogo e ilumina 6 metros"
        }
    },

    "espada_bastarda": {
        name: "Espada Bastarda",
        type: "arma",
        img: "icons/weapons/swords/sword-broad-steel.webp",
        system: {
            tipo: "corpo_a_corpo",
            dano: { base: "1d10+1" },
            propriedades: {
                versatil: true,
                duas_maos_opcional: true
            },
            nivel_minimo: 4,
            qualidade: "superior",
            peso: 2,
            preco: { valor: 40, moeda: "mp" },
            descricao: "Espada versátil que pode ser usada com uma ou duas mãos"
        }
    },

    "lanca_elfica": {
        name: "Lança Élfica",
        type: "arma",
        img: "icons/weapons/polearms/spear-ornate-silver.webp",
        system: {
            tipo: "corpo_a_corpo",
            dano: { base: "1d8+3" },
            propriedades: {
                elfica: true,
                alcance: true,
                arremesso: true
            },
            nivel_minimo: 4,
            qualidade: "elfica",
            peso: 1.8,
            preco: { valor: 45, moeda: "mp" },
            bonus: {
                ataque: 1,
                alcance: "3m"
            },
            descricao: "Lança élfica de excelente qualidade com +1 ataque"
        }
    },

    "martelo_anao": {
        name: "Martelo Anão",
        type: "arma",
        img: "icons/weapons/hammers/hammer-war-runes-brown.webp",
        system: {
            tipo: "corpo_a_corpo",
            dano: { base: "1d10+2" },
            propriedades: {
                anao: true,
                arremesso: true,
                retorna: true
            },
            nivel_minimo: 5,
            qualidade: "ana",
            peso: 3.5,
            preco: { valor: 60, moeda: "mp" },
            bonus: {
                retorno_automatico: true
            },
            descricao: "Martelo de guerra anão que retorna quando arremessado"
        }
    },

    "alabarda": {
        name: "Alabarda",
        type: "arma",
        img: "icons/weapons/polearms/halberd-crescent-steel.webp",
        system: {
            tipo: "corpo_a_corpo",
            dano: { base: "1d12+3" },
            propriedades: {
                duas_maos: true,
                alcance: true,
                versatil: true
            },
            nivel_minimo: 5,
            qualidade: "superior",
            peso: 4,
            preco: { valor: 55, moeda: "mp" },
            bonus: {
                alcance: "3m"
            },
            descricao: "Arma de haste versátil com alcance de 3 metros"
        }
    },

    "machado_executioner": {
        name: "Machado Executioner",
        type: "arma",
        img: "icons/weapons/axes/axe-double-black.webp",
        system: {
            tipo: "corpo_a_corpo",
            dano: { base: "2d6+3" },
            propriedades: {
                duas_maos: true,
                critico_aprimorado: true,
                intimidante: true
            },
            nivel_minimo: 6,
            qualidade: "superior",
            peso: 5,
            preco: { valor: 100, moeda: "mp" },
            bonus: {
                critico: "10-12",
                intimidacao: 2
            },
            descricao: "Machado devastador com crítico em 10-12 e efeito intimidante"
        }
    },

    "lamina_runica": {
        name: "Lâmina Rúnica",
        type: "arma",
        img: "icons/weapons/swords/sword-broad-runes-blue.webp",
        system: {
            tipo: "corpo_a_corpo",
            dano: { base: "2d8+3" },
            propriedades: {
                duas_maos: true,
                magica: true,
                brilhante: true
            },
            nivel_minimo: 7,
            qualidade: "magica",
            peso: 3,
            preco: { valor: 200, moeda: "mp" },
            bonus: {
                ataque: 1,
                iluminacao: "brilha"
            },
            descricao: "Espada mágica com runas que brilham e concedem +1 ataque"
        }
    },

    "espada_destino": {
        name: "Espada do Destino",
        type: "arma",
        img: "icons/weapons/swords/sword-broad-golden.webp",
        system: {
            tipo: "corpo_a_corpo",
            dano: { base: "3d6+2" },
            propriedades: {
                duas_maos: true,
                lendaria: true,
                critico_supremo: true
            },
            nivel_minimo: 8,
            qualidade: "lendaria",
            peso: 2,
            preco: { valor: 500, moeda: "mp" },
            bonus: {
                ataque: 2,
                critico: "9-12"
            },
            descricao: "Arma lendária com +2 ataque e crítico em 9-12"
        }
    },

    // ARMAS À DISTÂNCIA AVANÇADAS
    "machado_arremesso": {
        name: "Machado de Arremesso",
        type: "arma",
        img: "icons/weapons/axes/axe-throwing-steel.webp",
        system: {
            tipo: "arremesso",
            dano: { base: "1d6+1" },
            propriedades: {
                arremesso: true,
                retorna_critico: true
            },
            nivel_minimo: 2,
            qualidade: "comum",
            peso: 1.5,
            preco: { valor: 12, moeda: "mp" },
            alcance: { curto: 8, medio: 15, longo: 25 },
            descricao: "Machado balanceado para arremesso que retorna em críticos"
        }
    },

    "lanca_arremesso": {
        name: "Lança de Arremesso",
        type: "arma",
        img: "icons/weapons/thrown/spear-simple-wood.webp",
        system: {
            tipo: "arremesso",
            dano: { base: "1d8" },
            propriedades: {
                arremesso: true,
                penetrante: true
            },
            nivel_minimo: 2,
            qualidade: "comum",
            peso: 2,
            preco: { valor: 15, moeda: "mp" },
            alcance: { curto: 15, medio: 30, longo: 50 },
            descricao: "Lança leve e penetrante projetada para arremesso"
        }
    },

    "estrela_ninja": {
        name: "Estrela Ninja",
        type: "arma",
        img: "icons/weapons/thrown/shuriken-star-steel.webp",
        system: {
            tipo: "arremesso",
            dano: { base: "1d4+2" },
            propriedades: {
                arremesso: true,
                silenciosa: true,
                oculta: true
            },
            nivel_minimo: 4,
            qualidade: "superior",
            peso: 0.1,
            preco: { valor: 20, moeda: "mp" },
            alcance: { curto: 10, medio: 20, longo: 30 },
            descricao: "Projétil silencioso e fácil de ocultar"
        }
    },

    "arco_composto": {
        name: "Arco Composto",
        type: "arma",
        img: "icons/weapons/bows/bow-recurve-brown.webp",
        system: {
            tipo: "distancia",
            dano: { base: "1d8+3" },
            propriedades: {
                duas_maos: true,
                adiciona_fisico: true
            },
            nivel_minimo: 4,
            qualidade: "superior",
            peso: 1.2,
            preco: { valor: 50, moeda: "mp" },
            alcance: { curto: 40, medio: 80, longo: 160 },
            bonus: {
                dano_fisico: true
            },
            descricao: "Arco que adiciona Físico ao dano"
        }
    },

    "arco_elfico": {
        name: "Arco Élfico",
        type: "arma",
        img: "icons/weapons/bows/bow-recurve-ornate.webp",
        system: {
            tipo: "distancia",
            dano: { base: "2d6+1" },
            propriedades: {
                duas_maos: true,
                elfico: true,
                magico: true
            },
            nivel_minimo: 5,
            qualidade: "elfica",
            peso: 1,
            preco: { valor: 80, moeda: "mp" },
            alcance: { curto: 60, medio: 120, longo: 240 },
            bonus: {
                ataque: 1
            },
            descricao: "Arco élfico mágico com +1 ataque"
        }
    },

    "arco_sombrio": {
        name: "Arco Sombrio",
        type: "arma",
        img: "icons/weapons/bows/bow-recurve-black.webp",
        system: {
            tipo: "distancia",
            dano: { base: "1d10+2" },
            propriedades: {
                duas_maos: true,
                silencioso: true,
                furtividade: true
            },
            nivel_minimo: 6,
            qualidade: "magica",
            peso: 1.3,
            preco: { valor: 120, moeda: "mp" },
            alcance: { curto: 50, medio: 100, longo: 200 },
            bonus: {
                furtividade: 2
            },
            descricao: "Arco silencioso que concede +2 Furtividade"
        }
    },

    "arco_ventos": {
        name: "Arco dos Ventos",
        type: "arma",
        img: "icons/weapons/bows/bow-recurve-glowing.webp",
        system: {
            tipo: "distancia",
            dano: { base: "2d6+2" },
            propriedades: {
                duas_maos: true,
                magico: true,
                ignora_vento: true
            },
            nivel_minimo: 7,
            qualidade: "magica",
            peso: 0.8,
            preco: { valor: 250, moeda: "mp" },
            alcance: { curto: 80, medio: 160, longo: 320 },
            bonus: {
                alcance: 2
            },
            descricao: "Arco mágico que ignora vento e tem +2 alcance"
        }
    },

    "arco_lendario": {
        name: "Arco Lendário",
        type: "arma",
        img: "icons/weapons/bows/bow-recurve-gold.webp",
        system: {
            tipo: "distancia",
            dano: { base: "2d8+3" },
            propriedades: {
                duas_maos: true,
                lendario: true,
                critico_aprimorado: true
            },
            nivel_minimo: 8,
            qualidade: "lendaria",
            peso: 1,
            preco: { valor: 600, moeda: "mp" },
            alcance: { curto: 100, medio: 200, longo: 400 },
            bonus: {
                ataque: 2,
                critico: "10-12"
            },
            descricao: "Arco de poder supremo com +2 ataque e crítico em 10-12"
        }
    },

    // BESTAS AVANÇADAS
    "besta_pesada": {
        name: "Besta Pesada",
        type: "arma",
        img: "icons/weapons/crossbows/crossbow-heavy-steel.webp",
        system: {
            tipo: "distancia",
            dano: { base: "1d10+2" },
            propriedades: {
                duas_maos: true,
                penetrante: true,
                lenta: true
            },
            nivel_minimo: 4,
            qualidade: "comum",
            peso: 4,
            preco: { valor: 40, moeda: "mp" },
            alcance: { curto: 50, medio: 100, longo: 150 },
            descricao: "Besta penetrante mas muito lenta para recarregar"
        }
    },

    "besta_repeticao": {
        name: "Besta Repetição",
        type: "arma",
        img: "icons/weapons/crossbows/crossbow-repeating.webp",
        system: {
            tipo: "distancia",
            dano: { base: "1d8+2" },
            propriedades: {
                duas_maos: true,
                repeticao: true
            },
            nivel_minimo: 5,
            qualidade: "superior",
            peso: 3,
            preco: { valor: 80, moeda: "mp" },
            alcance: { curto: 35, medio: 70, longo: 140 },
            bonus: {
                tiros: 3
            },
            descricao: "Besta que dispara 3 tiros antes de precisar recarregar"
        }
    },

    "besta_elfica": {
        name: "Besta Élfica",
        type: "arma",
        img: "icons/weapons/crossbows/crossbow-ornate.webp",
        system: {
            tipo: "distancia",
            dano: { base: "1d10+3" },
            propriedades: {
                duas_maos: true,
                elfica: true,
                silenciosa: true
            },
            nivel_minimo: 6,
            qualidade: "elfica",
            peso: 2.5,
            preco: { valor: 150, moeda: "mp" },
            alcance: { curto: 60, medio: 120, longo: 180 },
            bonus: {
                ataque: 1
            },
            descricao: "Besta élfica silenciosa com +1 ataque"
        }
    },

    "besta_cerco": {
        name: "Besta de Cerco",
        type: "arma",
        img: "icons/weapons/crossbows/crossbow-siege.webp",
        system: {
            tipo: "distancia",
            dano: { base: "2d8+2" },
            propriedades: {
                duas_maos: true,
                devastadora: true,
                pesada: true
            },
            nivel_minimo: 7,
            qualidade: "militar",
            peso: 8,
            preco: { valor: 300, moeda: "mp" },
            alcance: { curto: 80, medio: 160, longo: 240 },
            descricao: "Besta devastadora de duas mãos para guerra"
        }
    },

    // ARMADURAS AVANÇADAS
    "couro_sombrio": {
        name: "Couro Sombrio",
        type: "armadura",
        img: "icons/equipment/chest/leather-vest-black.webp",
        system: {
            protecao: 3,
            mod_defesa: 2,
            propriedades: {
                leve: true,
                furtividade: true
            },
            nivel_minimo: 4,
            qualidade: "magica",
            peso: 6,
            preco: { valor: 80, moeda: "mp" },
            bonus: {
                furtividade: 1
            },
            descricao: "Armadura especial que concede +1 Furtividade"
        }
    },

    "couro_dragao": {
        name: "Couro de Dragão",
        type: "armadura",
        img: "icons/equipment/chest/leather-vest-red.webp",
        system: {
            protecao: 4,
            mod_defesa: 3,
            propriedades: {
                leve: true,
                resistencia_fogo: true
            },
            nivel_minimo: 6,
            qualidade: "exotica",
            peso: 7,
            preco: { valor: 200, moeda: "mp" },
            bonus: {
                resistencia: "fogo"
            },
            descricao: "Armadura feita de couro de dragão com resistência ao fogo"
        }
    },

    "malha_elfica": {
        name: "Malha Élfica",
        type: "armadura",
        img: "icons/equipment/chest/chainmail-silver.webp",
        system: {
            protecao: 5,
            mod_defesa: 4,
            propriedades: {
                media: true,
                elfica: true
            },
            nivel_minimo: 5,
            qualidade: "elfica",
            peso: 8,
            preco: { valor: 150, moeda: "mp" },
            penalidades: {
                furtividade: -2
            },
            descricao: "Cota de malha élfica mais leve que a comum"
        }
    },

    "armadura_escamada": {
        name: "Armadura Escamada",
        type: "armadura",
        img: "icons/equipment/chest/breastplate-scale-grey.webp",
        system: {
            protecao: 5,
            mod_defesa: 4,
            propriedades: {
                media: true,
                escamada: true
            },
            nivel_minimo: 5,
            qualidade: "superior",
            peso: 18,
            preco: { valor: 120, moeda: "mp" },
            penalidades: {
                furtividade: -4
            },
            descricao: "Armadura de escamas metálicas sobrepostas"
        }
    },

    "malha_ana": {
        name: "Malha Anã",
        type: "armadura",
        img: "icons/equipment/chest/chainmail-dwarven.webp",
        system: {
            protecao: 6,
            mod_defesa: 5,
            propriedades: {
                media: true,
                ana: true,
                resistencia_magia: true
            },
            nivel_minimo: 6,
            qualidade: "ana",
            peso: 12,
            preco: { valor: 200, moeda: "mp" },
            bonus: {
                resistencia_magia: 1
            },
            descricao: "Cota de malha anã com +1 vs magia"
        }
    },

    "armadura_campo": {
        name: "Armadura de Campo",
        type: "armadura",
        img: "icons/equipment/chest/breastplate-layered-steel.webp",
        system: {
            protecao: 7,
            mod_defesa: 6,
            propriedades: {
                pesada: true,
                mobilidade: true
            },
            nivel_minimo: 7,
            qualidade: "superior",
            peso: 22,
            preco: { valor: 400, moeda: "mp" },
            penalidades: {
                furtividade: -6,
                acao: -1
            },
            descricao: "Armadura de placas otimizada para mobilidade"
        }
    },

    "placas_elficas": {
        name: "Placas Élficas",
        type: "armadura",
        img: "icons/equipment/chest/breastplate-ornate-silver.webp",
        system: {
            protecao: 7,
            mod_defesa: 6,
            propriedades: {
                pesada: true,
                elfica: true
            },
            nivel_minimo: 7,
            qualidade: "elfica",
            peso: 18,
            preco: { valor: 600, moeda: "mp" },
            penalidades: {
                furtividade: -4
            },
            descricao: "Armadura de placas élfica mais leve"
        }
    },

    "armadura_ana": {
        name: "Armadura Anã",
        type: "armadura",
        img: "icons/equipment/chest/breastplate-dwarven.webp",
        system: {
            protecao: 8,
            mod_defesa: 7,
            propriedades: {
                pesada: true,
                ana: true,
                resistencia_magia: true
            },
            nivel_minimo: 7,
            qualidade: "ana",
            peso: 28,
            preco: { valor: 500, moeda: "mp" },
            bonus: {
                resistencia_magia: 2
            },
            descricao: "Armadura de placas anã com +2 vs magia"
        }
    },

    "placas_draconicas": {
        name: "Placas Dracônicas",
        type: "armadura",
        img: "icons/equipment/chest/breastplate-dragon-red.webp",
        system: {
            protecao: 8,
            mod_defesa: 7,
            propriedades: {
                pesada: true,
                draconica: true,
                resistencia_elemental: true
            },
            nivel_minimo: 8,
            qualidade: "exotica",
            peso: 25,
            preco: { valor: 1000, moeda: "mp" },
            bonus: {
                resistencia: "elemental"
            },
            descricao: "Armadura com resistência elemental"
        }
    },

    "armadura_celestial": {
        name: "Armadura Celestial",
        type: "armadura",
        img: "icons/equipment/chest/breastplate-glowing-gold.webp",
        system: {
            protecao: 9,
            mod_defesa: 8,
            propriedades: {
                pesada: true,
                celestial: true,
                abencaoada: true
            },
            nivel_minimo: 9,
            qualidade: "celestial",
            peso: 20,
            preco: { valor: 2000, moeda: "mp" },
            bonus: {
                todos_atributos: 1
            },
            descricao: "Armadura abençoada que aumenta todos os atributos"
        }
    },

    "placas_lendarias": {
        name: "Placas Lendárias",
        type: "armadura",
        img: "icons/equipment/chest/breastplate-runed-gold.webp",
        system: {
            protecao: 10,
            mod_defesa: 9,
            propriedades: {
                pesada: true,
                lendaria: true,
                imune_criticos: true
            },
            nivel_minimo: 10,
            qualidade: "lendaria",
            peso: 30,
            preco: { valor: 5000, moeda: "mp" },
            bonus: {
                imunidade: "criticos"
            },
            descricao: "Armadura suprema imune a críticos"
        }
    },

    // ESCUDOS AVANÇADOS
    "escudo_elfico": {
        name: "Escudo Élfico",
        type: "escudo",
        img: "icons/equipment/shield/buckler-ornate-silver.webp",
        system: {
            protecao: 2,
            mod_defesa: 3,
            propriedades: {
                leve: true,
                elfico: true,
                resistencia_magia: true
            },
            nivel_minimo: 4,
            qualidade: "elfica",
            peso: 2,
            preco: { valor: 60, moeda: "mp" },
            bonus: {
                resistencia_magia: 1
            },
            descricao: "Escudo élfico com +1 vs magia"
        }
    },

    "escudo_anao": {
        name: "Escudo Anão",
        type: "escudo",
        img: "icons/equipment/shield/heater-steel-worn.webp",
        system: {
            protecao: 3,
            mod_defesa: 4,
            propriedades: {
                medio: true,
                anao: true,
                anti_dragao: true
            },
            nivel_minimo: 5,
            qualidade: "ana",
            peso: 4,
            preco: { valor: 80, moeda: "mp" },
            bonus: {
                vs_dragoes: 2
            },
            descricao: "Escudo anão com +2 vs dragões"
        }
    },

    "escudo_espelhado": {
        name: "Escudo Espelhado",
        type: "escudo",
        img: "icons/equipment/shield/buckler-crystal-blue.webp",
        system: {
            protecao: 2,
            mod_defesa: 3,
            propriedades: {
                medio: true,
                magico: true,
                reflexao: true
            },
            nivel_minimo: 6,
            qualidade: "magica",
            peso: 3,
            preco: { valor: 120, moeda: "mp" },
            bonus: {
                reflexao_magia: 50
            },
            descricao: "Escudo que reflete magias (50% chance)"
        }
    },

    "escudo_sombrio": {
        name: "Escudo Sombrio",
        type: "escudo",
        img: "icons/equipment/shield/heater-black.webp",
        system: {
            protecao: 3,
            mod_defesa: 3,
            propriedades: {
                medio: true,
                sombrio: true,
                furtividade: true
            },
            nivel_minimo: 6,
            qualidade: "magica",
            peso: 4,
            preco: { valor: 150, moeda: "mp" },
            bonus: {
                furtividade: 2
            },
            descricao: "Escudo que concede +2 Furtividade"
        }
    },

    "escudo_lendario": {
        name: "Escudo Lendário",
        type: "escudo",
        img: "icons/equipment/shield/heater-gold-winged.webp",
        system: {
            protecao: 4,
            mod_defesa: 5,
            propriedades: {
                grande: true,
                lendario: true,
                bonus_universal: true
            },
            nivel_minimo: 8,
            qualidade: "lendaria",
            peso: 3,
            preco: { valor: 500, moeda: "mp" },
            bonus: {
                todos_testes: 1
            },
            descricao: "Escudo supremo que concede +1 em todos os testes"
        }
    }
};

export const CAJADOS_EXPANDIDOS = {
    "cajado_fogo": {
        name: "Cajado do Fogo",
        type: "arma",
        img: "icons/weapons/staves/staff-ornate-red.webp",
        system: {
            tipo: "cajado",
            dano: { base: "1d6" },
            propriedades: {
                duas_maos: true,
                magico: true,
                especializado: true
            },
            nivel_minimo: 4,
            qualidade: "magica",
            peso: 2,
            preco: { valor: 150, moeda: "mp" },
            bonus: {
                pm_maximo: 2,
                magias_fogo: -1
            },
            cargas: { atual: 3, max: 3, por_dia: true },
            descricao: "Cajado especializado que reduz custo de magias de fogo em 1 PM"
        }
    },

    "cajado_gelo": {
        name: "Cajado do Gelo",
        type: "arma",
        img: "icons/weapons/staves/staff-ornate-blue.webp",
        system: {
            tipo: "cajado",
            dano: { base: "1d6" },
            propriedades: {
                duas_maos: true,
                magico: true,
                especializado: true
            },
            nivel_minimo: 4,
            qualidade: "magica",
            peso: 2,
            preco: { valor: 150, moeda: "mp" },
            bonus: {
                pm_maximo: 2,
                magias_gelo: -1
            },
            cargas: { atual: 3, max: 3, por_dia: true },
            descricao: "Cajado especializado que reduz custo de magias de gelo em 1 PM"
        }
    },

    "cajado_cura": {
        name: "Cajado da Cura",
        type: "arma",
        img: "icons/weapons/staves/staff-ornate-green.webp",
        system: {
            tipo: "cajado",
            dano: { base: "1d6" },
            propriedades: {
                duas_maos: true,
                magico: true,
                especializado: true
            },
            nivel_minimo: 4,
            qualidade: "magica",
            peso: 2,
            preco: { valor: 180, moeda: "mp" },
            bonus: {
                pm_maximo: 2,
                magias_cura: -1
            },
            cargas: { atual: 3, max: 3, por_dia: true },
            descricao: "Cajado especializado que reduz custo de magias de cura em 1 PM"
        }
    },

    "cajado_sombras": {
        name: "Cajado das Sombras",
        type: "arma",
        img: "icons/weapons/staves/staff-ornate-purple.webp",
        system: {
            tipo: "cajado",
            dano: { base: "1d6" },
            propriedades: {
                duas_maos: true,
                magico: true,
                especializado: true
            },
            nivel_minimo: 5,
            qualidade: "magica",
            peso: 2,
            preco: { valor: 250, moeda: "mp" },
            bonus: {
                pm_maximo: 3,
                magias_ilusao: -2
            },
            cargas: { atual: 2, max: 2, por_dia: true },
            descricao: "Cajado que reduz custo de magias de ilusão em 2 PM"
        }
    },

    "cajado_natureza": {
        name: "Cajado da Natureza",
        type: "arma",
        img: "icons/weapons/staves/staff-nature-spiral.webp",
        system: {
            tipo: "cajado",
            dano: { base: "1d6" },
            propriedades: {
                duas_maos: true,
                magico: true,
                natureza: true
            },
            nivel_minimo: 5,
            qualidade: "magica",
            peso: 2,
            preco: { valor: 220, moeda: "mp" },
            bonus: {
                pm_maximo: 3,
                comunicacao_natureza: true
            },
            cargas: { atual: 3, max: 3, por_dia: true },
            descricao: "Cajado que permite comunicação com animais e plantas"
        }
    },

    "cajado_tempo": {
        name: "Cajado do Tempo",
        type: "arma",
        img: "icons/weapons/staves/staff-ornate-gold.webp",
        system: {
            tipo: "cajado",
            dano: { base: "1d8" },
            propriedades: {
                duas_maos: true,
                magico: true,
                temporal: true
            },
            nivel_minimo: 7,
            qualidade: "rara",
            peso: 2,
            preco: { valor: 800, moeda: "mp" },
            bonus: {
                pm_maximo: 5,
                magia_tempo: true
            },
            cargas: { atual: 1, max: 1, por_dia: true },
            descricao: "Cajado poderoso que pode acelerar ou retardar o tempo"
        }
    },

    "cajado_arcano": {
        name: "Cajado Arcano",
        type: "arma",
        img: "icons/weapons/staves/staff-crystal-blue.webp",
        system: {
            tipo: "cajado",
            dano: { base: "1d8" },
            propriedades: {
                duas_maos: true,
                magico: true,
                arcano: true
            },
            nivel_minimo: 6,
            qualidade: "magica",
            peso: 2,
            preco: { valor: 500, moeda: "mp" },
            bonus: {
                pm_maximo: 4,
                todos_testes_magicos: 3
            },
            descricao: "Cajado que concede +3 em todos os testes mágicos"
        }
    },

    "cajado_poder": {
        name: "Cajado do Poder",
        type: "arma",
        img: "icons/weapons/staves/staff-crystal-rainbow.webp",
        system: {
            tipo: "cajado",
            dano: { base: "2d6" },
            propriedades: {
                duas_maos: true,
                magico: true,
                poder_supremo: true
            },
            nivel_minimo: 8,
            qualidade: "lendaria",
            peso: 2,
            preco: { valor: 1500, moeda: "mp" },
            bonus: {
                pm_maximo_dobrado: true
            },
            descricao: "Cajado supremo que dobra os PM máximos"
        }
    }
};

export const VARINHAS_EXPANDIDAS = {
    "varinha_polimorfismo": {
        name: "Varinha de Polimorfismo",
        type: "arma",
        img: "icons/weapons/wands/wand-carved-purple.webp",
        system: {
            tipo: "varinha",
            dano: { base: "1d4" },
            propriedades: {
                uma_mao: true,
                magica: true,
                polimorfismo: true
            },
            nivel_minimo: 6,
            qualidade: "magica",
            peso: 0.5,
            preco: { valor: 400, moeda: "mp" },
            cargas: { atual: 1, max: 1, por_dia: true },
            efeito: "Transforma inimigo",
            descricao: "Varinha que transforma inimigos"
        }
    },

    "varinha_teletransporte": {
        name: "Varinha de Teletransporte",
        type: "arma",
        img: "icons/weapons/wands/wand-carved-blue.webp",
        system: {
            tipo: "varinha",
            dano: { base: "1d4" },
            propriedades: {
                uma_mao: true,
                magica: true,
                teletransporte: true
            },
            nivel_minimo: 7,
            qualidade: "magica",
            peso: 0.5,
            preco: { valor: 600, moeda: "mp" },
            cargas: { atual: 1, max: 1, por_dia: true },
            efeito: "Teletransporte",
            descricao: "Varinha que permite teletransporte"
        }
    }
};

export const ITENS_MAGICOS_EXPANDIDOS = {
    // AMULETOS E COLARES
    "amuleto_vida": {
        name: "Amuleto da Vida",
        type: "equipamento",
        img: "icons/equipment/neck/amulet-heart-red.webp",
        system: {
            tipo: "amuleto",
            equipavel: true,
            nivel_minimo: 2,
            qualidade: "magica",
            peso: 0.1,
            preco: { valor: 400, moeda: "mp" },
            bonus: {
                pv_maximo: 5
            },
            descricao: "Amuleto que concede +5 PV permanente"
        }
    },

    "amuleto_magia": {
        name: "Amuleto da Magia",
        type: "equipamento",
        img: "icons/equipment/neck/amulet-crystal-blue.webp",
        system: {
            tipo: "amuleto",
            equipavel: true,
            nivel_minimo: 2,
            qualidade: "magica",
            peso: 0.1,
            preco: { valor: 400, moeda: "mp" },
            bonus: {
                pm_maximo: 3
            },
            descricao: "Amuleto que concede +3 PM permanente"
        }
    },

    "colar_perolas": {
        name: "Colar de Pérolas",
        type: "equipamento",
        img: "icons/equipment/neck/necklace-pearls.webp",
        system: {
            tipo: "colar",
            equipavel: true,
            nivel_minimo: 4,
            qualidade: "superior",
            peso: 0.2,
            preco: { valor: 800, moeda: "mp" },
            bonus: {
                social: 2,
                resistencia_encantamento: 1
            },
            descricao: "Colar elegante que concede +2 Social e +1 vs encantamentos"
        }
    },

    "amuleto_protecao": {
        name: "Amuleto de Proteção",
        type: "equipamento",
        img: "icons/equipment/neck/amulet-shield-silver.webp",
        system: {
            tipo: "amuleto",
            equipavel: true,
            nivel_minimo: 4,
            qualidade: "magica",
            peso: 0.1,
            preco: { valor: 1000, moeda: "mp" },
            bonus: {
                resistencia_magia: 2
            },
            descricao: "Amuleto que concede +2 vs magia"
        }
    },

    "colar_dragao": {
        name: "Colar de Dragão",
        type: "equipamento",
        img: "icons/equipment/neck/necklace-dragon-tooth.webp",
        system: {
            tipo: "colar",
            equipavel: true,
            nivel_minimo: 6,
            qualidade: "exotica",
            peso: 0.3,
            preco: { valor: 2000, moeda: "mp" },
            bonus: {
                resistencia_elemental: true
            },
            descricao: "Colar que concede resistência a um elemento"
        }
    },

    "amuleto_imortalidade": {
        name: "Amuleto da Imortalidade",
        type: "equipamento",
        img: "icons/equipment/neck/amulet-crystal-gold.webp",
        system: {
            tipo: "amuleto",
            equipavel: true,
            nivel_minimo: 8,
            qualidade: "lendaria",
            peso: 0.1,
            preco: { valor: 5000, moeda: "mp" },
            bonus: {
                nao_envelhece: true
            },
            descricao: "Amuleto que impede o envelhecimento"
        }
    },

    // BOTAS E LUVAS
    "botas_velocidade": {
        name: "Botas da Velocidade",
        type: "equipamento",
        img: "icons/equipment/feet/boots-leather-brown.webp",
        system: {
            tipo: "botas",
            equipavel: true,
            nivel_minimo: 3,
            qualidade: "magica",
            peso: 1,
            preco: { valor: 600, moeda: "mp" },
            bonus: {
                movimento: 3
            },
            descricao: "Botas que aumentam movimento em +3m"
        }
    },

    "botas_elfica": {
        name: "Botas Élficas",
        type: "equipamento",
        img: "icons/equipment/feet/boots-leather-green.webp",
        system: {
            tipo: "botas",
            equipavel: true,
            nivel_minimo: 4,
            qualidade: "elfica",
            peso: 0.8,
            preco: { valor: 800, moeda: "mp" },
            bonus: {
                furtividade: 3
            },
            descricao: "Botas que concedem +3 Furtividade"
        }
    },

    "botas_voo": {
        name: "Botas de Voo",
        type: "equipamento",
        img: "icons/equipment/feet/boots-winged-blue.webp",
        system: {
            tipo: "botas",
            equipavel: true,
            nivel_minimo: 6,
            qualidade: "magica",
            peso: 1.2,
            preco: { valor: 1500, moeda: "mp" },
            bonus: {
                levitacao: true
            },
            descricao: "Botas que permitem levitação constante"
        }
    },

    "luvas_forca": {
        name: "Luvas da Força",
        type: "equipamento",
        img: "icons/equipment/hand/gloves-leather-brown.webp",
        system: {
            tipo: "luvas",
            equipavel: true,
            nivel_minimo: 3,
            qualidade: "magica",
            peso: 0.5,
            preco: { valor: 500, moeda: "mp" },
            bonus: {
                fisico_agarrar: 2
            },
            descricao: "Luvas que concedem +2 Físico para agarrar"
        }
    },

    "luvas_ladrao": {
        name: "Luvas do Ladrão",
        type: "equipamento",
        img: "icons/equipment/hand/gloves-leather-black.webp",
        system: {
            tipo: "luvas",
            equipavel: true,
            nivel_minimo: 4,
            qualidade: "magica",
            peso: 0.3,
            preco: { valor: 700, moeda: "mp" },
            bonus: {
                desarmar_armadilhas: 3
            },
            descricao: "Luvas que concedem +3 para desarmar armadilhas"
        }
    },

    "luvas_mago": {
        name: "Luvas do Mago",
        type: "equipamento",
        img: "icons/equipment/hand/gloves-cloth-blue.webp",
        system: {
            tipo: "luvas",
            equipavel: true,
            nivel_minimo: 5,
            qualidade: "magica",
            peso: 0.2,
            preco: { valor: 1000, moeda: "mp" },
            bonus: {
                conjuracao: 2
            },
            descricao: "Luvas que concedem +2 em conjuração"
        }
    },

    // CAPAS E MANTOS
    "capa_viagem": {
        name: "Capa de Viagem",
        type: "equipamento",
        img: "icons/equipment/back/cloak-traveler-brown.webp",
        system: {
            tipo: "capa",
            equipavel: true,
            nivel_minimo: 1,
            qualidade: "comum",
            peso: 1,
            preco: { valor: 50, moeda: "mp" },
            bonus: {
                resistencia_clima: 1
            },
            descricao: "Capa que protege contra clima (+1 vs clima)"
        }
    },

    "capa_elfica": {
        name: "Capa Élfica",
        type: "equipamento",
        img: "icons/equipment/back/cloak-elven-green.webp",
        system: {
            tipo: "capa",
            equipavel: true,
            nivel_minimo: 4,
            qualidade: "elfica",
            peso: 0.8,
            preco: { valor: 1000, moeda: "mp" },
            bonus: {
                furtividade: 3
            },
            descricao: "Capa que concede +3 Furtividade"
        }
    },

    "manto_mago": {
        name: "Manto do Mago",
        type: "equipamento",
        img: "icons/equipment/back/cloak-mage-blue.webp",
        system: {
            tipo: "manto",
            equipavel: true,
            nivel_minimo: 5,
            qualidade: "magica",
            peso: 1.5,
            preco: { valor: 1500, moeda: "mp" },
            bonus: {
                defesa_vs_magia: 2
            },
            descricao: "Manto que concede +2 Defesa vs magia"
        }
    },

    "capa_sombras": {
        name: "Capa das Sombras",
        type: "equipamento",
        img: "icons/equipment/back/cloak-shadow-black.webp",
        system: {
            tipo: "capa",
            equipavel: true,
            nivel_minimo: 6,
            qualidade: "magica",
            peso: 1,
            preco: { valor: 2000, moeda: "mp" },
            cargas: { atual: 1, max: 1, por_dia: true },
            efeito: "Invisibilidade 1x/dia",
            descricao: "Capa que permite invisibilidade 1x/dia"
        }
    },

    "manto_dragao": {
        name: "Manto de Dragão",
        type: "equipamento",
        img: "icons/equipment/back/cloak-dragon-red.webp",
        system: {
            tipo: "manto",
            equipavel: true,
            nivel_minimo: 7,
            qualidade: "exotica",
            peso: 2,
            preco: { valor: 3000, moeda: "mp" },
            cargas: { atual: 1, max: 1, por_dia: true },
            efeito: "Voo 1x/dia",
            descricao: "Manto que permite voo 1x/dia"
        }
    }
};

export const INSTRUMENTOS_MAGICOS = {
    "flauta_encantamento": {
        name: "Flauta do Encantamento",
        type: "equipamento",
        img: "icons/tools/instruments/flute-simple.webp",
        system: {
            tipo: "instrumento",
            equipavel: false,
            nivel_minimo: 3,
            qualidade: "magica",
            peso: 0.5,
            preco: { valor: 200, moeda: "mp" },
            cargas: { atual: 1, max: 1, por_dia: true },
            efeito: "Charme 1x/dia",
            descricao: "Flauta mágica que pode encantar ouvintes"
        }
    },

    "tambor_guerra": {
        name: "Tambor de Guerra",
        type: "equipamento",
        img: "icons/tools/instruments/drum-brown.webp",
        system: {
            tipo: "instrumento",
            equipavel: false,
            nivel_minimo: 4,
            qualidade: "magica",
            peso: 2,
            preco: { valor: 300, moeda: "mp" },
            cargas: { atual: 1, max: 1, por_combate: true },
            efeito: "+1 ataque aliados por combate",
            descricao: "Tambor que inspira aliados (+1 ataque por combate)"
        }
    },

    "harpa_cura": {
        name: "Harpa da Cura",
        type: "equipamento",
        img: "icons/tools/instruments/harp-gold.webp",
        system: {
            tipo: "instrumento",
            equipavel: false,
            nivel_minimo: 5,
            qualidade: "magica",
            peso: 3,
            preco: { valor: 500, moeda: "mp" },
            cargas: { atual: 1, max: 1, por_dia: true },
            efeito: "Cura em área 1x/dia",
            descricao: "Harpa que pode curar em área 1x/dia"
        }
    },

    "lira_sono": {
        name: "Lira do Sono",
        type: "equipamento",
        img: "icons/tools/instruments/lyre-gold.webp",
        system: {
            tipo: "instrumento",
            equipavel: false,
            nivel_minimo: 4,
            qualidade: "magica",
            peso: 1,
            preco: { valor: 250, moeda: "mp" },
            cargas: { atual: 1, max: 1, por_dia: true },
            efeito: "Sono em área 1x/dia",
            descricao: "Lira que pode causar sono em área 1x/dia"
        }
    }
};

export const FERRAMENTAS_MAGICAS = {
    "gazuas_magicas": {
        name: "Gazuas Mágicas",
        type: "equipamento",
        img: "icons/tools/hand/lockpicks-steel.webp",
        system: {
            tipo: "ferramenta",
            equipavel: false,
            nivel_minimo: 4,
            qualidade: "magica",
            peso: 0.5,
            preco: { valor: 300, moeda: "mp" },
            bonus: {
                abrir_fechaduras: 4
            },
            descricao: "Gazuas encantadas que concedem +4 para abrir fechaduras"
        }
    },

    "corda_elfica": {
        name: "Corda Élfica",
        type: "equipamento",
        img: "icons/tools/navigation/rope-coiled-brown.webp",
        system: {
            tipo: "ferramenta",
            equipavel: false,
            nivel_minimo: 3,
            qualidade: "elfica",
            peso: 1,
            preco: { valor: 150, moeda: "mp" },
            bonus: {
                escalada: 3,
                comprimento: "30m"
            },
            descricao: "Corda mágica de 30m que concede +3 em escalada"
        }
    },

    "lanterna_eterna": {
        name: "Lanterna Eterna",
        type: "equipamento",
        img: "icons/tools/navigation/lantern-glowing.webp",
        system: {
            tipo: "ferramenta",
            equipavel: false,
            nivel_minimo: 3,
            qualidade: "magica",
            peso: 1,
            preco: { valor: 100, moeda: "mp" },
            bonus: {
                luz_infinita: true
            },
            descricao: "Lanterna que nunca se apaga"
        }
    },

    "tenda_magica": {
        name: "Tenda Mágica",
        type: "equipamento",
        img: "icons/environment/settlement/tent-leather.webp",
        system: {
            tipo: "ferramenta",
            equipavel: false,
            nivel_minimo: 4,
            qualidade: "magica",
            peso: 2,
            preco: { valor: 400, moeda: "mp" },
            bonus: {
                abrigo_perfeito: true
            },
            descricao: "Tenda que oferece abrigo perfeito"
        }
    },

    "mochila_dimensional": {
        name: "Mochila Dimensional",
        type: "equipamento",
        img: "icons/containers/bags/pack-leather-brown.webp",
        system: {
            tipo: "ferramenta",
            equipavel: true,
            nivel_minimo: 5,
            qualidade: "magica",
            peso: 1,
            preco: { valor: 800, moeda: "mp" },
            bonus: {
                capacidade: "100kg"
            },
            descricao: "Mochila com capacidade de 100kg"
        }
    }
};

export const MONTARIAS_EXPANDIDAS = {
    "cavalo_comum": {
        name: "Cavalo Comum",
        type: "equipamento",
        img: "icons/creatures/mammals/horse-brown.webp",
        system: {
            tipo: "montaria",
            equipavel: false,
            nivel_minimo: 1,
            qualidade: "comum",
            peso: 0, // Não carregado
            preco: { valor: 75, moeda: "mp" },
            bonus: {
                velocidade: "50 km/dia"
            },
            descricao: "Cavalo para transporte básico"
        }
    },

    "cavalo_guerra": {
        name: "Cavalo de Guerra",
        type: "equipamento",
        img: "icons/creatures/mammals/horse-armored.webp",
        system: {
            tipo: "montaria",
            equipavel: false,
            nivel_minimo: 3,
            qualidade: "militar",
            peso: 0,
            preco: { valor: 200, moeda: "mp" },
            bonus: {
                velocidade: "60 km/dia",
                ataque_montado: 2
            },
            descricao: "Cavalo treinado para combate (+2 ataque montado)"
        }
    },

    "ponei": {
        name: "Pônei",
        type: "equipamento",
        img: "icons/creatures/mammals/horse-pony.webp",
        system: {
            tipo: "montaria",
            equipavel: false,
            nivel_minimo: 1,
            qualidade: "comum",
            peso: 0,
            preco: { valor: 30, moeda: "mp" },
            bonus: {
                velocidade: "40 km/dia"
            },
            descricao: "Montaria pequena mas resistente"
        }
    },

    "cavalo_elfico": {
        name: "Cavalo Élfico",
        type: "equipamento",
        img: "icons/creatures/mammals/horse-white.webp",
        system: {
            tipo: "montaria",
            equipavel: false,
            nivel_minimo: 5,
            qualidade: "elfica",
            peso: 0,
            preco: { valor: 500, moeda: "mp" },
            bonus: {
                velocidade: "80 km/dia",
                acao: 3,
                inteligente: true
            },
            descricao: "Cavalo élfico inteligente (+3 Ação)"
        }
    },

    "grifo": {
        name: "Grifo",
        type: "equipamento",
        img: "icons/creatures/magical/griffin-flying.webp",
        system: {
            tipo: "montaria",
            equipavel: false,
            nivel_minimo: 7,
            qualidade: "exotica",
            peso: 0,
            preco: { valor: 2000, moeda: "mp" },
            bonus: {
                velocidade: "120 km/dia",
                voo: true,
                combate_aereo: true
            },
            descricao: "Criatura voadora para combate aéreo"
        }
    },

    "dragao_jovem": {
        name: "Dragão Jovem",
        type: "equipamento",
        img: "icons/creatures/magical/dragon-young.webp",
        system: {
            tipo: "montaria",
            equipavel: false,
            nivel_minimo: 9,
            qualidade: "lendaria",
            peso: 0,
            preco: { valor: 10000, moeda: "mp" },
            bonus: {
                velocidade: "200 km/dia",
                voo: true,
                sopro: true,
                inteligente: true
            },
            descricao: "Dragão jovem com voo, sopro e inteligência"
        }
    }
};