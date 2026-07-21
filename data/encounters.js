/* =====================================================
   OZEIN RPG — data/encounters.js
   Encontros da Missão 1 — com eventos roteirizados
   (ladino entra no Nó 1, Nessian foge, olhar do basilisco,
   gigante chefe com a forja instável).
   Números calibrados pro VIDEOGAME (party pequena de nível
   baixo), não pra mesa — o ND narrativo continua o da lore.
   ===================================================== */
GameData.register('encounters', {

  no1_matilha: {
    id: 'no1_matilha',
    nome: 'A Matilha da Entrada',
    fundo: 'assets/img/cenario-entrada-mina.png',
    tier: 'baixo', iLvl: 2,
    inimigos: [
      { ref: 'cao_infernal', img: 'assets/img/inimigo-cao.png', apelido: 'Cão Infernal', pv: 11, ca: 13, atk: 2, dano: '1d4+1', extraFogo: '1d3', atbVel: 8, icone: '🐕‍🦺' },
      { ref: 'cao_infernal', img: 'assets/img/inimigo-cao.png', apelido: 'Cão Infernal Batedor', pv: 9, ca: 13, atk: 2, dano: '1d4+1', extraFogo: '1d3', atbVel: 9, icone: '🐕‍🦺' },
      { ref: 'cao_infernal_nessian', img: 'assets/img/inimigo-alfa.png', apelido: 'Alfa Nessiano', pv: 28, ca: 15, atk: 4, dano: '1d6+2', extraFogo: '1d4', atbVel: 6, icone: '🐺',
        habilidades: ['sopro_fogo'], cadaN: 3,
        script: { fogeEmPv: 0.66, msgFuga: 'O Alfa Nessiano recua com um uivo que parece um CHAMADO — e mergulha na escuridão da mina, ferido mas vivo. Ele não fugiu de você. Foi AVISAR alguém.' } }
    ],
    scripts: [
      { quando: 'rodada', valor: 2, tipo: 'entraHeroi', heroi: 'ladino',
        msg: '💨 Uma bomba de fumaça estoura no flanco! O LADINO desce da pedreira com a rapieira em riste: "Falei que era pro flanco esquerdo! ...Deixa, eu me viro." — O ladino junta-se à party!' }
    ],
    recompensa: { xp: 700, ouro: [40, 80], drops: 2 },
    posVitoria: 'no1_vitoria'
  },

  no2_basilisco: {
    id: 'no2_basilisco',
    nome: 'O Basilisco de Renânia',
    fundo: 'assets/img/cenario-caverna.png',
    tier: 'medio', iLvl: 3,
    olharAtivo: true, // habilita o botão "Desviar os olhos" nos heróis
    inimigos: [
      { ref: 'basilisco', img: 'assets/img/inimigo-basilisco.png', apelido: 'Basilisco de Renânia', pv: 45, ca: 15, atk: 5, dano: '1d8+2', atbVel: 7, icone: '🦎',
        habilidades: ['olhar_petrificante'], cadaN: 2, chefe: true }
    ],
    recompensa: { xp: 900, ouro: [60, 100], drops: 2,
      fixos: ['secrecoes_basilisco'] },
    posVitoria: 'no2_vitoria'
  },

  no3_gigante: {
    id: 'no3_gigante',
    nome: 'A Forja do Gigante',
    fundo: 'assets/img/cenario-forja.png',
    tier: 'chefe', iLvl: 4,
    forjaInstavel: true, // ação de cenário: liberar vapor da forja
    inimigos: [
      { ref: 'gigante_fogo', img: 'assets/img/inimigo-gigante.png', apelido: 'Gigante do Fogo Ferreiro', pv: 64, ca: 17, atk: 6, dano: '2d6+3', atbVel: 4, icone: '🔥', chefe: true,
        habilidades: ['rocha_incandescente'], cadaN: 3, vulneravel: 'frio' },
      { ref: 'cao_infernal', img: 'assets/img/inimigo-cao.png', apelido: 'Cão de Forja', pv: 12, ca: 14, atk: 3, dano: '1d6+1', extraFogo: '1d3', atbVel: 8, icone: '🐕‍🦺', vulneravel: 'frio' },
      { ref: 'cao_infernal', img: 'assets/img/inimigo-cao.png', apelido: 'Cão de Forja', pv: 12, ca: 14, atk: 3, dano: '1d6+1', extraFogo: '1d3', atbVel: 8, icone: '🐕‍🦺', vulneravel: 'frio' }
    ],
    recompensa: { xp: 1400, ouro: [1650, 1750], drops: 3,
      fixos: ['relicario_anao', 'bastao_detector'] },
    posVitoria: 'no3_vitoria'
  },

  /* Re-exploração (farm) — versões sem script pra quando o nó já foi limpo */
  refarm_no1: {
    id: 'refarm_no1', nome: 'Ecos da Matilha', fundo: 'assets/img/cenario-entrada-mina.png',
    tier: 'baixo', iLvl: 2, fatorXp: 0.5,
    inimigos: [
      { ref: 'cao_infernal', img: 'assets/img/inimigo-cao.png', apelido: 'Cão Infernal', pv: 11, ca: 13, atk: 3, dano: '1d6+1', extraFogo: '1d3', atbVel: 8, icone: '🐕‍🦺' },
      { ref: 'cao_infernal', img: 'assets/img/inimigo-cao.png', apelido: 'Cão Infernal', pv: 11, ca: 13, atk: 3, dano: '1d6+1', extraFogo: '1d3', atbVel: 9, icone: '🐕‍🦺' }
    ],
    recompensa: { xp: 350, ouro: [20, 50], drops: 1 }
  },
  refarm_no2: {
    id: 'refarm_no2', nome: 'Ninho Vazio... Quase', fundo: 'assets/img/cenario-caverna.png',
    tier: 'medio', iLvl: 3, fatorXp: 0.5, olharAtivo: true,
    inimigos: [
      { ref: 'basilisco', img: 'assets/img/inimigo-basilisco.png', apelido: 'Basilisco Jovem', pv: 28, ca: 14, atk: 4, dano: '1d6+2', atbVel: 8, icone: '🦎',
        habilidades: ['olhar_petrificante'], cadaN: 3 }
    ],
    recompensa: { xp: 450, ouro: [40, 70], drops: 1 }
  },
  refarm_no3: {
    id: 'refarm_no3', nome: 'Restos da Forja', fundo: 'assets/img/cenario-forja.png',
    tier: 'medio', iLvl: 4, fatorXp: 0.5,
    inimigos: [
      { ref: 'cao_infernal', img: 'assets/img/inimigo-cao.png', apelido: 'Cão de Forja', pv: 12, ca: 14, atk: 3, dano: '1d6+1', extraFogo: '1d3', atbVel: 8, icone: '🐕‍🦺' },
      { ref: 'cao_infernal', img: 'assets/img/inimigo-cao.png', apelido: 'Cão de Forja', pv: 12, ca: 14, atk: 3, dano: '1d6+1', extraFogo: '1d3', atbVel: 8, icone: '🐕‍🦺' },
      { ref: 'cao_infernal_nessian', img: 'assets/img/inimigo-alfa.png', apelido: 'Cão Nessiano Errante', pv: 24, ca: 15, atk: 4, dano: '1d6+2', extraFogo: '1d4', atbVel: 7, icone: '🐺', habilidades: ['sopro_fogo'], cadaN: 3 }
    ],
    recompensa: { xp: 600, ouro: [80, 140], drops: 2 }
  },

  /* ================= MISSÃO 2 — Os Pesadelos Selados ================= */

  m2_galeria: {
    id: 'm2_galeria', nome: 'A Galeria Escavada',
    fundo: 'assets/img/cenario-galeria.png',
    tier: 'baixo', iLvl: 5,
    inimigos: [
      { ref: 'cultista_capataz', apelido: 'Capataz Cultista', pv: 18, ca: 14, atk: 4, dano: '1d8+2', atbVel: 8, icone: '🪓' },
      { ref: 'cultista_capataz', apelido: 'Capataz do Chicote', pv: 16, ca: 14, atk: 4, dano: '1d6+2', atbVel: 9, icone: '🪓' },
      { ref: 'quasit', apelido: 'Quasit Espião', pv: 11, ca: 16, atk: 5, dano: '1d3+1', atbVel: 12, icone: '😈' }
    ],
    recompensa: { xp: 900, ouro: [80, 140], drops: 2 },
    posVitoria: 'm2_galeria_vitoria'
  },

  m2_bolsao: {
    id: 'm2_bolsao', nome: 'O Bolsão Anti-Planar',
    fundo: 'assets/img/cenario-bolsao.png',
    tier: 'medio', iLvl: 5,
    inimigos: [
      { ref: 'quasit', apelido: 'Quasit', pv: 13, ca: 16, atk: 5, dano: '1d3+1', atbVel: 12, icone: '😈' },
      { ref: 'quasit', apelido: 'Quasit', pv: 13, ca: 16, atk: 5, dano: '1d3+1', atbVel: 11, icone: '😈' },
      { ref: 'quasit', apelido: 'Quasit Uivante', pv: 15, ca: 17, atk: 6, dano: '1d4+1', atbVel: 12, icone: '😈' }
    ],
    recompensa: { xp: 800, ouro: [60, 120], drops: 2 },
    posVitoria: 'm2_bolsao_vitoria'
  },

  m2_antessala: {
    id: 'm2_antessala', nome: 'A Antessala do Selo',
    fundo: 'assets/img/cenario-antessala.png',
    tier: 'medio', iLvl: 6,
    inimigos: [
      { ref: 'babau', apelido: 'Babau Faminto', pv: 38, ca: 17, atk: 7, dano: '1d6+4', extraFogo: '1d4', atbVel: 8, icone: '🗡️' },
      { ref: 'babau', apelido: 'Babau Paciente', pv: 40, ca: 17, atk: 7, dano: '1d6+4', extraFogo: '1d4', atbVel: 7, icone: '🗡️',
        script: { fogeEmPv: 0.25, msgFuga: 'O Babau Paciente escorre pelas sombras da fresta como lodo — foi AVISAR alguém do outro lado que os heróis chegaram.' } }
    ],
    recompensa: { xp: 1100, ouro: [100, 170], drops: 2 },
    posVitoria: 'm2_antessala_vitoria'
  },

  m2_fissura: {
    id: 'm2_fissura', nome: 'A Fissura de Pesadelo',
    fundo: 'assets/img/cenario-fissura.png',
    tier: 'medio', iLvl: 6,
    inimigos: [
      { ref: 'fihyr', apelido: 'Fihyr', pv: 22, ca: 15, atk: 6, dano: '1d6+2', atbVel: 9, icone: '👁️' },
      { ref: 'fihyr', apelido: 'Fihyr Trêmulo', pv: 20, ca: 15, atk: 6, dano: '1d6+2', atbVel: 10, icone: '👁️' },
      { ref: 'fihyr', apelido: 'Fihyr Chorão', pv: 24, ca: 16, atk: 6, dano: '1d6+3', atbVel: 8, icone: '👁️' }
    ],
    recompensa: { xp: 1200, ouro: [90, 150], drops: 2 },
    posVitoria: 'm2_fissura_vitoria'
  },

  m2_paredao: {
    id: 'm2_paredao', nome: 'O Paredão — Drahz e Ekaterina',
    fundo: 'assets/img/cenario-paredao.png',
    tier: 'chefe', iLvl: 7,
    inimigos: [
      { ref: 'drahz', apelido: 'Drahz, o Guarda-Costas', pv: 52, ca: 18, atk: 8, dano: '2d6+3', atbVel: 10, icone: '🧝', chefe: true },
      { ref: 'ekaterina', apelido: 'Ekaterina, Sacerdotisa da Rubi', pv: 44, ca: 16, atk: 6, dano: '1d8+2', atbVel: 7, icone: '🔮', chefe: true,
        habilidades: ['lamento_funebre'], cadaN: 3 }
    ],
    recompensa: { xp: 1700, ouro: [200, 320], drops: 3 },
    posVitoria: 'm2_lysia_cena'
  },

  m2_grande_fihyr: {
    id: 'm2_grande_fihyr', nome: 'O QUE ESCAPOU — Grande Fihyr',
    fundo: 'assets/img/cenario-paredao.png',
    tier: 'chefe', iLvl: 7,
    inimigos: [
      { ref: 'grande_fihyr', apelido: 'Grande Fihyr', pv: 140, ca: 18, atk: 12, dano: '2d8+8', atbVel: 9, icone: '👁️', chefe: true,
        habilidades: ['aura_desespero'], cadaN: 2 }
    ],
    recompensa: { xp: 2200, ouro: [150, 250], drops: 3, fixos: ['lasca_ferro_runico'] },
    posVitoria: 'm2_epilogo'
  },

  /* Re-exploração M2 (farm) */
  refarm_m2_bolsao: {
    id: 'refarm_m2_bolsao', nome: 'Frestas do Bolsão', fundo: 'assets/img/cenario-bolsao.png',
    tier: 'medio', iLvl: 6,
    inimigos: [
      { ref: 'quasit', apelido: 'Quasit', pv: 13, ca: 16, atk: 5, dano: '1d3+1', atbVel: 12, icone: '😈' },
      { ref: 'quasit', apelido: 'Quasit', pv: 13, ca: 16, atk: 5, dano: '1d3+1', atbVel: 11, icone: '😈' }
    ],
    recompensa: { xp: 400, ouro: [50, 90], drops: 1 }
  },
  refarm_m2_fissura: {
    id: 'refarm_m2_fissura', nome: 'Ecos de Pesadelo', fundo: 'assets/img/cenario-fissura.png',
    tier: 'medio', iLvl: 7,
    inimigos: [
      { ref: 'fihyr', apelido: 'Fihyr', pv: 22, ca: 15, atk: 6, dano: '1d6+2', atbVel: 9, icone: '👁️' },
      { ref: 'fihyr', apelido: 'Fihyr', pv: 22, ca: 15, atk: 6, dano: '1d6+2', atbVel: 9, icone: '👁️' }
    ],
    recompensa: { xp: 600, ouro: [70, 120], drops: 2 }
  },

  /* ================= MISSÃO 3 — A VILA QUE DORME ================= */

  m3_vau: {
    id: 'm3_vau', nome: 'Vau da Prata — a colheita do sono',
    fundo: 'assets/img/cenario-vau.png',
    tier: 'medio', iLvl: 7,
    inimigos: [
      { ref: 'irmao_vigilia', apelido: 'Irmão da Vigília', pv: 26, ca: 15, atk: 7, dano: '1d6+3', atbVel: 9, icone: '🕯️',
        habilidades: ['toque_do_sono'], cadaN: 3 },
      { ref: 'irmao_vigilia', apelido: 'Irmão Salmodiante', pv: 28, ca: 15, atk: 7, dano: '1d6+3', atbVel: 8, icone: '🕯️',
        habilidades: ['toque_do_sono'], cadaN: 3 },
      { ref: 'larva_pesadelo', apelido: 'Larva de Pesadelo', pv: 14, ca: 14, atk: 6, dano: '1d4+2', atbVel: 12, icone: '🐛' },
      { ref: 'larva_pesadelo', apelido: 'Larva Faminta', pv: 16, ca: 14, atk: 6, dano: '1d4+2', atbVel: 12, icone: '🐛' }
    ],
    recompensa: { xp: 1800, ouro: [120, 200], drops: 2 },
    posVitoria: 'm3_vau_vitoria'
  },

  m3_capela: {
    id: 'm3_capela', nome: 'Capela das Lamúrias',
    fundo: 'assets/img/cenario-capela.png',
    tier: 'medio', iLvl: 8,
    inimigos: [
      { ref: 'sacerdote_lamurias', apelido: 'Sacerdote Ceifeiro', pv: 34, ca: 16, atk: 8, dano: '1d8+3', atbVel: 8, icone: '💀',
        habilidades: ['prece_sombria'], cadaN: 3 },
      { ref: 'sacerdote_lamurias', apelido: 'Sacerdote Silente', pv: 32, ca: 16, atk: 8, dano: '1d8+3', atbVel: 9, icone: '💀',
        habilidades: ['prece_sombria'], cadaN: 3,
        script: { fogeEmPv: 0.2, msgFuga: 'O Sacerdote Silente engole a própria prece e FOGE pelos fundos — as Adagas Negras não morrem por contrato alheio.' } },
      { ref: 'fihyr', apelido: 'Fihyr de Guarda', pv: 24, ca: 16, atk: 6, dano: '1d6+3', atbVel: 9, icone: '👁️' }
    ],
    recompensa: { xp: 2200, ouro: [160, 260], drops: 3, fixos: ['perg_sono_profundo'] },
    posVitoria: 'm3_capela_vitoria'
  },

  m3_pasto: {
    id: 'm3_pasto', nome: 'Pasto de Cinzas — o corcel solto',
    fundo: 'assets/img/cenario-pasto.png',
    tier: 'chefe', iLvl: 8,
    inimigos: [
      { ref: 'pesadelo', apelido: 'Pesadelo', pv: 62, ca: 18, atk: 11, dano: '2d6+6', extraFogo: '1d6', atbVel: 11, icone: '🐴', chefe: true,
        vulneravel: 'frio', habilidades: ['fumaca_sufocante'], cadaN: 3 },
      { ref: 'larva_pesadelo', apelido: 'Larva de Pesadelo', pv: 14, ca: 14, atk: 6, dano: '1d4+2', atbVel: 12, icone: '🐛' },
      { ref: 'larva_pesadelo', apelido: 'Larva de Pesadelo', pv: 14, ca: 14, atk: 6, dano: '1d4+2', atbVel: 11, icone: '🐛' }
    ],
    recompensa: { xp: 2400, ouro: [180, 280], drops: 3 },
    posVitoria: 'm3_pasto_vitoria'
  },

  m3_covil: {
    id: 'm3_covil', nome: 'A Gruta do Véu — Madame Vevra',
    fundo: 'assets/img/cenario-gruta.png',
    tier: 'chefe', iLvl: 9,
    inimigos: [
      { ref: 'ancia_noturna', apelido: 'Madame Vevra, Anciã Noturna', pv: 80, ca: 18, atk: 10, dano: '2d6+6', atbVel: 9, icone: '🌙', chefe: true,
        habilidades: ['pesadelo_vivido'], cadaN: 2 },
      { ref: 'ekaterina_vigilia', apelido: 'Ekaterina, a Vigília Rubra', pv: 48, ca: 17, atk: 8, dano: '1d8+4', atbVel: 8, icone: '🔮', chefe: true,
        habilidades: ['lamento_funebre', 'vigilia_rubra'], cadaN: 3 }
    ],
    recompensa: { xp: 3000, ouro: [280, 420], drops: 3, fixos: ['perg_toque_vampirico', 'pedra_coracao'] },
    posVitoria: 'm3_lab_cena'
  },

  /* Re-exploração M3 (farm) */
  refarm_m3_vau: {
    id: 'refarm_m3_vau', nome: 'Sonhos Remanescentes', fundo: 'assets/img/cenario-vau.png',
    tier: 'medio', iLvl: 8,
    inimigos: [
      { ref: 'larva_pesadelo', apelido: 'Larva de Pesadelo', pv: 16, ca: 14, atk: 6, dano: '1d4+2', atbVel: 12, icone: '🐛' },
      { ref: 'larva_pesadelo', apelido: 'Larva de Pesadelo', pv: 16, ca: 14, atk: 6, dano: '1d4+2', atbVel: 12, icone: '🐛' },
      { ref: 'larva_pesadelo', apelido: 'Larva Gorda', pv: 20, ca: 14, atk: 7, dano: '1d4+3', atbVel: 11, icone: '🐛' }
    ],
    recompensa: { xp: 700, ouro: [80, 140], drops: 2 }
  },
  refarm_m3_pasto: {
    id: 'refarm_m3_pasto', nome: 'Cinzas que Sonham', fundo: 'assets/img/cenario-pasto.png',
    tier: 'medio', iLvl: 9,
    inimigos: [
      { ref: 'fihyr', apelido: 'Fihyr', pv: 24, ca: 16, atk: 7, dano: '1d6+3', atbVel: 9, icone: '👁️' },
      { ref: 'larva_pesadelo', apelido: 'Larva de Pesadelo', pv: 18, ca: 14, atk: 7, dano: '1d4+3', atbVel: 12, icone: '🐛' },
      { ref: 'larva_pesadelo', apelido: 'Larva de Pesadelo', pv: 18, ca: 14, atk: 7, dano: '1d4+3', atbVel: 11, icone: '🐛' }
    ],
    recompensa: { xp: 800, ouro: [100, 160], drops: 2 }
  },

  /* ================= MISSÃO 4 — A CIDADE DOS HERÓIS ================= */

  m4_armazem: {
    id: 'm4_armazem', nome: 'Armazém 7 — a escolta do tônico',
    fundo: 'assets/img/cenario-armazem.png',
    tier: 'medio', iLvl: 9,
    inimigos: [
      { ref: 'adaga_negra', apelido: 'Adaga Negra', pv: 38, ca: 18, atk: 10, dano: '1d6+5', atbVel: 11, icone: '🔪',
        habilidades: ['lamina_envenenada'], cadaN: 3 },
      { ref: 'adaga_negra', apelido: 'Adaga Negra Silente', pv: 40, ca: 18, atk: 10, dano: '1d6+5', atbVel: 12, icone: '🔪',
        habilidades: ['lamina_envenenada'], cadaN: 3,
        script: { fogeEmPv: 0.2, msgFuga: 'A Adaga Silente estilhaça um frasco de fumaça e SOME entre os caixotes — a irmandade não morre por carga alheia. Alguém no subsolo vai saber que vocês vêm.' } },
      { ref: 'irmao_vigilia', apelido: 'Capataz da Vigília', pv: 34, ca: 16, atk: 9, dano: '1d6+4', atbVel: 8, icone: '🕯️',
        habilidades: ['toque_do_sono'], cadaN: 3 }
    ],
    recompensa: { xp: 2600, ouro: [220, 350], drops: 2 },
    posVitoria: 'm4_armazem_vitoria'
  },

  m4_subterraneo: {
    id: 'm4_subterraneo', nome: 'Galerias do Subsolo — a patrulha rubra',
    fundo: 'assets/img/cenario-subterraneo.png',
    tier: 'medio', iLvl: 9,
    inimigos: [
      { ref: 'vigilante_rubro', apelido: 'Vigilante Rubro', pv: 46, ca: 18, atk: 10, dano: '1d8+5', atbVel: 9, icone: '🛡️',
        habilidades: ['lamento_funebre'], cadaN: 3 },
      { ref: 'vigilante_rubro', apelido: 'Vigilante Remendador', pv: 44, ca: 18, atk: 10, dano: '1d8+5', atbVel: 8, icone: '🛡️',
        habilidades: ['vigilia_rubra'], cadaN: 2 },
      { ref: 'fihyr', apelido: 'Fihyr de Esgoto', pv: 26, ca: 16, atk: 8, dano: '1d6+3', atbVel: 10, icone: '👁️' }
    ],
    recompensa: { xp: 2800, ouro: [240, 380], drops: 2 },
    posVitoria: 'm4_subterraneo_vitoria'
  },

  m4_santuario: {
    id: 'm4_santuario', nome: 'Santuário da Vigília — os casulos',
    fundo: 'assets/img/cenario-santuario.png',
    tier: 'medio', iLvl: 10,
    inimigos: [
      { ref: 'irmao_vigilia', apelido: 'Irmão Coletor', pv: 36, ca: 16, atk: 9, dano: '1d6+4', atbVel: 9, icone: '🕯️',
        habilidades: ['toque_do_sono'], cadaN: 3 },
      { ref: 'irmao_vigilia', apelido: 'Irmão Salmodiante', pv: 36, ca: 16, atk: 9, dano: '1d6+4', atbVel: 8, icone: '🕯️',
        habilidades: ['toque_do_sono'], cadaN: 3 },
      { ref: 'fihyr', apelido: 'Fihyr Adulto', pv: 48, ca: 17, atk: 10, dano: '1d8+4', atbVel: 9, icone: '👁️',
        habilidades: ['aura_desespero'], cadaN: 3 },
      { ref: 'larva_pesadelo', apelido: 'Larva Gorda', pv: 22, ca: 14, atk: 8, dano: '1d4+3', atbVel: 12, icone: '🐛' }
    ],
    recompensa: { xp: 3200, ouro: [260, 400], drops: 3 },
    posVitoria: 'm4_santuario_vitoria'
  },

  m4_forum: {
    id: 'm4_forum', nome: 'O Fórum Afundado — a Coroa e a Coroadora',
    fundo: 'assets/img/cenario-forum.png',
    tier: 'chefe', iLvl: 10,
    inimigos: [
      { ref: 'yara_lamina', apelido: 'Yara, a Lâmina de Úbia', pv: 105, ca: 20, atk: 12, dano: '1d10+6', atbVel: 11, icone: '⚔️', chefe: true,
        habilidades: ['lamina_tempestade'], cadaN: 3 },
      { ref: 'lysia_moss', apelido: 'Lysia Moss, a Blood Magus', pv: 90, ca: 19, atk: 11, dano: '1d6+4', atbVel: 9, icone: '🩸', chefe: true,
        habilidades: ['ritual_de_sangue', 'vigilia_rubra'], cadaN: 3,
        script: { fogeEmPv: 0.35, msgFuga: '🩸 Lysia fecha a palma cortada. "Chega. Vocês custam mais do que rendem." Ela recua para a sombra com a reverência de sempre — MENOS elegante, desta vez — e SOME. A Coroa de Sonho vacila na testa de Yara!' } },
      { ref: 'vigilante_rubro', apelido: 'Vigilante da Coroa', pv: 40, ca: 18, atk: 10, dano: '1d8+4', atbVel: 8, icone: '🛡️' }
    ],
    recompensa: { xp: 4500, ouro: [420, 650], drops: 3 },
    posVitoria: 'm4_forum_vitoria'
  },

  /* Re-exploração M4 (farm) */
  refarm_m4_armazem: {
    id: 'refarm_m4_armazem', nome: 'Docas Inquietas', fundo: 'assets/img/cenario-armazem.png',
    tier: 'medio', iLvl: 9,
    inimigos: [
      { ref: 'adaga_negra', apelido: 'Adaga Negra', pv: 38, ca: 18, atk: 10, dano: '1d6+5', atbVel: 11, icone: '🔪' },
      { ref: 'adaga_negra', apelido: 'Adaga Negra', pv: 38, ca: 18, atk: 10, dano: '1d6+5', atbVel: 12, icone: '🔪' }
    ],
    recompensa: { xp: 900, ouro: [150, 240], drops: 2 }
  },
  refarm_m4_subterraneo: {
    id: 'refarm_m4_subterraneo', nome: 'Ecos sob Úbia', fundo: 'assets/img/cenario-subterraneo.png',
    tier: 'medio', iLvl: 10,
    inimigos: [
      { ref: 'vigilante_rubro', apelido: 'Vigilante Perdido', pv: 46, ca: 18, atk: 10, dano: '1d8+5', atbVel: 9, icone: '🛡️' },
      { ref: 'fihyr', apelido: 'Fihyr de Esgoto', pv: 26, ca: 16, atk: 8, dano: '1d6+3', atbVel: 10, icone: '👁️' },
      { ref: 'larva_pesadelo', apelido: 'Larva de Pesadelo', pv: 20, ca: 14, atk: 8, dano: '1d4+3', atbVel: 12, icone: '🐛' }
    ],
    recompensa: { xp: 1000, ouro: [160, 260], drops: 2 }
  }

});
