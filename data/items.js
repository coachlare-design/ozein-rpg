/* =====================================================
   OZEIN RPG — data/items.js
   Itens do jogo. Tiers de raridade estilo Diablo 2:
   normal → mágico → raro → conjunto → único.
   O sistema de afixos aleatórios chega no Passe B;
   aqui ficam os itens base e os itens de história.
   ===================================================== */
GameData.register('items', {

  /* ---------- Equipamento inicial ---------- */
  espada_longa: {
    id: 'espada_longa', nome: 'Espada Longa', raridade: 'normal', tipo: 'arma', slot: 'arma',
    dano: '1d8', critico: '19-20/×2',
    desc: 'Lâmina de aço vithusiano, bem cuidada. O arroz-com-feijão de todo soldado da Ordem.'
  },
  cota_malha: {
    id: 'cota_malha', nome: 'Cota de Malha', raridade: 'normal', tipo: 'armadura', slot: 'armadura',
    caBonus: 5, desc: 'Elos de ferro entrelaçados. Pesada, barulhenta, confiável.'
  },
  escudo_pesado_aco: {
    id: 'escudo_pesado_aco', nome: 'Escudo Pesado de Aço', raridade: 'normal', tipo: 'escudo', slot: 'escudo',
    caBonus: 2, desc: 'Traz o sol da Triuni em relevo desbotado.'
  },
  simbolo_triuni: {
    id: 'simbolo_triuni', nome: 'Símbolo Sagrado da Triuni', raridade: 'normal', tipo: 'foco', slot: 'amuleto',
    desc: 'Sol dourado de três raios. Canaliza a graça de Felix Magna.'
  },
  rapieira: {
    id: 'rapieira', nome: 'Rapieira', raridade: 'normal', tipo: 'arma', slot: 'arma',
    dano: '1d6', critico: '18-20/×2',
    desc: 'Fina, rápida, e entra exatamente onde a armadura não cobre.'
  },
  armadura_couro: {
    id: 'armadura_couro', nome: 'Armadura de Couro', raridade: 'normal', tipo: 'armadura', slot: 'armadura',
    caBonus: 2, desc: 'Silenciosa. Do jeito que um ladino gosta.'
  },
  gazuas_op: {
    id: 'gazuas_op', nome: 'Gazuas Obra-Prima', raridade: 'magico', tipo: 'ferramenta',
    bonus: '+2 Abrir Fechaduras', desc: 'Jogo de ganchos e tensores de um mestre de Úbia.'
  },
  adaga: {
    id: 'adaga', nome: 'Adaga', raridade: 'normal', tipo: 'arma', slot: 'arma',
    dano: '1d4', critico: '19-20/×2', desc: 'Último recurso de todo conjurador.'
  },
  grimorio: {
    id: 'grimorio', nome: 'Grimório de Aprendiz', raridade: 'normal', tipo: 'foco',
    desc: 'Capa de couro azul-meia-noite. Metade das páginas ainda em branco — como a carreira da dona.'
  },
  componentes: {
    id: 'componentes', nome: 'Bolsa de Componentes', raridade: 'normal', tipo: 'ferramenta',
    desc: 'Enxofre, teia de aranha, pó de ferro. O necessário para fazer o mundo obedecer.'
  },

  /* ---------- Consumíveis ---------- */
  pocao_cura_leve: {
    id: 'pocao_cura_leve', nome: 'Poção de Curar Ferimentos Leves', raridade: 'normal', tipo: 'consumivel',
    efeito: 'Cura 1d8+1 PV', desc: 'Vidro âmbar, gosto de cobre e alecrim.'
  },


  pergaminho_identificar: {
    id: 'pergaminho_identificar', nome: 'Pergaminho de Identificação', raridade: 'normal', tipo: 'consumivel',
    efeito: 'Revela um item não-identificado (sem risco de maldição)',
    desc: 'Tinta de prata sobre velino. Lê a alma do objeto em voz alta.'
  },

  secrecoes_basilisco: {
    id: 'secrecoes_basilisco', nome: 'Secreções do Basilisco', raridade: 'raro', tipo: 'tesouro', valor: 0,
    desc: 'Frascos com o prêmio do contrato — as secreções oculares, frescas como o nobre exigiu. É isto que transforma o contrato em ouro.'
  },


  /* ---------- Pergaminhos de MAGIA (estudo no descanso — regras 3.5) ---------- */
  perg_bola_de_fogo: {
    id: 'perg_bola_de_fogo', nome: 'Pergaminho: Bola de Fogo', raridade: 'raro', tipo: 'pergaminho_magia',
    magia: 'bola_de_fogo', circulo: 3, valor: 375,
    desc: 'A caligrafia ainda cheira a enxofre. 6d6 de fogo em área, esperando uma maga capaz de copiá-la (Identificar Magia CD 18).'
  },
  perg_velocidade: {
    id: 'perg_velocidade', nome: 'Pergaminho: Velocidade', raridade: 'raro', tipo: 'pergaminho_magia',
    magia: 'velocidade', circulo: 3, valor: 375,
    desc: 'As letras parecem correr na página. A party inteira acelerada — o sonho de todo grupo de caçadores.'
  },
  perg_sono_profundo: {
    id: 'perg_sono_profundo', nome: 'Pergaminho: Sono Profundo', raridade: 'raro', tipo: 'pergaminho_magia',
    magia: 'sono_profundo', circulo: 3, valor: 375,
    desc: 'Copiado dos Irmãos da Vigília — a mesma ladainha que derrubou Vau da Prata, destilada para o campo de batalha.'
  },
  perg_toque_vampirico: {
    id: 'perg_toque_vampirico', nome: 'Pergaminho: Toque Vampírico', raridade: 'raro', tipo: 'pergaminho_magia',
    magia: 'toque_vampirico', circulo: 3, valor: 375,
    desc: 'Do espólio de Madame Vevra. A tinta não é tinta. As Brancas desaprovariam — e é exatamente por isso que funciona.'
  },
  perg_tempestade_de_gelo: {
    id: 'perg_tempestade_de_gelo', nome: 'Pergaminho: Tempestade de Gelo', raridade: 'raro', tipo: 'pergaminho_magia',
    magia: 'tempestade_de_gelo', circulo: 4, valor: 500,
    desc: 'Encontrado no Limiar do Sonho — sonhado à existência, talvez. Granizo do tamanho de punhos, sem salvamento. 4º círculo: só para mentes treinadas (CD 19).'
  },

  pedra_coracao: {
    id: 'pedra_coracao', nome: 'Pedra do Coração de Vevra (rachada)', raridade: 'unico', tipo: 'artefato',
    desc: 'O foco da Anciã Noturna, rachado ao meio no golpe final. Foi ISTO que teceu pesadelos em Vau da Prata — usando um fio da amostra do selo. As Brancas vão querer estudá-la. Viridiana vai querer de volta.'
  },

  lasca_ferro_runico: {
    id: 'lasca_ferro_runico', nome: 'Lasca de Ferro Rúnico', raridade: 'unico', tipo: 'artefato',
    desc: 'Um fragmento do selo anão, quente ao toque. As runas ainda sussurram: "não abra". Prova do que aconteceu no Paredão — e chave de estudo para a Missão 3.'
  },

  /* ---------- Itens de história (Missão 1) ---------- */
  relicario_anao: {
    id: 'relicario_anao', nome: 'Relicário Anão Obra-Prima', raridade: 'raro', tipo: 'tesouro',
    valor: 350,
    desc: 'Ouro e granito lavrados com runas de proteção. Os anões que o fizeram são os mesmos que selaram... outra coisa, lá embaixo.'
  },
  bastao_detector: {
    id: 'bastao_detector', nome: 'Bastão Detector de Metais e Minerais', raridade: 'unico', tipo: 'artefato',
    desc: 'Vibra na direção de veios de metal puro. No fundo da mina, aponta obstinadamente para uma parede de pedra sólida... (abre a Missão 2: Os Pesadelos Selados)'
  }
});
