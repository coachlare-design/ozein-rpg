/* =====================================================
   OZEIN RPG — data/loot.js
   Sistema de loot estilo Diablo 2: bases + afixos por iLvl,
   raridades, únicos com nome e história, 1 conjunto.
   ===================================================== */
GameData.register('loot', {

  /* ---------- Bases (o "esqueleto" do item gerado) ---------- */
  bases: [
    { id: 'b_espada', nome: 'Espada Longa', slot: 'arma', categoria: 'marcial', dano: '1d8', critico: '19-20/×2', valor: 15, iLvlMin: 1 },
    { id: 'b_machado', nome: 'Machado de Batalha', slot: 'arma', categoria: 'marcial', dano: '1d8', critico: '×3', valor: 10, iLvlMin: 1 },
    { id: 'b_adaga', nome: 'Adaga', slot: 'arma', categoria: 'simples', dano: '1d4', critico: '19-20/×2', valor: 2, iLvlMin: 1 },
    { id: 'b_espada_curta', nome: 'Espada Curta', slot: 'arma', categoria: 'ladino', dano: '1d6', critico: '19-20/×2', valor: 10, iLvlMin: 1 },
    { id: 'b_martelo', nome: 'Martelo de Guerra', slot: 'arma', categoria: 'marcial', dano: '1d8', critico: '×3', valor: 12, iLvlMin: 2 },
    { id: 'b_couro', nome: 'Armadura de Couro', slot: 'armadura', categoria: 'leve', caBonus: 2, valor: 10, iLvlMin: 1 },
    { id: 'b_cota', nome: 'Cota de Malha', slot: 'armadura', categoria: 'media', caBonus: 5, valor: 150, iLvlMin: 3 },
    { id: 'b_escudo', nome: 'Escudo Pesado', slot: 'escudo', caBonus: 2, valor: 20, iLvlMin: 1 },
    { id: 'b_elmo', nome: 'Elmo de Ferro', slot: 'elmo', caBonus: 1, valor: 25, iLvlMin: 2 },
    { id: 'b_anel', nome: 'Anel', slot: 'anel', valor: 30, iLvlMin: 2 },
    { id: 'b_amuleto', nome: 'Amuleto', slot: 'amuleto', valor: 40, iLvlMin: 2 },
    { id: 'b_botas', nome: 'Botas de Couro', slot: 'botas', valor: 8, iLvlMin: 1 }
  ],

  /* ---------- Afixos (prefixos e sufixos) ---------- */
  prefixos: [
    { id: 'p_afiado',   nome: 'Afiado',      efeito: { bonusDano: 1 }, iLvl: 1 },
    { id: 'p_brutal',   nome: 'Brutal',      efeito: { bonusDano: 2 }, iLvl: 3 },
    { id: 'p_flamejante', nome: 'Flamejante', efeito: { danoExtra: '1d4', elemento: 'fogo' }, iLvl: 3 },
    { id: 'p_gelido',   nome: 'Gélido',      efeito: { danoExtra: '1d4', elemento: 'frio' }, iLvl: 3 },
    { id: 'p_certeiro', nome: 'Certeiro',    efeito: { bonusAcerto: 1 }, iLvl: 1 },
    { id: 'p_veterano', nome: 'do Veterano', efeito: { bonusAcerto: 2 }, iLvl: 4 },
    { id: 'p_reforcado', nome: 'Reforçado',  efeito: { caExtra: 1 }, iLvl: 1, slots: ['armadura', 'escudo', 'elmo', 'botas'] },
    { id: 'p_encantado', nome: 'Encantado',  efeito: { caExtra: 2 }, iLvl: 4, slots: ['armadura', 'escudo', 'elmo'] }
  ],
  sufixos: [
    { id: 's_urso',     nome: 'do Urso',     efeito: { atributo: 'FOR', bonus: 1 }, iLvl: 2 },
    { id: 's_raposa',   nome: 'da Raposa',   efeito: { atributo: 'DES', bonus: 1 }, iLvl: 2 },
    { id: 's_touro',    nome: 'do Touro',    efeito: { pvExtra: 5 }, iLvl: 1 },
    { id: 's_montanha', nome: 'da Montanha', efeito: { pvExtra: 10 }, iLvl: 4 },
    { id: 's_vibora',   nome: 'da Víbora',   efeito: { salvamento: 'reflexos', bonus: 1 }, iLvl: 2 },
    { id: 's_carvalho', nome: 'do Carvalho', efeito: { salvamento: 'fortitude', bonus: 1 }, iLvl: 2 },
    { id: 's_luz',      nome: 'da Luz',      efeito: { salvamento: 'vontade', bonus: 1 }, iLvl: 2 },
    { id: 's_sanguessuga', nome: 'Sanguessuga', efeito: { roubo: 1 }, iLvl: 5 }
  ],

  /* ---------- Afixos AMALDIÇOADOS (risco de equipar sem identificar) ---------- */
  maldicoes: [
    { id: 'm_pesado',  nome: '(Amaldiçoado: Pesado)',  efeito: { bonusAcerto: -2 }, desc: 'Pesa mais do que deveria. Bem mais.' },
    { id: 'm_fragil',  nome: '(Amaldiçoado: Frágil)',  efeito: { caExtra: -2 }, desc: 'Range de um jeito errado.' },
    { id: 'm_sedento', nome: '(Amaldiçoado: Sedento)', efeito: { pvExtra: -5 }, desc: 'Algo nele bebe de você.' }
  ],

  /* ---------- Únicos (nome, história, poder fixo) ---------- */
  unicos: [
    {
      id: 'u_lamina_juramento', nome: 'Lâmina do Juramento', slot: 'arma', categoria: 'marcial',
      dano: '1d8+2', critico: '19-20/×2',
      efeito: { bonusAcerto: 1, bonusDano: 2 }, valor: 900, iLvl: 3,
      lore: 'Forjada em Úbia para um Caçador rank S que nunca voltou pra buscá-la. O fio nunca cega; a promessa nunca prescreve.'
    },
    {
      id: 'u_sigilo_ubia', nome: 'Sigilo de Úbia', slot: 'anel',
      efeito: { bonusAcerto: 1, salvamento: 'vontade', bonus: 1 }, valor: 700, iLvl: 2,
      lore: 'Anel de bronze com o brasão da Cidade dos Heróis. Dizem que Jack Caolha reconhece quem o usa — pra melhor ou pra pior.'
    },
    {
      id: 'u_manto_vithus', nome: 'Manto do Fundidor de Vithus', slot: 'armadura', categoria: 'leve',
      caBonus: 3, efeito: { caExtra: 1, pvExtra: 8 }, valor: 1100, iLvl: 4,
      lore: 'Couro tratado nas fundições de Vithus. Absorve calor, pancada e, segundo o fabricante, "uma quantidade razoável de arrependimento".'
    },
    {
      id: 'u_adaga_ritual', nome: 'Adaga Ritual Carmesim', slot: 'arma', categoria: 'simples',
      dano: '1d4+1', critico: '19-20/×2',
      efeito: { bonusAcerto: 1, roubo: 2 }, valor: 1400, iLvl: 5,
      lore: 'Deixada para trás no Paredão. O aço bebe — e devolve. O cabo tem sulcos para os dedos de uma mão pequena e firme, acostumada a cortes precisos.'
    },
    {
      id: 'u_vigilia_insone', nome: 'Amuleto da Vigília Insone', slot: 'amuleto',
      efeito: { salvamento: 'vontade', bonus: 2, pvExtra: 5 }, valor: 1200, iLvl: 5,
      lore: 'Feito pelos anões que ergueram o selo: quem o veste não sonha — e o que nasce dos sonhos passa fome.'
    },
    {
      id: 'u_sinete_pacto', nome: 'Sinete do Pacto Menor', slot: 'anel',
      efeito: { bonusAcerto: 1, bonusDano: 2, salvamento: 'vontade', bonus: -1 }, valor: 1500, iLvl: 8,
      lore: 'Presente de Yurin, "por conta da casa". Ferro negro com um selo que não é dele. Bate mais forte — e, às vezes, à noite, você sonha com uma armadura vazia que sorri. (+1 acerto, +2 dano, -1 Vontade. Todo pacto cobra.)'
    },
    {
      id: 'u_foice_ceifeiro', nome: 'Foice do Ceifeiro Silente', slot: 'arma', categoria: 'marcial',
      dano: '1d10+1', critico: '19-20/×2',
      efeito: { bonusDano: 2, roubo: 1 }, valor: 1600, iLvl: 8,
      lore: 'Cerimônia das Adagas Negras: a foice que "concede misericórdia" no Templo das Lamúrias. Nas mãos certas, concede exatamente o contrário.'
    },
    {
      id: 'u_veu_vevra', nome: 'Véu de Vevra', slot: 'elmo',
      caBonus: 2, efeito: { salvamento: 'vontade', bonus: 2, caExtra: 1 }, valor: 1800, iLvl: 9,
      lore: 'A renda cinza que a Anciã usava para caminhar entre sonhos sem ser tocada. Quem a veste vê o medo chegar ANTES de senti-lo.'
    },
  ],

  /* ---------- Conjunto (bônus por peças) ---------- */
  conjuntos: [
    {
      id: 'c_cacador', nome: 'Aparato do Caçador',
      pecas: [
        { id: 'c_cacador_botas', nome: 'Passos do Caçador', slot: 'botas', efeito: { salvamento: 'reflexos', bonus: 1 }, valor: 250, iLvl: 2 },
        { id: 'c_cacador_amuleto', nome: 'Presa do Caçador', slot: 'amuleto', efeito: { bonusDano: 1 }, valor: 250, iLvl: 2 }
      ],
      bonus2: { bonusAcerto: 2, pvExtra: 5 },
      lore: 'Equipamento padrão dos rank B da guilda. Junto, vale mais que a soma — como uma boa party.'
    }
  ],

  /* ---------- Tabela de drop por ND do monstro ---------- */
  tabelaDrop: {
    // chanceDrop: chance de dropar item; pesos por raridade
    baixo:  { chanceDrop: 0.6, pesos: { normal: 55, magico: 33, raro: 9, conjunto: 2, unico: 1 } },
    medio:  { chanceDrop: 0.8, pesos: { normal: 40, magico: 38, raro: 15, conjunto: 4, unico: 3 } },
    chefe:  { chanceDrop: 1.0, pesos: { normal: 10, magico: 40, raro: 30, conjunto: 10, unico: 10 } }
  },

  /* ---------- Loja do Mestre Bruno ---------- */
  loja: [
    { item: 'pocao_cura_leve', preco: 50, estoque: 99 },
    { item: 'pergaminho_identificar', preco: 25, estoque: 99 },
    { item: 'perg_bola_de_fogo', preco: 375, estoque: 1 },
    { item: 'perg_velocidade', preco: 375, estoque: 1 },
    { item: 'varinha_missels', preco: 450, estoque: 1 },
    { item: 'varinha_cura', preco: 375, estoque: 1 },
    { item: 'bastao_chamas', preco: 900, estoque: 1 },
    { base: 'b_espada', preco: 15 },
    { base: 'b_espada_curta', preco: 10 },
    { base: 'b_martelo', preco: 12 },
    { base: 'b_escudo', preco: 20 },
    { base: 'b_elmo', preco: 25 },
    { base: 'b_couro', preco: 10 }
  ],
  precoRemoverMaldicao: 75,
  fatorVenda: 0.4 // Bruno paga 40% do valor
});
