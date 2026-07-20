/* =====================================================
   OZEIN RPG — data/heroes.js
   Fichas dos heróis (D&D 3.5 SRD simplificado p/ videogame).
   A party monta-se aos poucos: paladino abre o jogo sozinho;
   ladino junta-se na Missão 1; maga entre a Missão 1 e a 2.
   ===================================================== */
GameData.register('heroes', {

  paladino: {
    id: 'paladino',
    nome: 'Cavaleiro de Felix Magna',
    titulo: 'Paladino da Ordem de Felix Magna',
    classe: 'Paladino',
    nivel: 2,
    xp: 1000,
    retrato: 'assets/img/retrato-paladino.png',
    disponivel: true, // abre o jogo
    tendencia: 'Leal e Bom',
    divindade: 'A Triuni (sol dourado no peito)',
    atributos: { FOR: 16, DES: 10, CON: 14, INT: 10, SAB: 12, CAR: 15 },
    pvBase: 21,          // 2d10 + CON
    bba: 2,
    atbVel: 8,
    habilidadesCombate: ['atacar', 'golpe_sagrado', 'impor_maos', 'defender', 'usar_pocao'],              // bônus base de ataque
    salvamentos: { fortitude: 5, reflexos: 0, vontade: 1 }, // já com atributos
    ca: 17,              // cota de malha + escudo pesado
    pericias: {
      Diplomacia: 6, Sentir_Motivacao: 5, Curar: 4, Conhecimento_Religiao: 2
    },
    habilidades: [
      { nome: 'Detectar o Mal', desc: 'Sente a presença do mal à vontade (60 pés).' },
      { nome: 'Graça Divina', desc: 'Adiciona o bônus de Carisma a todos os salvamentos (já incluso).' },
      { nome: 'Impor as Mãos', desc: 'Cura (nível × mod. CAR) PV por dia. Reserva atual: 4 PV.' },
      { nome: 'Aura de Coragem', desc: 'Imune a medo; aliados próximos recebem +4 contra medo. (Ativa quando houver party.)' }
    ],
    equipamento: ['espada_longa', 'cota_malha', 'escudo_pesado_aco', 'simbolo_triuni'],
    bio: 'Enviado pela Ordem de Felix Magna para investigar a corrupção que cresce em Renânia. A trilha, ainda que ele não saiba, leva às malignidades — e a algo muito pior, selado nas profundezas.'
  },

  ladino: {
    id: 'ladino',
    nome: 'Aspirante dos Caçadores',
    titulo: 'Ladino, aspirante à guilda dos Caçadores (Úbia)',
    classe: 'Ladino',
    nivel: 2,
    xp: 1000,
    retrato: 'assets/img/retrato-ladino.png',
    disponivel: false, // junta-se no Nó 1 da Missão 1
    tendencia: 'Caótico e Neutro',
    divindade: '—',
    atributos: { FOR: 12, DES: 17, CON: 12, INT: 14, SAB: 10, CAR: 13 },
    pvBase: 13,
    bba: 1,
    atbVel: 11,
    habilidadesCombate: ['atacar', 'truque_sujo', 'defender', 'usar_pocao'],
    salvamentos: { fortitude: 1, reflexos: 6, vontade: 0 },
    ca: 15,
    pericias: {
      Furtividade: 8, Abrir_Fechaduras: 8, Procurar: 7, Desarmar_Dispositivo: 7, Blefar: 6, Ouvir: 5
    },
    habilidades: [
      { nome: 'Ataque Furtivo +1d6', desc: 'Dano extra quando o alvo está desprevenido ou flanqueado.' },
      { nome: 'Evasão', desc: 'Reflexos bem-sucedido = dano zero em efeitos de área.' },
      { nome: 'Achar Armadilhas', desc: 'Pode procurar e desarmar armadilhas mágicas e mecânicas.' }
    ],
    equipamento: ['rapieira', 'armadura_couro', 'gazuas_op'],
    bio: 'Veio a Renânia atrás de contratos ranqueados para creditar na guilda dos Caçadores, em Úbia. Seu contato local é Yurin — um bruxo cinzento que passa informação boa e intenção duvidosa.'
  },

  maga: {
    id: 'maga',
    nome: 'Aspirante das Brancas',
    titulo: 'Maga, aspirante a Incantatrix Branca',
    classe: 'Maga (Evocadora)',
    nivel: 2,
    xp: 1000,
    retrato: 'assets/img/retrato-maga.png',
    disponivel: false, // junta-se entre a Missão 1 e a 2
    tendencia: 'Neutra e Boa',
    divindade: '—',
    atributos: { FOR: 8, DES: 14, CON: 12, INT: 17, SAB: 12, CAR: 10 },
    pvBase: 8,
    bba: 1,
    atbVel: 9,
    habilidadesCombate: ['atacar', 'misseis_magicos', 'raio_de_gelo', 'escudo_arcano', 'defender', 'usar_pocao'],
    salvamentos: { fortitude: 1, reflexos: 2, vontade: 4 },
    ca: 12,
    pericias: {
      Conhecimento_Arcano: 8, Soletrar: 8, Concentracao: 6, Identificar_Magia: 8
    },
    habilidades: [
      { nome: 'Grimório', desc: 'Prepara magias arcanas diariamente (mísseis mágicos, escudo arcano, sono...).' },
      { nome: 'Familiar', desc: 'Um corvo chamado Cinza. Olhos em lugares altos.' },
      { nome: 'Trilha das Brancas', desc: 'Estuda para ingressar na ordem das Incantatrix Brancas — inimigas históricas das Negras.' }
    ],
    equipamento: ['adaga', 'grimorio', 'componentes'],
    bio: 'Fraca ainda, mas com a trilha certa: as Incantatrix Brancas. Sabe que uma Negra opera em Renânia — Lysia Moss — e que um dia, quando for forte o bastante, esse acerto de contas virá.'
  }
});
