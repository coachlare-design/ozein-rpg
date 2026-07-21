/* =====================================================
   OZEIN RPG — data/game.js
   Configuração global do jogo (dados, não código).
   Editar aqui é seguro: o motor lê tudo em runtime.
   ===================================================== */
GameData.register('config', {
  titulo: 'Ozein — Os Pesadelos de Renânia',
  versao: '0.8.0 — Missão 4: A Cidade dos Heróis (Úbia) + prestígio rebalanceado + vestes da maga',
  mundo: 'Galáxia Empíria · Mundo Ozein · Continente Genesiano',
  regiao: 'Renânia e Úbia (Genesiano)',

  // Cores de raridade (guia de estilo §6.5)
  raridades: {
    normal:   { nome: 'Normal',   cor: '#c8c8c8' },
    magico:   { nome: 'Mágico',   cor: '#5c8ce6' },
    raro:     { nome: 'Raro',     cor: '#e6c95c' },
    conjunto: { nome: 'Conjunto', cor: '#5ce67a' },
    unico:    { nome: 'Único',    cor: '#e6a23c' }
  },

  // Regras d20 (D&D 3.5 SRD)
  regras: {
    atributos: ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'],
    nomesAtributos: {
      FOR: 'Força', DES: 'Destreza', CON: 'Constituição',
      INT: 'Inteligência', SAB: 'Sabedoria', CAR: 'Carisma'
    },
    // XP simplificado por nível (3.5: nível N exige N*(N-1)/2 * 1000)
    xpPorNivel: [0, 0, 1000, 3000, 6000, 10000, 15000, 21000, 28000, 36000, 45000]
  },

  // Textos da abertura
  intro: [
    'Genesiano, o grande continente de Ozein. A oeste da nação industrial de Vithus, onde a pólvora e a tecnomagia mudaram a face da guerra, ficam as montanhas da RENÂNIA — terra de minas profundas, ferro, carvão... e coisas que não deviam ter sido acordadas.',
    'Os mineradores falam de olhares que petrificam nas galerias fundas. De matilhas com presas de brasa rondando a entrada das minas. E os mais velhos, quando bebem demais na Taverna do Jarro Dourado, sussurram sobre os PESADELOS SELADOS pelos anões, há muito esquecidos.',
    'A Ordem de Felix Magna sentiu a corrupção crescer neste canto do mundo. E enviou um único paladino para investigar.',
    'Você.'
  ]
});
