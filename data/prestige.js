/* =====================================================
   OZEIN RPG — data/prestige.js
   Classes de prestígio (D&D 3.5): 3 opções por herói.
   Escolha PERMANENTE no Anexo dos Caçadores (nível 4+).
   Cada uma dá: bônus fixos, uma PASSIVA e uma HABILIDADE nova.
   As passivas são lidas por loot.js (stats) e combat.js (motor).

   v0.8.0 — REBALANCEADO (fiel às CdP do 3.5):
   As 9 trilhas seguem o mesmo "orçamento de poder":
   · Paladino: Cálice = ofensa vs o mal · Defensor = mitigação · Campeão = suporte divino
   · Ladino:   Assassino = execução · Dançarino = evasão/sobrevivência · Duelista = esgrima técnica
   · Maga:     Arquimaga = recursos · Encantatriz = controle/CD · Batalha = dano puro
   Mudanças: Defensor perdeu +2 CA fixo (ficou +1, como a Postura Defensiva
   do Anão Defensor) e o Baluarte agora dá +2 CA (não +4); Cavaleiro ganhou
   PV e 2ª Punição (o smite do 3.5 escala usos); Campeão ganhou PV; o
   Dançarino ganhou a ROLADA DEFENSIVA (defensive roll do Shadowdancer — a
   passiva que faltava); o RIPOSTE do Duelista virou 1×/rodada (parry do
   3.5, não metralhadora); a Maga de Batalha perdeu o +1 CA (War Wizard
   não é tanque).
   ===================================================== */
