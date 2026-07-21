/* =====================================================
   OZEIN RPG — data/world.js
   O mundo navegável (v0.8.0 — DUAS regiões):
   · RENÂNIA — cidade-base + mapa das Missões 1-3
   · ÚBIA — a Cidade dos Heróis + mapa da Missão 4
   Estrutura Darkest Dungeon: cada nó abre uma cena.
   O motor lê Engine.cidadeAtual()/Engine.mapaAtual();
   `cidade`/`mapa` seguem apontando pra Renânia (legado).
   ===================================================== */
GameData.register('world', (function () {
const mundo = {

  /* ---------- CIDADE-BASE: RENÂNIA ---------- */
  cidade: {
    id: 'renania_cidade',
    nome: 'Renânia — Vila das Minas',
    fundo: 'assets/img/cidade-praca.png',
    descricao: 'A praça de pedra fria da vila mineradora, dourada pelo entardecer. O martelo da forja marca o tempo; a Taverna do Jarro Dourado promete cerveja e rumores; e a oeste, os portões abrem para as montanhas — e para as minas.',
    locais: [
      {
        id: 'taverna',
        nome: '🍺 Taverna do Jarro Dourado',
        desc: 'Rumores, cerveja escura e o quadro de contratos dos Caçadores.',
        acao: { tipo: 'dialogo', dialogo: 'taverna_intro' }
      },
      {
        id: 'quadro',
        nome: '📜 Quadro de Contratos (Caçadores)',
        desc: 'Contratos ranqueados creditados pela guilda de Úbia. Guilda fica com 25% do prêmio.',
        acao: { tipo: 'dialogo', dialogo: 'quadro_contratos' }
      },
      {
        id: 'mesa_mapas',
        nome: '🗺️ Mesa de Mapas (Taverna)',
        desc: 'O mapa do continente Genesiano aberto sobre a mesa. Renânia fica no sopé das montanhas do oeste, a caminho de Vithus e Úbia.',
        acao: { tipo: 'mapaMundo' }
      },
      {
        id: 'forja',
        nome: '⚒️ Forja do Mestre Bruno',
        desc: 'Ferreiro da vila. Compra, vende e conserta. (Loja completa no Passe B.)',
        acao: { tipo: 'dialogo', dialogo: 'forja_intro' }
      },
      {
        id: 'descanso',
        nome: '🛏️ Descansar na taverna (salvar o jogo)',
        desc: 'Alugar um quarto: recupera PV e graça divina, salva o jogo e permite trocar o líder da party.',
        acao: { tipo: 'descanso' }
      },
      {
        id: 'casebre',
        nome: '🏠 Casebre da Party (base)',
        desc: 'A base conquistada com o ouro da Missão 1. Descansar, salvar e trocar o líder — em casa.',
        condicao: { flag: 'casebre' },
        acao: { tipo: 'descanso' }
      },
      {
        id: 'beco',
        nome: '🌒 Beco atrás da taverna',
        desc: 'Alguém deixou um recado na porta do casebre: "no beco, à meia-noite. — Y."',
        condicao: { flag: 'v01Completa' },
        acao: { tipo: 'dialogo', dialogo: 'm2_beco' }
      },
      {
        id: 'carta_guilda',
        nome: '📨 Envelope lacrado da guilda (Taverna)',
        desc: 'Odo guarda um envelope que chegou de Úbia de madrugada. O selo dos Caçadores brilha na cera.',
        condicao: { flag: 'missao2Relatorio', semFlag: 'v02Completa' },
        acao: { tipo: 'dialogo', dialogo: 'm2_relatorio' }
      },
      {
        id: 'anexo',
        nome: '🎖️ Anexo dos Caçadores — Classes de Prestígio',
        desc: 'Desde o primeiro contrato creditado, a guilda mantém uma sala nos fundos da taverna. Uma veterana do TOP do ranking treina as TRILHAS DE PRESTÍGIO (nível 4+, escolha permanente).',
        condicao: { flag: 'rankC' },
        acao: { tipo: 'dialogo', dialogo: 'anexo_treinamento' }
      },
      {
        id: 'carta_m3',
        nome: '📨 Correio da guilda (Vau da Prata)',
        desc: 'Outro envelope de Úbia — mais pesado que o primeiro. Odo o segura com as duas mãos.',
        condicao: { flag: 'missao3Relatorio', semFlag: 'v03Completa' },
        acao: { tipo: 'dialogo', dialogo: 'm3_relatorio' }
      },
      {
        id: 'convocacao',
        nome: '📨 Tubo de marfim — CONVOCAÇÃO A ÚBIA',
        desc: 'O sinete do conselho das Brancas, e um bilhete de Jack por baixo: "Sede. Agora. Os dois assuntos são o mesmo assunto. — J.C."',
        condicao: { flag: 'v03Completa', semFlag: 'ubiaAberta' },
        acao: { tipo: 'dialogo', dialogo: 'm4_convocacao' }
      },
      {
        id: 'viagem_ubia',
        nome: '🐎 Diligência para ÚBIA (leste)',
        desc: 'Três dias de estrada até a Cidade dos Heróis — guilda, Torre de Marfim e o próximo capítulo.',
        condicao: { flag: 'ubiaAberta' },
        acao: { tipo: 'regiao', regiao: 'ubia' }
      },
      {
        id: 'portao',
        nome: '🏔️ Portão Oeste — Estrada das Minas',
        desc: 'A estrada sobe as montanhas até as minas. Requer um contrato ativo.',
        acao: { tipo: 'viajar' }
      }
    ]
  },

  /* ---------- MAPA DE NÓS — MISSÃO 1 ---------- */
  mapa: {
    id: 'mapa_missao1',
    nome: 'Estrada das Minas de Renânia',
    missaoBase: 'missao1', // nós sem condição pertencem a esta missão (p/ o ⭐ próximo passo)
    fundo: 'assets/img/cenario-estrada.png',
    nos: [
      {
        id: 'no_cidade',
        nome: 'Renânia',
        icone: '🏘️',
        x: 8, y: 78,
        tipo: 'cidade',
        desc: 'A vila. Reabre quando o objetivo da missão ativa cair — até lá, descanse nos pontos da rota.'
      },
      {
        id: 'no_estrada1',
        nome: 'Estrada das Carroças',
        icone: '🛞',
        x: 28, y: 55,
        tipo: 'social',
        cena: 'cena_carroca',
        desc: 'O caminho principal até as minas, sulcado por rodas pesadas.'
      },
      {
        id: 'no_estrada2',
        nome: 'Trilha da Encosta',
        icone: '⚠️',
        x: 48, y: 72,
        tipo: 'armadilha',
        cena: 'cena_encosta',
        desc: 'Um atalho estreito na beira do penhasco. As pedras aqui não parecem firmes.'
      },
      {
        id: 'no_mina_entrada',
        nome: 'Entrada das Minas (Nó 1)',
        icone: '⛏️',
        x: 68, y: 48,
        tipo: 'combate',
        cena: 'cena_no1',
        desc: 'Bocas escuras na rocha. Ossos roídos e marcas de queimado no chão — a matilha está perto.'
      },
      {
        id: 'no_caverna',
        nome: 'Caverna Oculta (Nó 2)',
        icone: '🐍',
        x: 84, y: 62,
        tipo: 'combate',
        cena: 'cena_no2',
        desc: 'Estátuas de mineradores em poses de fuga. Não são estátuas.'
      },
      {
        id: 'no_fundo',
        nome: 'Fundo da Mina (Nó 3)',
        icone: '🔥',
        x: 93, y: 35,
        tipo: 'chefe',
        cena: 'cena_no3',
        desc: 'Um clarão de forja onde não devia haver fogo. Algo enorme trabalha o metal lá embaixo.'
      },
      /* ---- MISSÃO 2: galerias fundas (aparecem com a missão ativa) ---- */
      {
        id: 'no_galeria', nome: 'Galeria Escavada', icone: '⛏️',
        x: 78, y: 18, tipo: 'combate', cena: 'm2_cena_galeria', condicao: { missao: 'missao2' },
        desc: 'Escavação nova, organizada demais pra mineradores comuns. Os operários trabalham com olhos vidrados.'
      },
      {
        id: 'no_bolsao', nome: 'Bolsão Anti-Planar', icone: '🌀',
        x: 62, y: 10, tipo: 'combate', cena: 'm2_cena_bolsao', condicao: { missao: 'missao2' },
        desc: 'O ar dobra errado aqui. A âncora dimensional dos anões está falhando — e coisas pequenas atravessam.'
      },
      {
        id: 'no_antessala', nome: 'Antessala do Selo', icone: '🚪',
        x: 45, y: 16, tipo: 'combate', cena: 'm2_cena_antessala', condicao: { missao: 'missao2' },
        desc: 'Colunas anãs e um silêncio de catedral. Alguma coisa espera aqui há semanas.'
      },
      {
        id: 'no_fissura', nome: 'Fissura de Pesadelo', icone: '👁️',
        x: 30, y: 8, tipo: 'combate', cena: 'm2_cena_fissura', condicao: { missao: 'missao2' },
        desc: 'Uma rachadura fina no ferro. Do outro lado, alguém sonha. Do lado de cá, o sonho ganha dentes.'
      },
      {
        id: 'no_paredao', nome: 'O PAREDÃO', icone: '⚠️',
        x: 14, y: 16, tipo: 'chefe', cena: 'm2_cena_paredao', condicao: { missao: 'missao2' },
        desc: '"Não abra — aqui foram selados os pesadelos há muito esquecidos." Há luz de ritual vindo da base da parede.'
      },
      /* ---- MISSÃO 3: a estrada do sul (aparece com a missão ativa) ---- */
      {
        id: 'no_m3_estrada', nome: 'Estrada do Sul', icone: '🛣️',
        x: 24, y: 90, tipo: 'social', cena: 'm3_cena_estrada', condicao: { missao: 'missao3' },
        desc: 'O caminho para Vau da Prata. Uma caravana está parada no meio da estrada — parada demais.'
      },
      {
        id: 'no_m3_vau', nome: 'Vau da Prata', icone: '🏚️',
        x: 44, y: 86, tipo: 'combate', cena: 'm3_cena_vau', condicao: { missao: 'missao3' },
        desc: 'A aldeia inteira dorme onde caiu: na rua, na mesa, no meio de uma frase. E alguém colhe os que dormem.'
      },
      {
        id: 'no_m3_capela', nome: 'Capela das Lamúrias', icone: '⚰️',
        x: 63, y: 90, tipo: 'combate', cena: 'm3_cena_capela', condicao: { missao: 'missao3' },
        desc: 'A filial rural do Templo das Lamúrias. Vende "morte misericordiosa". Ultimamente, compra dorminhocos.'
      },
      {
        id: 'no_m3_limiar', nome: 'Limiar do Sonho', icone: '🌫️',
        x: 80, y: 86, tipo: 'social', cena: 'm3_cena_limiar', condicao: { missao: 'missao3' },
        desc: 'A névoa aqui não é névoa. Quem entra acordado... não sai acordado. Os aldeões sonham TODOS o mesmo sonho.'
      },
      {
        id: 'no_m3_pasto', nome: 'Pasto de Cinzas', icone: '🔥',
        x: 92, y: 76, tipo: 'combate', cena: 'm3_cena_pasto', condicao: { missao: 'missao3' },
        desc: 'Um círculo de grama queimada em forma de ferradura. Algo pasta aqui à noite — e a grama vira cinza.'
      },
      {
        id: 'no_m3_covil', nome: 'A Gruta do Véu', icone: '🌙',
        x: 95, y: 55, tipo: 'chefe', cena: 'm3_cena_covil', condicao: { missao: 'missao3' },
        desc: 'A boca da gruta respira devagar, como quem dorme. Lá dentro, alguém tece os sonhos de Vau da Prata.'
      }
    ],
    arestas: [
      ['no_cidade', 'no_estrada1'],
      ['no_estrada1', 'no_estrada2'],
      ['no_estrada2', 'no_mina_entrada'],
      ['no_mina_entrada', 'no_caverna'],
      ['no_caverna', 'no_fundo'],
      ['no_fundo', 'no_galeria'],
      ['no_galeria', 'no_bolsao'],
      ['no_bolsao', 'no_antessala'],
      ['no_antessala', 'no_fissura'],
      ['no_fissura', 'no_paredao'],
      ['no_cidade', 'no_m3_estrada'],
      ['no_m3_estrada', 'no_m3_vau'],
      ['no_m3_vau', 'no_m3_capela'],
      ['no_m3_capela', 'no_m3_limiar'],
      ['no_m3_limiar', 'no_m3_pasto'],
      ['no_m3_pasto', 'no_m3_covil']
    ]
  },

  /* =====================================================
     ÚBIA — A CIDADE DOS HERÓIS (v0.8.0, Missão 4)
     ===================================================== */
  cidadeUbia: {
    id: 'ubia_cidade',
    nome: 'Úbia — a Cidade dos Heróis',
    fundo: 'assets/img/cidade-ubia.png',
    descricao: 'Avenidas de mármore gasto sob o entardecer, estátuas de caçadores em cada esquina e a SEDE DOS CAÇADORES coroando a praça alta. Tudo aqui tem nome de herói morto — e a cidade cobra caro de quem quiser virar um.',
    locais: [
      {
        id: 'u_sede',
        nome: '🏛️ Sede dos Caçadores (Jack Caolha)',
        desc: 'A matriz da guilda: o salão do ranking, a sala do Jack e o cheiro de tinta dos contratos rank A.',
        acao: { tipo: 'dialogo', dialogo: 'm4_sede' }
      },
      {
        id: 'u_mural',
        nome: '📜 Mural de Contratos da Sede',
        desc: 'O mural-mãe de todos os quadros do continente. O contrato no topo tem o lacre pessoal do Jack.',
        acao: { tipo: 'dialogo', dialogo: 'm4_mural' }
      },
      {
        id: 'u_torre',
        nome: '🗼 Torre de Marfim (as Brancas)',
        desc: 'A embaixada das Encantatrizes Brancas em Úbia. O corvo Cinza conhece o caminho — a maga foi CONVOCADA.',
        acao: { tipo: 'dialogo', dialogo: 'm4_torre' }
      },
      {
        id: 'u_museu',
        nome: '🏺 Museu dos Heróis',
        desc: 'As relíquias das eras heroicas de Úbia — inclusive a LÁGRIMA DE ÚBIA, a joia que "chora" quando a cidade corre perigo.',
        acao: { tipo: 'dialogo', dialogo: 'm4_museu_visita' }
      },
      {
        id: 'u_emporio',
        nome: '🏪 Empório da Guilda',
        desc: 'Suprimentos com desconto de membro. A intendente também purifica maldições.',
        acao: { tipo: 'loja', loja: 'ubia' }
      },
      {
        id: 'u_estalagem',
        nome: '🛏️ Estalagem do Machado Rachado (salvar o jogo)',
        desc: 'Quarto de membro da guilda: recupera PV e graça divina, salva o jogo e permite trocar o líder.',
        acao: { tipo: 'descanso' }
      },
      {
        id: 'u_porto',
        nome: '⚓ Descer à Baixa do Porto (rota da missão)',
        desc: 'A cidade baixa: docas, armazéns e o subsolo da velha Úbia. Requer um contrato ativo.',
        acao: { tipo: 'viajar' }
      },
      {
        id: 'u_volta',
        nome: '🐎 Diligência de volta a RENÂNIA',
        desc: 'Três dias de estrada de volta às montanhas — Bruno, Odo e as minas continuam lá.',
        acao: { tipo: 'regiao', regiao: 'renania' }
      }
    ]
  },

  mapaUbia: {
    id: 'mapa_ubia',
    nome: 'Úbia — a Baixa e o Subsolo',
    missaoBase: 'missao4',
    fundo: 'assets/img/cenario-ubia-vista.png',
    nos: [
      {
        id: 'no_u_cidade', nome: 'Praça Alta (Úbia)', icone: '🏛️',
        x: 8, y: 22, tipo: 'cidade',
        desc: 'A cidade alta. Reabre quando o objetivo da missão ativa cair — até lá, descanse nos pontos da rota.'
      },
      {
        id: 'no_u_porto', nome: 'Baixa do Porto', icone: '⚓',
        x: 26, y: 46, tipo: 'social', cena: 'm4_cena_porto', condicao: { missao: 'missao4' },
        desc: 'Caixotes de "Tônico Revigorante da Vigília" que nenhum mercador honesto encomendou. As docas dormem cedo demais.'
      },
      {
        id: 'no_u_armazem', nome: 'Armazém 7', icone: '📦',
        x: 46, y: 30, tipo: 'combate', cena: 'm4_cena_armazem', condicao: { missao: 'missao4' },
        desc: 'O depósito do tônico. Vigiado por gente de roupão que não pisca — e lâminas que não erram.'
      },
      {
        id: 'no_u_museu', nome: 'Museu dos Heróis (madrugada)', icone: '🏺',
        x: 63, y: 52, tipo: 'social', cena: 'm4_cena_museu', condicao: { missao: 'missao4' },
        desc: 'Luz de lampião onde não devia haver ninguém. A Lágrima de Úbia está chorando — e alguém veio enxugá-la.'
      },
      {
        id: 'no_u_subterraneo', nome: 'Galerias do Subsolo', icone: '🕳️',
        x: 79, y: 34, tipo: 'combate', cena: 'm4_cena_subterraneo', condicao: { missao: 'missao4' },
        desc: 'Os aquedutos secos da primeira Úbia. Alguém marcou o caminho com fuligem — para os que vêm DEPOIS.'
      },
      {
        id: 'no_u_santuario', nome: 'Santuário da Vigília', icone: '🕯️',
        x: 88, y: 60, tipo: 'combate', cena: 'm4_cena_santuario', condicao: { missao: 'missao4' },
        desc: 'Um salão de casulos sob a cidade dos heróis. Aqui dormem os caçadores colhidos — sonhando o mesmo sonho.'
      },
      {
        id: 'no_u_forum', nome: 'O Fórum Afundado', icone: '⚖️',
        x: 94, y: 84, tipo: 'chefe', cena: 'm4_cena_forum', condicao: { missao: 'missao4' },
        desc: 'A ruína da primeira Úbia, afundada sob a Sede. É aqui que a "fase dois" quer nascer — sob os pés da guilda.'
      }
    ],
    arestas: [
      ['no_u_cidade', 'no_u_porto'],
      ['no_u_porto', 'no_u_armazem'],
      ['no_u_armazem', 'no_u_museu'],
      ['no_u_museu', 'no_u_subterraneo'],
      ['no_u_subterraneo', 'no_u_santuario'],
      ['no_u_santuario', 'no_u_forum']
    ]
  }
};

/* Regiões: o motor navega por aqui (cidade/mapa legadas = Renânia) */
mundo.regioes = {
  renania: { cidade: mundo.cidade, mapa: mundo.mapa },
  ubia: { cidade: mundo.cidadeUbia, mapa: mundo.mapaUbia }
};
return mundo;
})());
