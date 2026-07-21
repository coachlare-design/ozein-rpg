/* =====================================================
   OZEIN RPG — data/monsters.js
   Bestiário da Missão 1 (stats D&D 3.5 SRD).
   No Passe A servem de prévia (o combate ATB chega no Passe B).
   ===================================================== */
GameData.register('monsters', {

  cao_infernal: {
    id: 'cao_infernal',
    nome: 'Cão Infernal',
    nd: 3,
    tipo: 'Besta Mágica (Extraplanar, Fogo)',
    pv: 22, ca: 16, bba: 5,
    ataques: [{ nome: 'Mordida', dano: '1d8+1 + 1d6 fogo' }],
    especial: ['Sopro de fogo (cone 3m, 2d6, Reflexos CD 13 metade)', 'Faro'],
    fraqueza: 'Frio (vulnerável)',
    lore: 'Matilhas rondam a entrada das minas de Renânia. Ninguém sabe quem as trouxe — ou o que as atrai.'
  },

  cao_infernal_nessian: {
    id: 'cao_infernal_nessian',
    nome: 'Cão Infernal Nessiano (Alfa)',
    nd: 9,
    tipo: 'Besta Mágica (Extraplanar, Fogo)',
    pv: 60, ca: 22, bba: 12,
    ataques: [{ nome: 'Mordida', dano: '2d6+6 + 1d8 fogo' }],
    especial: ['Sopro de fogo maior (10d6)', 'FOGE ao cair a 2/3 dos PV — roteiro do Nó 1'],
    fraqueza: 'Frio (vulnerável)',
    lore: 'O alfa da matilha. Mais esperto do que deveria: quando ferido, foge — e leva consigo a resposta de quem o mandou.'
  },

  basilisco: {
    id: 'basilisco',
    nome: 'Basilisco de Renânia',
    nd: 5,
    tipo: 'Besta Mágica',
    pv: 45, ca: 16, bba: 8,
    ataques: [{ nome: 'Mordida', dano: '1d8+3' }],
    especial: ['OLHAR PETRIFICANTE: Fortitude CD 13 ou vira pedra (30 pés)', 'As secreções valem o contrato do nobre'],
    fraqueza: 'Evitar o olhar (combater sem visão direta: -20% acerto, imune à petrificação)',
    lore: 'O terror das galerias fundas. As estátuas de mineradores na caverna oculta não são decoração.'
  },

  gigante_fogo: {
    id: 'gigante_fogo',
    nome: 'Gigante do Fogo Ferreiro',
    nd: 10,
    tipo: 'Gigante (Fogo)',
    pv: 142, ca: 23, bba: 20,
    ataques: [{ nome: 'Espada grande', dano: '3d6+15' }, { nome: 'Rocha incandescente', dano: '2d8+10 + 2d6 fogo' }],
    especial: ['Imune a fogo', 'Chefe do fundo da mina — guarda a forja e o Bastão'],
    fraqueza: 'Frio (vulnerável)',
    lore: 'Montou forja no fundo da mina, escravizando o calor da terra. Entre seus tesouros: ~1700 po, um relicário anão obra-prima e o Bastão Detector de Metais e Minerais.'
  }
  ,
  /* ================= MISSÃO 2 — Os Pesadelos Selados ================= */
  cultista_capataz: {
    id: 'cultista_capataz', nome: 'Capataz Cultista', nd: 3,
    tipo: 'Humanoide (cultista das malignidades)',
    pv: 18, ca: 14, bba: 4,
    ataques: [{ nome: 'Maça', dano: '1d8+2' }],
    especial: ['Chicote de comando: mantém os operários encantados trabalhando'],
    fraqueza: 'Sem os operários, lutam sozinhos — e mal',
    lore: 'Contratados que fazem perguntas de menos e recebem ouro de mais. O símbolo discreto no cinto é da nova "sociedade" de Renânia.'
  },
  quasit: {
    id: 'quasit', nome: 'Quasit', nd: 2,
    tipo: 'Extraplanar (demônio menor)',
    pv: 13, ca: 16, bba: 4,
    ataques: [{ nome: 'Garras venenosas', dano: '1d3 + veneno (1 FOR)' }],
    especial: ['Vazou pela âncora dimensional enfraquecida', 'Pequeno e irritantemente ágil'],
    fraqueza: 'Frágil — cai rápido quando acertado',
    lore: 'Se um quasit atravessou, a âncora anti-planar dos anões está falhando. E quasits nunca chegam primeiro sozinhos.'
  },
  babau: {
    id: 'babau', nome: 'Demônio Babau', nd: 6,
    tipo: 'Extraplanar (demônio)',
    pv: 40, ca: 17, bba: 8,
    ataques: [{ nome: 'Garras corrosivas', dano: '1d6+4 + 1d4 ácido' }],
    especial: ['Pele de lodo ácido', 'Táticos: flanqueiam ou fogem para avisar', '"Aguardavam ansiosos" diante do selo'],
    fraqueza: 'Impedir o flanco anula a vantagem deles',
    lore: 'Assassinos do Abismo, magros como fome. Dois deles esperam há semanas diante do paredão — alguém do outro lado os chamou.'
  },
  fihyr: {
    id: 'fihyr', nome: 'Fihyr', nd: 4,
    tipo: 'Aberração (nascida de pesadelos)',
    pv: 22, ca: 15, bba: 5,
    ataques: [{ nome: 'Dentes de medo', dano: '1d6+2' }],
    especial: ['Feito da matéria dos pesadelos dos mineradores', 'Dura apenas uma noite — mas a noite é longa'],
    fraqueza: 'Coragem: mentes firmes o dissolvem mais rápido',
    lore: 'Quando muita gente sonha o mesmo horror perto de uma fissura, o horror acorda primeiro. (Conhecimento: masmorras, CD 10.)'
  },
  grande_fihyr: {
    id: 'grande_fihyr', nome: 'Grande Fihyr', nd: 12,
    tipo: 'Aberração (pesadelo maior)',
    pv: 95, ca: 18, bba: 12,
    ataques: [{ nome: 'Mandíbula de pavor', dano: '2d6+5' }],
    especial: ['AURA DE DESESPERO: Vontade ou a party fica ABALADA (-2 no acerto)', 'Quase invisível ao olho desatento até atacar'],
    fraqueza: 'Vontade firme (salvamentos) e foco total — ele se desfaz ao amanhecer, mas vocês não têm até o amanhecer',
    lore: 'O que escapou pela brecha do selo. Se um vazamento parcial gera ISTO, o que dorme atrás do ferro completo não deve acordar jamais.'
  },
  drahz: {
    id: 'drahz', nome: 'Drahz, o Guarda-Costas', nd: 8,
    tipo: 'Humanoide (drow)',
    pv: 52, ca: 19, bba: 10,
    ataques: [{ nome: 'Lâminas gêmeas drow', dano: '1d6+4 ×2' }],
    especial: ['Sombras vivas: ataca de ângulos impossíveis', 'Lealdade absoluta a Lysia'],
    fraqueza: 'Luz intensa o incomoda (herança drow)',
    lore: 'O drow que guarda a porta de Lysia Moss. Fala pouco. Erra menos ainda.'
  },
  ekaterina: {
    id: 'ekaterina', nome: 'Ekaterina, Sacerdotisa da Rubi', nd: 7,
    tipo: 'Humanoide (clériga de Wee Jas)',
    pv: 44, ca: 16, bba: 6,
    ataques: [{ nome: 'Cetro rubi', dano: '1d8+2' }],
    especial: ['LAMENTO FÚNEBRE: onda de energia da morte (Vontade CD 15 para metade)', 'Mantém o ritual do selo ativo'],
    fraqueza: 'Interromper o ritual a força a lutar de verdade',
    lore: 'A ponte entre as malignidades e a Feiticeira Rubi. Seu templo em Renânia ainda cheira a tinta fresca — e já guarda segredos.'
  },

  /* ================= MISSÃO 3 — A VILA QUE DORME ================= */

  larva_pesadelo: {
    id: 'larva_pesadelo', nome: 'Larva de Pesadelo', nd: 3,
    tipo: 'Aberração (cria de pesadelo)',
    pv: 14, ca: 14, bba: 4,
    ataques: [{ nome: 'Dentes de sonho ruim', dano: '1d4+2' }],
    especial: ['Nasce dos sonhos dos adormecidos', 'Anda em enxame'],
    fraqueza: 'Frágil — morre fácil, mas nunca vem sozinha',
    lore: 'O que a Anciã Noturna semeia nos sonhos, o sono colhe em carne. Cada aldeão que dorme fabrica duas por noite.'
  },
  irmao_vigilia: {
    id: 'irmao_vigilia', nome: 'Irmão da Vigília', nd: 5,
    tipo: 'Humanoide (adepto do sono)',
    pv: 26, ca: 15, bba: 6,
    ataques: [{ nome: 'Maça de sebo negro', dano: '1d6+3' }],
    especial: ['TOQUE DO SONO: dano + chance de APAGAR o alvo (perde a ação)', 'Colhe adormecidos para "a Vigília"'],
    fraqueza: 'Sem os sacerdotes, o encanto do sono deles enfraquece',
    lore: 'Acólitos de roupão cinza que percorrem Vau da Prata "abençoando o descanso". A bênção tem preço: quem dorme, não acorda — e é levado.'
  },
  sacerdote_lamurias: {
    id: 'sacerdote_lamurias', nome: 'Sacerdote das Lamúrias', nd: 7,
    tipo: 'Humanoide (clérigo de Nerull / Adaga Negra)',
    pv: 34, ca: 16, bba: 8,
    ataques: [{ nome: 'Foice cerimonial', dano: '1d8+3' }],
    especial: ['PRECE SOMBRIA: 2d8 de energia negativa na party (Vontade CD 15 p/ metade)', 'Roupão vermelho-ferrugem das Adagas Negras'],
    fraqueza: 'A luz da Triuni queima a prece na garganta deles',
    lore: 'O Templo das Lamúrias vende "morte misericordiosa" — e, descobriu-se, compra dorminhocos. Sacerdotes de Nerull disfarçados, assassinos das Adagas Negras. Os corpos vão para necromantes; os sonhos, para a Anciã.'
  },
  pesadelo: {
    id: 'pesadelo', nome: 'Pesadelo', nd: 5,
    tipo: 'Extraplanar (corcel abissal)',
    pv: 62, ca: 18, bba: 10,
    ataques: [{ nome: 'Cascos flamejantes', dano: '2d6+6 (+1d6 fogo)' }],
    especial: ['FUMAÇA SUFOCANTE: Fortitude CD 15 ou ABALADO', 'Montaria clássica das anciãs noturnas (MM 3.5)'],
    fraqueza: 'Frio',
    vulneravel: 'frio',
    lore: 'O corcel de crina em brasa que as anciãs noturnas montam para cavalgar os sonhos alheios. Onde ele pasta, a grama vira cinza — e os sonhos viram porta.'
  },
  ancia_noturna: {
    id: 'ancia_noturna', nome: 'Madame Vevra, Anciã Noturna', nd: 9,
    tipo: 'Extraplanar (night hag, MM 3.5)',
    pv: 88, ca: 20, bba: 11,
    ataques: [{ nome: 'Garras e presas', dano: '2d6+6' }],
    especial: ['PESADELO VÍVIDO: costura o pior medo de cada um (3d6, Vontade CD 16 p/ metade)', 'PEDRA DO CORAÇÃO: o foco que tece pesadelos em adormecidos', 'Cavalga sonhos montada num Pesadelo'],
    fraqueza: 'Destruir a pedra do coração corta a colheita de sonhos',
    lore: 'Contratada "por uma senhora de máscara óssea" para testar em Vau da Prata o que a amostra do selo permite: semear pesadelos em soldados adormecidos. Os aldeões foram o ensaio geral do exército que precisa sonhar.'
  },
  ekaterina_vigilia: {
    id: 'ekaterina_vigilia', nome: 'Ekaterina, a Vigília Rubra', nd: 8,
    tipo: 'Morto-vivo (rediviva de Wee Jas)',
    pv: 55, ca: 18, bba: 8,
    ataques: [{ nome: 'Cetro rubi rachado', dano: '1d8+4' }],
    especial: ['LAMENTO FÚNEBRE (Vontade CD 15 p/ metade)', 'VIGÍLIA RUBRA: remenda a carne dos aliados (cura)', 'Foi RECOLHIDA no Paredão — e devolvida... diferente'],
    fraqueza: 'Parte dela lembra de quem era. A parte que não lembra luta melhor.',
    lore: 'Caiu diante do Paredão; o corpo sumiu. Wee Jas é deusa da Morte E da Magia — e Lysia é devota aplicada. O que voltou usa o rosto de Ekaterina, a fé de Ekaterina, e nenhum dos medos dela.'
  },

  /* ================= MISSÃO 4 — A CIDADE DOS HERÓIS ================= */

  adaga_negra: {
    id: 'adaga_negra', nome: 'Adaga Negra', nd: 7,
    tipo: 'Humanoide (assassino de aluguel)',
    pv: 38, ca: 18, bba: 9,
    ataques: [{ nome: 'Lâmina envenenada', dano: '1d6+5 + veneno' }],
    especial: ['LÂMINA ENVENENADA: dano + chance de APAGAR o alvo (paralisia)', 'Sem batina desta vez — em Úbia, as Adagas trabalham à paisana'],
    fraqueza: 'Sem surpresa, são só lâminas caras',
    lore: 'A capela de Vau da Prata caiu, mas a irmandade não. Em Úbia elas escoltam o "tônico" — e cobram por cabeça de quem pergunta demais.'
  },
  vigilante_rubro: {
    id: 'vigilante_rubro', nome: 'Vigilante Rubro', nd: 8,
    tipo: 'Morto-vivo (rediviva de Wee Jas)',
    pv: 46, ca: 18, bba: 10,
    ataques: [{ nome: 'Alabarda cerimonial', dano: '1d8+5' }],
    especial: ['LAMENTO FÚNEBRE (Vontade p/ metade)', 'VIGÍLIA RUBRA: remenda os aliados (cura)', 'O que a Vigília fez com Ekaterina... agora faz EM SÉRIE'],
    fraqueza: 'A luz da Triuni — e quebrar quem os remenda',
    lore: 'Ekaterina foi o protótipo. Os Vigilantes Rubros são a linha de produção: caçadores e soldados que "dormiram" — e voltaram de olhos despertos e vazios.'
  },
  yara_lamina: {
    id: 'yara_lamina', nome: 'Yara, a Lâmina de Úbia', nd: 11,
    tipo: 'Humanoide (Top 1 dos Caçadores — DOMINADA)',
    pv: 115, ca: 20, bba: 13,
    ataques: [{ nome: 'Lâmina da Yara', dano: '1d10+6' }],
    especial: ['LÂMINA-TEMPESTADE: um arco que alcança a party inteira (Reflexos p/ metade)', 'COROA DE SONHO: o aro de prata na testa dela NÃO é dela', 'Dora avisou: "não matem a menina — quebrem a COROA"'],
    fraqueza: 'A coroa quebra quando o corpo dela cede — derrubá-la é LIBERTÁ-LA',
    lore: 'A Top 1 do ranking geral, a caçadora que "ninguém alcança". A fase dois precisava de um rosto que a guilda seguisse — então Viridiana mandou coroar o melhor deles.'
  },
  lysia_moss: {
    id: 'lysia_moss', nome: 'Lysia Moss, a Blood Magus', nd: 12,
    tipo: 'Humanoide (Incantatrix Negra / maga do sangue)',
    pv: 90, ca: 19, bba: 11,
    ataques: [{ nome: 'Adaga carmesim', dano: '1d6+4' }],
    especial: ['RITUAL DE SANGUE: o próprio sangue vira onda de energia negativa (Vontade p/ metade)', 'VIGÍLIA RUBRA: remenda os redivivos', 'FOGE quando o preço fica alto — sempre fugiu'],
    fraqueza: 'Cada magia custa o sangue DELA. Façam custar.',
    lore: 'A maga de vermelho, aprendiz de Viridiana Quispe. Pagou o gigante, colheu a amostra, montou o laboratório — e agora rege a fase dois em Úbia. As Brancas suspenderam a proibição: desta vez, pode-se caçá-la.'
  }

});