GameData.register('prestige', {

  requisitoNivel: 4,

  paladino: [
    {
      id: 'cavaleiro_calice',
      nome: 'Cavaleiro do Cálice',
      fonte: 'Knight of the Chalice (Complete Warrior 3.5) — adaptado à Ordem de Felix Magna',
      icone: '⚜️',
      desc: 'O braço anti-Abismo da Ordem. Juramento de caçar demônios, aberrações e mortos-vivos onde quer que rastejem.',
      lore: 'Depois do Paredão, a Ordem de Felix Magna reconheceu o inevitável: Renânia é uma frente de guerra contra o Abismo. O Cálice é o juramento dos que lutam essa guerra de espada na mão.',
      bonus: { pvExtra: 10, bonusAcerto: 1 },
      passiva: { flagelo: '2d6' },
      passivaDesc: 'FLAGELO DO ABISMO: +2d6 de dano em TODO ataque contra demônios, aberrações e mortos-vivos.',
      habilidadeNova: 'punicao_celestial'
    },
    {
      id: 'defensor_juramentado',
      nome: 'Defensor Juramentado',
      fonte: 'Anão Defensor (DMG 3.5) — adaptado ao juramento do Selo',
      icone: '🛡️',
      desc: 'O muro entre o selo e o mundo. Aprende com os mortos anões a arte de NÃO SAIR DO LUGAR.',
      lore: '"Sete fechos, sete juramentos." Bruno traduziu as runas; o paladino entendeu o resto: alguém precisa ser a oitava fechadura. Postura baixa, escudo alto, e o mundo quebra contra você.',
      bonus: { pvExtra: 12, caExtra: 1 },
      passiva: { rd: 3 },
      passivaDesc: 'REDUÇÃO DE DANO 3/—: todo golpe recebido causa 3 de dano a menos (mínimo 0).',
      habilidadeNova: 'baluarte'
    },
    {
      id: 'campeao_divino',
      nome: 'Campeão Divino da Triuni',
      fonte: 'Divine Champion (Forgotten Realms 3.5) — adaptado à Triuni',
      icone: '☀️',
      desc: 'A graça da Triuni em estado bruto: mais golpes sagrados, salvamentos abençoados e o Clamor que reergue a party.',
      lore: 'Há paladinos que carregam a fé como armadura. O Campeão a carrega como TEMPESTADE: quando ele clama, o sol de três raios responde — e a party inteira sente.',
      bonus: { pvExtra: 10, salvamentos: { fortitude: 1, reflexos: 1, vontade: 1 } },
      passiva: { golpeSagradoUsos: 2 },
      passivaDesc: 'GRAÇA MAIOR: +1 uso base do Golpe Sagrado por combate (2 em vez de 1, antes dos bônus de nível).',
      habilidadeNova: 'clamor_triuni'
    }
  ],

  ladino: [
    {
      id: 'assassino',
      nome: 'Assassino',
      fonte: 'Assassino (DMG 3.5) — técnica roubada das Adagas Negras',
      icone: '🗡️',
      desc: 'A morte como ciência exata. Estude o alvo, ache a fresta, acabe a conversa.',
      lore: 'Na Capela das Lamúrias, o ladino copiou o que os sacerdotes de roupão vermelho-ferrugem não deviam ter escrito: o método das Adagas Negras. A guilda não pergunta COMO os contratos morrem.',
      bonus: { bonusAcerto: 1 },
      passiva: { furtivoExtra: 1 },
      passivaDesc: 'FURTIVO APRIMORADO: +1d6 em todos os ataques furtivos.',
      habilidadeNova: 'ataque_mortal'
    },
    {
      id: 'dancarino_sombras',
      nome: 'Dançarino das Sombras',
      fonte: 'Shadowdancer (DMG 3.5)',
      icone: '🌑',
      desc: 'Esconder-se À PLENA VISTA. A sombra vira porta, o combate vira palco, e o ladino nunca está onde o golpe cai.',
      lore: 'No Limiar do Sonho, o ladino aprendeu que a escuridão entre as coisas é um LUGAR — e que dá pra pisar nele. Os fihyr recuaram dele. Fihyr não recuam de nada.',
      bonus: { pvExtra: 6, salvamentos: { reflexos: 2 } },
      passiva: { roladaDefensiva: true },
      passivaDesc: 'ROLADA DEFENSIVA (1×/combate): o golpe que o derrubaria causa METADE do dano — o Dançarino rola com o impacto. +2 em Reflexos (já incluso).',
      habilidadeNova: 'passo_sombrio'
    },
    {
      id: 'duelista',
      nome: 'Duelista',
      fonte: 'Duelista (DMG 3.5)',
      icone: '🤺',
      desc: 'Esgrima como aritmética: a Inteligência vira esquiva, o erro do inimigo vira RIPOSTE.',
      lore: 'Rapieira fina, postura de mestre-sala, e a matemática fria de quem já contou os passos do inimigo antes do primeiro golpe. Em Úbia, os duelistas do Museu dos Heróis têm estátua.',
      bonus: { pvExtra: 6 },
      passiva: { caInt: true, contraAtaque: true },
      passivaDesc: 'ESQUIVA ERUDITA: soma o mod. de INT na CA. RIPOSTE (1×/rodada): quando um inimigo ERRA você, contra-ataque imediato grátis.',
      habilidadeNova: 'estocada_precisa'
    }
  ],

  maga: [
    {
      id: 'arquimaga',
      nome: 'Arquimaga (Iniciada)',
      fonte: 'Archmage (DMG 3.5)',
      icone: '🌟',
      desc: 'O caminho do PODER BRUTO: mais foco arcano por combate e a Explosão Arcana que não pede licença.',
      lore: 'Toda torre tem andares que os aprendizes não veem. A trilha da Arquimaga é subir de dois em dois degraus — e as Brancas observam, entre orgulho e alarme.',
      bonus: { pvExtra: 4 },
      passiva: { focoExtra: 3, cdMagia: 1 },
      passivaDesc: 'RESERVA PROFUNDA: +3 de foco arcano por combate. PODER ARCANO: +1 na CD das suas magias.',
      habilidadeNova: 'explosao_arcana'
    },
    {
      id: 'encantatriz_branca',
      nome: 'Encantatriz Branca (Iniciada)',
      fonte: 'Incantatrix (3.5) — a trilha canônica das Brancas',
      icone: '🕊️',
      desc: 'O caminho da ORDEM: metamagia das Brancas, selos de proteção e magias que os inimigos não conseguem sacudir de cima.',
      lore: 'A Cidadela de Marfim finalmente respondeu com mais do que "observem": um sigilo de iniciada, entregue por corvo. A maga agora estuda o que Lysia estudou — para usar do outro lado.',
      bonus: { pvExtra: 4 },
      passiva: { cdMagia: 2, vontadeParty: 2 },
      passivaDesc: 'MAGIA PERSISTENTE: +2 na CD das suas magias. ÉGIDE DE MARFIM: a party inteira ganha +2 em Vontade.',
      habilidadeNova: 'selo_de_marfim'
    },
    {
      id: 'maga_batalha',
      nome: 'Maga de Batalha de Vithus',
      fonte: 'War Wizard (3.5) — sob licença dos Juízes Arcanos',
      icone: '⚡',
      desc: 'O caminho da GUERRA: cada dado de dano das suas magias bate mais forte, e a Conflagração abre trincheira.',
      lore: 'Os Juízes Arcanos de Danos licenciam poucos conjuradores de guerra por década. Uma aspirante das Brancas com serviço prestado em Renânia? Assinaram no mesmo dia.',
      bonus: { pvExtra: 6 },
      passiva: { danoPorDado: 1 },
      passivaDesc: 'MAGIA DE GUERRA: +1 de dano por DADO rolado nas suas magias (6d6 → +6).',
      habilidadeNova: 'conflagracao'
    }
  ]
});
