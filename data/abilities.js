/* =====================================================
   OZEIN RPG — data/abilities.js
   Habilidades de combate dos heróis (data-driven).
   Cada habilidade descreve o que o motor de combate faz:
   tipo: ataque | cura | buff | controle | magia
   ===================================================== */
GameData.register('abilities', {

  /* ---------- Universais ---------- */
  atacar: {
    id: 'atacar', nome: '⚔️ Atacar', tipo: 'ataque',
    desc: 'Ataque com a arma: d20 + BBA + FOR vs CA.',
    custo: null
  },
  defender: {
    id: 'defender', nome: '🛡️ Defender', tipo: 'buff',
    desc: '+4 CA até a sua próxima ação.',
    aplicar: { condicao: 'protegido', duracao: 1, alvo: 'self' }
  },
  usar_pocao: {
    id: 'usar_pocao', nome: '🧪 Poção', tipo: 'cura',
    desc: 'Bebe uma Poção de Curar Ferimentos Leves (1d8+1).',
    consome: 'pocao_cura_leve', dado: '1d8+1'
  },

  /* ---------- Paladino ---------- */
  golpe_sagrado: {
    id: 'golpe_sagrado', nome: '☀️ Golpe Sagrado', tipo: 'ataque',
    desc: 'Canaliza a Triuni: +CAR no acerto, +nível no dano. Devastador contra o mal. 1× por combate.',
    bonusAcerto: 'CAR', bonusDanoNivel: true, usosPorCombate: 1
  },
  impor_maos: {
    id: 'impor_maos', nome: '✋ Impor as Mãos', tipo: 'cura',
    desc: 'Cura pela graça divina. Reserva diária de PV (nível × mod CAR). Recarrega ao descansar.',
    reservaDiaria: true
  },
  aura_coragem: {
    id: 'aura_coragem', nome: 'Aura de Coragem', tipo: 'passiva',
    desc: 'Party imune a medo perto do paladino (passiva).'
  },

  /* ---------- Ladino ---------- */
  ataque_furtivo: {
    id: 'ataque_furtivo', nome: 'Ataque Furtivo', tipo: 'passiva',
    desc: '+1d6/2 níveis de dano contra alvos desprevenidos, atordoados ou petrificando (passiva — aplica sozinho).'
  },
  truque_sujo: {
    id: 'truque_sujo', nome: '💨 Truque Sujo', tipo: 'controle',
    desc: 'Areia nos olhos: Reflexos CD 13 ou o alvo fica ATORDOADO (perde a próxima ação e fica vulnerável a furtivo).',
    aplicar: { condicao: 'atordoado', duracao: 1, alvo: 'inimigo', salvamento: 'reflexos', cd: 13 }
  },
  evasao: {
    id: 'evasao', nome: 'Evasão', tipo: 'passiva',
    desc: 'Reflexos bem-sucedido contra efeitos de área = dano zero (passiva).'
  },

  /* ---------- Maga (círculo = custo de FOCO ARCANO por combate) ---------- */
  misseis_magicos: {
    id: 'misseis_magicos', nome: '✨ Mísseis Mágicos', tipo: 'magia',
    desc: '2 dardos de força que NUNCA erram (1d4+1 cada). [1º círculo]',
    dado: '1d4+1', projeteis: 2, autoAcerto: true, circulo: 1
  },
  raio_de_gelo: {
    id: 'raio_de_gelo', nome: '❄️ Raio de Gelo', tipo: 'magia',
    desc: 'Toque à distância, 1d6+2 de FRIO — criaturas de fogo sofrem +50%. [1º círculo]',
    dado: '1d6+2', elemento: 'frio', toqueDistancia: true, circulo: 1
  },
  escudo_arcano: {
    id: 'escudo_arcano', nome: '🔮 Escudo Arcano', tipo: 'buff',
    desc: '+4 CA na maga até o fim do combate. [1º círculo]',
    aplicar: { condicao: 'escudo_arcano', duracao: 99, alvo: 'self' }, circulo: 1
  },

  /* ---------- Magias APRENDÍVEIS (pergaminhos + estudo no descanso) ---------- */
  bola_de_fogo: {
    id: 'bola_de_fogo', nome: '🔥 Bola de Fogo', tipo: 'magia',
    desc: 'Esfera rugindo: 6d6 de FOGO em TODOS os inimigos. Reflexos CD 14 para metade. [3º círculo]',
    areaInimigos: true, dado: '6d6', elemento: 'fogo', salvamento: 'reflexos', cd: 14, circulo: 3, aprendivel: true
  },
  velocidade: {
    id: 'velocidade', nome: '💨 Velocidade', tipo: 'magia',
    desc: 'A party inteira fica ACELERADA por 3 turnos (barras de ação 50% mais rápidas). [3º círculo]',
    aplicarParty: { condicao: 'acelerado', duracao: 3 }, circulo: 3, aprendivel: true
  },
  sono_profundo: {
    id: 'sono_profundo', nome: '😴 Sono Profundo', tipo: 'magia',
    desc: 'Ondas de torpor: inimigos comuns fazem Vontade CD 14 ou DORMEM (perdem a próxima ação). Chefes resistem. [3º círculo]',
    controleTodos: { condicao: 'atordoado', duracao: 1 }, cd: 14, circulo: 3, aprendivel: true
  },
  toque_vampirico: {
    id: 'toque_vampirico', nome: '🩸 Toque Vampírico', tipo: 'magia',
    desc: 'Toque à distância: 4d6 de energia NEGATIVA — e metade do dano cura a maga. [3º círculo]',
    dreno: true, dado: '4d6', elemento: 'negativo', alvo: 'inimigo', circulo: 3, aprendivel: true
  },
  tempestade_de_gelo: {
    id: 'tempestade_de_gelo', nome: '🌨️ Tempestade de Gelo', tipo: 'magia',
    desc: 'Granizo do tamanho de punhos: 4d6 de FRIO em TODOS os inimigos, SEM salvamento. [4º círculo]',
    areaInimigos: true, dado: '4d6', elemento: 'frio', circulo: 4, aprendivel: true
  },

  /* ---------- Habilidades de PRESTÍGIO ---------- */
  punicao_celestial: {
    id: 'punicao_celestial', nome: '⚜️ Punição Celestial', tipo: 'ataque', alvo: 'inimigo',
    desc: 'O golpe do Cálice: +CAR no acerto, +2d6 sagrado no dano (o Flagelo soma contra o mal). 1× por combate.',
    ataqueEspecial: { bonusAcertoAtributo: 'CAR', bonusDanoDados: '2d6' }, usosPorCombate: 1
  },
  baluarte: {
    id: 'baluarte', nome: '🛡️ Baluarte', tipo: 'buff',
    desc: 'O Defensor cerra fileiras: a PARTY INTEIRA ganha +4 CA por 2 turnos.',
    aplicarParty: { condicao: 'protegido', duracao: 2 }, usosPorCombate: 2
  },
  clamor_triuni: {
    id: 'clamor_triuni', nome: '☀️ Clamor da Triuni', tipo: 'cura',
    desc: 'O sol de três raios responde: TODA a party cura 2d8 + nível. 1× por combate.',
    curaParty: '2d8', somaNivel: true, usosPorCombate: 1
  },
  ataque_mortal: {
    id: 'ataque_mortal', nome: '🗡️ Ataque Mortal', tipo: 'ataque', alvo: 'inimigo',
    desc: 'A ciência do Assassino: contra alvo atordoado/petrificando (ou atacando OCULTO), inimigos comuns morrem se falharem Fortitude; chefes sofrem +4d6. Sem abertura: +2d6. 1× por combate.',
    mortal: true, usosPorCombate: 1
  },
  passo_sombrio: {
    id: 'passo_sombrio', nome: '🌑 Passo Sombrio', tipo: 'buff',
    desc: 'Some à plena vista: fica OCULTO (inimigos não o alvejam) e o próximo ataque é FURTIVO garantido.',
    aplicar: { condicao: 'oculto', duracao: 2, alvo: 'self' }, usosPorCombate: 2
  },
  estocada_precisa: {
    id: 'estocada_precisa', nome: '🤺 Estocada Precisa', tipo: 'ataque', alvo: 'inimigo',
    desc: 'Esgrima de mestre: soma INT no acerto e ameaça crítico em 15-20 neste golpe.',
    ataqueEspecial: { bonusAcertoAtributo: 'INT', critAmeaca: 15 }, usosPorCombate: 3
  },
  explosao_arcana: {
    id: 'explosao_arcana', nome: '🌟 Explosão Arcana', tipo: 'magia',
    desc: 'Poder bruto da Arquimaga: 5d4 de FORÇA em todos os inimigos, sem salvamento, sem erro. 1× por combate (não gasta foco).',
    areaInimigos: true, dado: '5d4', usosPorCombate: 1
  },
  selo_de_marfim: {
    id: 'selo_de_marfim', nome: '🕊️ Selo de Marfim', tipo: 'buff',
    desc: 'Sigilo das Brancas: a party fica ABENÇOADA por 3 turnos (+2 CA e +2 em todos os salvamentos). [2 de foco]',
    aplicarParty: { condicao: 'abencoado', duracao: 3 }, circulo: 2
  },
  conflagracao: {
    id: 'conflagracao', nome: '⚡ Conflagração', tipo: 'magia', alvo: 'inimigo',
    desc: 'Magia de guerra: toque à distância, 4d6 + nível de FOGO num único alvo. [2 de foco]',
    dado: '4d6', somaNivel: true, elemento: 'fogo', toqueDistancia: true, circulo: 2
  },

  /* ---------- Inimigos ---------- */
  sopro_fogo: {
    id: 'sopro_fogo', nome: 'Sopro de Fogo', tipo: 'area',
    desc: 'Cone de fogo em toda a party. Reflexos CD 13 para metade (Evasão anula).',
    dado: '2d6', elemento: 'fogo', salvamento: 'reflexos', cd: 13
  },
  sopro_fogo_maior: {
    id: 'sopro_fogo_maior', nome: 'Sopro de Fogo Maior', tipo: 'area',
    desc: 'Cone devastador. Reflexos CD 15 para metade.',
    dado: '4d6', elemento: 'fogo', salvamento: 'reflexos', cd: 15
  },
  olhar_petrificante: {
    id: 'olhar_petrificante', nome: 'Olhar Petrificante', tipo: 'olhar',
    desc: 'Fortitude CD 13 ou acumula PETRIFICANDO (2 acúmulos = pedra até o fim do combate). Desviar os olhos imuniza.',
    salvamento: 'fortitude', cd: 13, condicao: 'petrificando'
  },
  rocha_incandescente: {
    id: 'rocha_incandescente', nome: 'Rocha Incandescente', tipo: 'ataque_pesado',
    desc: 'Arremesso brutal com fogo residual (QUEIMANDO: 1d6/turno por 2 turnos).',
    dado: '2d8+7', elemento: 'fogo', aplica: { condicao: 'queimando', duracao: 2, chance: 0.5 }
  }
,
  aura_desespero: {
    id: 'aura_desespero', nome: 'Aura de Desespero', tipo: 'aura',
    desc: 'O pesadelo pressiona as mentes: Vontade CD 15 ou ABALADO (-2 no acerto) por 2 turnos.',
    salvamento: 'vontade', cd: 16, condicao: 'abalado', duracao: 2
  },
  lamento_funebre: {
    id: 'lamento_funebre', nome: 'Lamento Fúnebre', tipo: 'area',
    desc: 'Onda de energia da morte sobre a party. Vontade CD 15 para metade.',
    dado: '2d6', elemento: 'negativo', salvamento: 'vontade', cd: 14
  },

  /* ---------- Inimigos — Missão 3 ---------- */
  toque_do_sono: {
    id: 'toque_do_sono', nome: 'Toque do Sono', tipo: 'ataque_pesado',
    desc: 'Palma aberta sobre a testa: dano e chance de APAGAR (perde a próxima ação).',
    dado: '1d6+3', aplica: { condicao: 'atordoado', duracao: 1, chance: 0.35 }
  },
  prece_sombria: {
    id: 'prece_sombria', nome: 'Prece Sombria de Nerull', tipo: 'area',
    desc: 'Ladainha do Ceifador: 2d8 de energia negativa na party. Vontade CD 15 para metade.',
    dado: '2d8', elemento: 'negativo', salvamento: 'vontade', cd: 15
  },
  fumaca_sufocante: {
    id: 'fumaca_sufocante', nome: 'Fumaça Sufocante', tipo: 'aura',
    desc: 'A crina em brasa vomita fumaça: Fortitude CD 15 ou ABALADO (-2 no acerto) por 2 turnos.',
    salvamento: 'fortitude', cd: 15, condicao: 'abalado', duracao: 2
  },
  pesadelo_vivido: {
    id: 'pesadelo_vivido', nome: 'Pesadelo Vívido', tipo: 'area',
    desc: 'A Anciã costura o pior medo de cada um: 3d6 de energia negativa. Vontade CD 16 para metade.',
    dado: '3d6', elemento: 'negativo', salvamento: 'vontade', cd: 16
  },
  vigilia_rubra: {
    id: 'vigilia_rubra', nome: 'Vigília Rubra', tipo: 'cura_aliada',
    desc: 'A sacerdotisa rediviva remenda a carne do aliado mais ferido (2d8+2).',
    dado: '2d8+2'
  }

});
