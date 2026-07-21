/* =====================================================
   OZEIN RPG — data/quests.js
   Missões. A Missão 1 é a espinha da v0.1; a Missão 2
   fica registrada como gancho (construída em fatia futura).
   ===================================================== */
GameData.register('quests', {

  missao1: {
    id: 'missao1',
    nome: 'Missão 1 — O Basilisco de Renânia',
    rank: 'C',
    contratante: 'Um "nobre interessado" (via quadro dos Caçadores)',
    recompensa: '600 po + crédito de rank C (guilda retém 25%)',
    resumo: 'Um basilisco infesta as minas a oeste de Renânia. O contrato exige suas secreções oculares, frescas, para fins alquímicos.',
    etapas: [
      { id: 'e1', texto: 'Aceitar o contrato no quadro dos Caçadores (taverna).' },
      { id: 'e2', texto: 'Seguir a Estrada das Minas pelo Portão Oeste.' },
      { id: 'e3', texto: 'Nó 1 — Limpar a entrada das minas (matilha de cães infernais).' },
      { id: 'e4', texto: 'Nó 2 — Caçar o basilisco na caverna oculta e colher as secreções.' },
      { id: 'e5', texto: 'Nó 3 — Enfrentar o que acendeu uma forja no fundo da mina.' },
      { id: 'e6', texto: 'Voltar ao quadro dos Caçadores e cobrar a recompensa.' }
    ],
    ganchoFinal: 'O Bastão Detector de Metais aponta para uma parede de ferro puro com runas anãs: "não abra". (Abre a Missão 2 — Os Pesadelos Selados.)'
  },

  missao2: {
    id: 'missao2',
    nome: 'Missão 2 — Os Pesadelos Selados',
    rank: 'B',
    contratante: 'Ninguém pagou por esta. Alguns trabalhos escolhem seus heróis.',
    recompensa: 'Crédito de rank B (Caçadores) + o que o selo não devia deixar sair',
    resumo: 'A escavação até o selo dos anões recomeçou — paga por Lysia Moss, movida por algo pior. Quasits vazam pela âncora dimensional, demônios esperam diante do ferro e os pesadelos dos mineradores estão ganhando dentes. A party precisa descer além do fundo da mina e IMPEDIR a abertura.',
    etapas: [
      { id: 'e1', texto: 'Atender o chamado no beco atrás da taverna (o recado de "Y.").' },
      { id: 'e2', texto: 'Investigar a Galeria Escavada e dispersar os capatazes.' },
      { id: 'e3', texto: 'Fechar o Bolsão Anti-Planar (quasits vazando).' },
      { id: 'e4', texto: 'Antessala do Selo — banir os demônios Babau.' },
      { id: 'e5', texto: 'Fissura de Pesadelo — dispersar os Fihyr.' },
      { id: 'e6', texto: 'O Paredão — interromper o ritual de Drahz e Ekaterina.' },
      { id: 'e7', texto: 'Derrotar O QUE ESCAPOU pela brecha.' },
      { id: 'e8', texto: 'Voltar a Renânia: relatório, rank e consequências.' }
    ],
    ganchoFinal: 'Lysia Moss escapou — e a jóia dela tocou com a voz da Mestra Viridiana. Suzas, o diabo sem carne, monta um exército. O selo resistiu... desta vez. (Missão 3)'
  },

  missao3: {
    id: 'missao3',
    nome: 'Missão 3 — A Vila que Dorme',
    rank: 'B',
    contratante: 'Jack Caolha, em contrato direto (privilégio de rank B)',
    recompensa: '1.200 po + crédito de rank B (guilda retém 25%) — e Vau da Prata acordada',
    resumo: 'A aldeia de Vau da Prata, na estrada do sul, dorme há nove dias e não acorda. Caravanas voltam com os condutores roncando nas boleias. A guilda farejou o rastro: alguém está TESTANDO alguma coisa nos sonhos dos aldeões — e o teste tem a ver com a amostra que Lysia levou do selo.',
    etapas: [
      { id: 'e1', texto: 'Aceitar o contrato direto de Jack Caolha (quadro dos Caçadores).' },
      { id: 'e2', texto: 'Estrada do Sul — investigar a caravana parada.' },
      { id: 'e3', texto: 'Vau da Prata — deter os "Irmãos da Vigília" que colhem os adormecidos.' },
      { id: 'e4', texto: 'Capela das Lamúrias — descobrir quem COMPRA os que não acordam.' },
      { id: 'e5', texto: 'Limiar do Sonho — entrar no sonho coletivo da aldeia.' },
      { id: 'e6', texto: 'Pasto de Cinzas — abater o corcel Pesadelo.' },
      { id: 'e7', texto: 'A Gruta do Véu — destruir a pedra do coração de Madame Vevra.' },
      { id: 'e8', texto: 'Seguir o rastro até o laboratório de Lysia em Renânia.' },
      { id: 'e9', texto: 'Correio da guilda: relatório, rank e consequências.' }
    ],
    ganchoFinal: 'A pedra do coração quebrou e a aldeia acordou — mas era um ENSAIO. A amostra verdadeira já está em Avenches, com Viridiana, multiplicando. "O exército precisa dormir." (Missão 4: Úbia)'
  },

  missao4: {
    id: 'missao4',
    nome: 'Missão 4 — A Cidade dos Heróis',
    rank: 'B',
    contratante: 'Jack Caolha, na Sede dos Caçadores — com as Brancas observando da Torre de Marfim',
    recompensa: '2.000 po + MEMBRO INTERNO da guilda (3ª missão B: acesso a contratos rank A)',
    origem: 'Disponível na SEDE DOS CAÇADORES, em Úbia (a convocação chega após a Missão 3).',
    resumo: 'A "fase dois" de Viridiana começou dentro da própria guilda: um Tônico da Vigília circula em Úbia adormecendo caçadores e guardas da cidade — e YARA, a Top 1 do ranking, desapareceu. A party precisa seguir a linha de distribuição da Baixa do Porto até o subsolo da primeira Úbia e quebrar o ritual antes que a Cidade dos Heróis vire o quartel do exército que sonha.',
    etapas: [
      { id: 'e1', texto: 'Aceitar o contrato de Jack Caolha no Mural da Sede (Úbia).' },
      { id: 'e2', texto: 'Baixa do Porto — rastrear os caixotes do "Tônico da Vigília".' },
      { id: 'e3', texto: 'Armazém 7 — tomar o depósito e a lista de entregas.' },
      { id: 'e4', texto: 'Museu dos Heróis — impedir o roubo da Lágrima de Úbia (madrugada).' },
      { id: 'e5', texto: 'Galerias do Subsolo — seguir o rastro de fuligem sob a cidade.' },
      { id: 'e6', texto: 'Santuário da Vigília — libertar os caçadores encasulados.' },
      { id: 'e7', texto: 'O Fórum Afundado — quebrar a Coroa de Sonho e enfrentar quem a coroou.' },
      { id: 'e8', texto: 'Voltar à Sede: relatório, o título de MEMBRO INTERNO e as ordens da Torre.' }
    ],
    ganchoFinal: 'Membros internos. A Lágrima recuperada, Yara acordada — mas a amostra-mãe segue em Avenches e a lista da "fase dois" tem outras cidades. As Brancas apontam o leste. (Missão 5: Avenches)'
  }
});
