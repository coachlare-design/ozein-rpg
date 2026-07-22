/* =====================================================
   OZEIN RPG — data/dialogs.js
   Diálogos e cenas. Formato:
   - dialogo: sequência de falas + opções com efeitos
   - condicao das opções: semMissao / flag / semFlag / missaoConcluida
   O motor (engine.js) interpreta; adicionar cena = adicionar dado.
   ===================================================== */
GameData.register('dialogs', {

  /* ================= CIDADE ================= */

  taverna_intro: {
    cenario: 'assets/img/cidade-praca.png',
    falas: [
      { quem: 'Narrador', texto: 'A Taverna do Jarro Dourado cheira a cerveja escura, sebo de vela e carvão — tudo em Renânia cheira um pouco a carvão. Conversas morrem por um instante quando o sol da Triuni no seu peito reflete a luz das tochas.' },
      { quem: 'Odo, o taverneiro', texto: 'Um paladino, é? Faz tempo que a Ordem não manda ninguém pra estas bandas... e olha que motivo não falta. As minas andam vomitando coisa ruim.' },
      { quem: 'Odo, o taverneiro', texto: 'Cães com presas de brasa na entrada. Mineradores que viraram PEDRA nas galerias fundas. E o Barão... bom, o Barão paga bem pra quem resolve, e pergunta pouco. O quadro dos Caçadores tá ali na parede.' }
    ],
    opcoes: [
      { texto: 'Perguntar sobre os "pesadelos selados" que os velhos mencionam', goto: 'taverna_pesadelos' },
      { texto: 'Examinar o quadro de contratos', efeito: [{ tipo: 'dialogo', valor: 'quadro_contratos' }] },
      { texto: 'Voltar à praça', efeito: [{ tipo: 'voltarCidade' }] }
    ],
    codex: { id: 'renania', titulo: 'Renânia', texto: 'Região mineradora e montanhosa a oeste de Vithus. Ferro, carvão — e uma corrupção crescente que a Ordem de Felix Magna mandou investigar.' }
  },

  taverna_pesadelos: {
    falas: [
      { quem: 'Odo, o taverneiro', texto: '(baixa a voz e o pano de limpar copos) ...Isso é conversa dos velhos, senhor cavaleiro. Dizem que os anões, muito antes da vila existir, selaram alguma coisa no fundo da montanha. "Os pesadelos há muito esquecidos", eles falam.' },
      { quem: 'Odo, o taverneiro', texto: 'Bobagem, provavelmente. Mas vou dizer uma coisa: teve gente estranha na vila esses meses. Uma mulher de preto, fina como navalha, e uns... sócios. Faziam perguntas sobre as galerias fundas. Não eram mineradores, disso eu sei.' }
    ],
    opcoes: [
      { texto: '"Uma mulher de preto?" (anotar no diário)', goto: 'taverna_lysia' },
      { texto: 'Agradecer e examinar o quadro de contratos', efeito: [{ tipo: 'dialogo', valor: 'quadro_contratos' }] }
    ],
    codex: { id: 'pesadelos_selados', titulo: 'Os Pesadelos Selados (rumor)', texto: 'Lenda local: os anões teriam selado "pesadelos há muito esquecidos" no fundo da montanha de Renânia. Os velhos da taverna acreditam. O taverneiro finge que não.' }
  },

  taverna_lysia: {
    falas: [
      { quem: 'Odo, o taverneiro', texto: 'Não me olhe assim, eu não perguntei o nome. Quem serve cerveja aprende a não perguntar. Mas o Detectar o Mal do senhor... (ele engole seco) ...talvez funcione melhor que a minha memória.' },
      { quem: 'Narrador', texto: 'Sua intuição de paladino se agita. A corrupção que a Ordem sentiu de longe tem agentes — e eles estiveram exatamente onde você está agora.' }
    ],
    opcoes: [
      { texto: 'Examinar o quadro de contratos', efeito: [{ tipo: 'dialogo', valor: 'quadro_contratos' }] },
      { texto: 'Voltar à praça', efeito: [{ tipo: 'voltarCidade' }] }
    ],
    codex: { id: 'mulher_de_preto', titulo: 'A mulher de preto (pista)', texto: 'Uma mulher vestida de preto e "sócios" fizeram perguntas sobre as galerias fundas de Renânia. Não eram mineradores. A corrupção tem agentes.' }
  },

  quadro_contratos: {
    cenario: 'assets/img/cidade-praca.png',
    falas: [
      { quem: 'Narrador', texto: 'O quadro dos Caçadores é um retângulo de cortiça surrada com o selo da guilda de Úbia — a Cidade dos Heróis — pregado no alto. Um único contrato novo, em pergaminho caro:' },
      { quem: 'Contrato', texto: '"CONTRATO RANQUEADO — RANK C. Recompensa: 600 peças de ouro + crédito de rank. Um basilisco infesta as minas a oeste de Renânia. Exijo suas secreções oculares, frescas, para fins alquímicos. Provas da morte serão verificadas. — assinado, um NOBRE INTERESSADO. (A guilda retém 25% do prêmio.)"' }
    ],
    opcoes: [
      { texto: '⚔️ Aceitar o contrato do Basilisco (inicia a Missão 1)', condicao: { semMissao: 'missao1' },
        efeito: [{ tipo: 'aceitarMissao', valor: 'missao1' }, { tipo: 'dialogo', valor: 'contrato_aceito' }] },
      { texto: '💰 Entregar as secreções e COBRAR A RECOMPENSA', condicao: { flag: 'missao1Cobrar', missaoNaoConcluida: 'missao1' },
        goto: 'cobrar_recompensa' },
      { texto: '🩸 CONTRATO DIRETO RANK B: "A Vila que Dorme" (inicia a Missão 3)', condicao: { flag: 'v02Completa', semMissao: 'missao3' },
        efeito: [{ tipo: 'aceitarMissao', valor: 'missao3' }, { tipo: 'dialogo', valor: 'm3_aceita' }] },
      { texto: 'Deixar o quadro', efeito: [{ tipo: 'voltarCidade' }] }
    ],
    codex: { id: 'cacadores', titulo: 'Os Caçadores', texto: 'Guilda de mercenários ranqueados (C/B/A/S) com sede em Úbia, a Cidade dos Heróis. Chefe: Jack Caolha. A guilda retém 25% de cada prêmio. Em Renânia, mantém um quadro de contratos na taverna.' }
  },

  contrato_aceito: {
    falas: [
      { quem: 'Narrador', texto: 'Você arranca o pergaminho do quadro. O taverneiro ergue a caneca num brinde silencioso — metade respeito, metade despedida.' },
      { quem: 'Odo, o taverneiro', texto: 'Vou guardando um quarto, senhor cavaleiro. Ou uma vela pela sua alma. O que for preciso primeiro.' },
      { quem: 'Narrador', texto: 'MISSÃO 1 INICIADA: O Basilisco de Renânia. O Portão Oeste agora está aberto no mapa. (Dica: descanse na taverna para salvar antes de partir.)' }
    ],
    opcoes: [
      { texto: 'Partir para o Portão Oeste (mapa de nós)', efeito: [{ tipo: 'irMapa' }] },
      { texto: 'Voltar à praça primeiro', efeito: [{ tipo: 'voltarCidade' }] }
    ]
  },

  forja_intro: {
    falas: [
      { quem: 'Mestre Bruno', texto: '(sem parar de martelar) Aço da Ordem, hein. Bom aço. Se voltar das minas inteiro, traga o que achar de metal — eu pago justo, ou conserto o que os bichos amassarem.' },
      { quem: 'Mestre Bruno', texto: 'E paladino... se topar com uma parede de FERRO PURO lá embaixo, longe das galerias novas... não encoste. Meu avô dizia que os anões não construíram aquilo pra guardar tesouro. Construíram pra guardar A GENTE.' }
    ],
    opcoes: [
      { texto: '🛒 Ver as mercadorias (loja)', efeito: [{ tipo: 'loja' }] },
      { texto: '📿 Mostrar o relicário anão a Bruno (as runas!)', condicao: { missao: 'missao2' }, goto: 'bruno_runas' },
      { texto: 'Voltar à praça', efeito: [{ tipo: 'voltarCidade' }] }
    ],
    codex: { id: 'ferro_puro', titulo: 'A parede de ferro puro (rumor)', texto: 'O ferreiro alerta: existe uma parede de ferro puro nas profundezas, obra dos anões. "Não construíram pra guardar tesouro. Construíram pra guardar a gente."' }
  },

  /* ================= ESTRADA (CENAS) ================= */

  cena_carroca: {
    cenario: 'assets/img/cenario-estrada.png',
    falas: [
      { quem: 'Narrador', texto: 'Uma carroça de minério está atolada na lama, torta como um dente ruim. O minerador — um homem grisalho com um braço enfaixado — tenta sozinho, e perde.' },
      { quem: 'Minerador Tobias', texto: 'Maldita estrada, maldita chuva, maldita mina! ...Perdão, senhor cavaleiro. Se puder ajudar um velho, eu pago com o que tenho: informação. E dessas que valem ouro.' }
    ],
    opcoes: [
      { texto: '💪 Pôr o ombro na roda [teste de FORÇA, CD 12]',
        efeito: [{ tipo: 'teste', atributo: 'FOR', cd: 12, sucesso: 'carroca_sucesso', falha: 'carroca_falha' }] },
      { texto: '🗣️ Organizar a força dele com a sua [DIPLOMACIA, CD 10]',
        efeito: [{ tipo: 'teste', pericia: 'Diplomacia', cd: 10, sucesso: 'carroca_sucesso', falha: 'carroca_falha' }] },
      { texto: 'Seguir viagem sem parar (o contrato não espera)', efeito: [{ tipo: 'fecharCena' }] }
    ]
  },

  carroca_sucesso: {
    cenario: 'assets/img/cenario-estrada.png',
    falas: [
      { quem: 'Narrador', texto: 'A roda salta do sulco com um estalo de madeira e alívio. Tobias cospe na mão e aperta a sua.' },
      { quem: 'Minerador Tobias', texto: 'A informação prometida: o bicho de pedra tem um TRUQUE, senhor. É o OLHAR dele que petrifica. Meu primo sobreviveu lutando de olhos no chão, mirando pelo reflexo d\'água. Feio de ver, mas voltou de carne e osso.' },
      { quem: 'Narrador', texto: '(Registrado no diário. No combate contra o basilisco, use o botão 👁️ DESVIAR OS OLHOS: fica imune ao olhar, com -4 no acerto.)' }
    ],
    opcoes: [{ texto: 'Seguir para a Trilha da Encosta', efeito: [{ tipo: 'fecharCena' }] }],
    codex: { id: 'fraqueza_basilisco', titulo: 'Fraqueza do basilisco', texto: 'É o olhar que petrifica. Combater sem visão direta (👁️ Desviar os olhos, no combate) evita a petrificação, ao custo de -4 no acerto. Cortesia do minerador Tobias.' },
    xp: 150
  },

  carroca_falha: {
    cenario: 'assets/img/cenario-estrada.png',
    falas: [
      { quem: 'Narrador', texto: 'A carroça range, desliza... e afunda mais um palmo. Tobias suspira e senta na lama.' },
      { quem: 'Minerador Tobias', texto: 'Deixa, senhor. Mando buscar bois na vila. Vá com a Triuni — e um conselho de graça: nas minas, CUIDADO COM OS OLHOS. É tudo que sei.' }
    ],
    opcoes: [{ texto: 'Seguir para a Trilha da Encosta', efeito: [{ tipo: 'fecharCena' }] }],
    xp: 50
  },

  cena_encosta: {
    cenario: 'assets/img/cenario-encosta.png',
    falas: [
      { quem: 'Narrador', texto: 'A trilha aperta contra o penhasco. Lá embaixo, o rio é uma linha de prata fria. À frente, o cascalho da encosta tem um brilho solto, recém-mexido — como se algo pesado tivesse passado por cima. Ou estivesse esperando.' }
    ],
    opcoes: [
      { texto: '👁️ Estudar a encosta antes de cruzar [SABEDORIA, CD 12]',
        efeito: [{ tipo: 'teste', atributo: 'SAB', cd: 12, sucesso: 'encosta_sucesso', falha: 'encosta_queda' }] },
      { texto: '🏃 Atravessar rápido e leve [DESTREZA, CD 14]',
        efeito: [{ tipo: 'teste', atributo: 'DES', cd: 14, sucesso: 'encosta_sucesso', falha: 'encosta_queda' }] }
    ]
  },

  encosta_sucesso: {
    cenario: 'assets/img/cenario-encosta.png',
    falas: [
      { quem: 'Narrador', texto: 'Você lê a montanha como um texto sagrado: ali, o cascalho é crosta fina sobre o vazio. Contornando pelo paredão, a travessia é lenta — e segura.' },
      { quem: 'Narrador', texto: 'No último trecho, você encontra marcas: patas grandes, de canídeo, com o cascalho DERRETIDO em volta. A matilha usa esta trilha. A entrada das minas está logo adiante.' }
    ],
    opcoes: [{ texto: 'Avançar para a Entrada das Minas', efeito: [{ tipo: 'fecharCena' }] }],
    codex: { id: 'marcas_caes', titulo: 'Marcas na encosta', texto: 'Pegadas de canídeo com cascalho derretido ao redor: cães infernais usam a Trilha da Encosta. A matilha é real, e é grande.' },
    xp: 150
  },

  encosta_queda: {
    cenario: 'assets/img/cenario-encosta.png',
    falas: [
      { quem: 'Narrador', texto: 'O chão trai. O mundo vira poeira e pedra rolando — você se agarra a uma raiz no último instante, o coração martelando contra a cota de malha. (–4 PV)' },
      { quem: 'Narrador', texto: 'Escalando de volta, arranhado e coberto de pó, você nota o que o deslizamento expôs: patas grandes, de canídeo, com o cascalho DERRETIDO em volta. A matilha usa esta trilha.' }
    ],
    opcoes: [{ texto: 'Avançar para a Entrada das Minas (mais devagar agora)', efeito: [{ tipo: 'fecharCena' }] }],
    efeitoEntrada: [{ tipo: 'dano', valor: 4 }],
    codex: { id: 'marcas_caes', titulo: 'Marcas na encosta', texto: 'Pegadas de canídeo com cascalho derretido ao redor: cães infernais usam a Trilha da Encosta. A matilha é real, e é grande.' },
    xp: 50
  },

  /* ================= NÓS DE COMBATE — MISSÃO 1 ================= */

  cena_no1: {
    cenario: 'assets/img/cenario-entrada-mina.png',
    falas: [
      { quem: 'Narrador', texto: 'A entrada da mina abre na rocha como uma boca sem dentes. E na penumbra, olhos acendem — brasas vivas. A matilha de CÃES INFERNAIS se levanta, e atrás dela, um alfa do tamanho de um pônei rosna fumaça.' },
      { quem: '???', texto: '(uma voz sussurra de cima das rochas) "Psiu. Cavaleiro. Segura os dois primeiros que eu cuido do resto. Depois a gente discute quem fica com o quê."' }
    ],
    opcoes: [
      { texto: '⚔️ ERGUER O ESCUDO — combate!', efeito: [{ tipo: 'combate', valor: 'no1_matilha' }] },
      { texto: 'Recuar ao mapa (por enquanto)', efeito: [{ tipo: 'sairCena' }] }
    ]
  },

  no1_vitoria: {
    cenario: 'assets/img/cenario-entrada-mina.png',
    falas: [
      { quem: 'Narrador', texto: 'O último cão tomba fumegando. Do alto da pedreira, o ladino desce limpando a rapieira com um trapo que já foi um lenço de alguém.' },
      { quem: 'Ladino', texto: '"Aspirante dos Caçadores, rank em construção. O contrato do basilisco? É meu também. Proposta: a gente racha o serviço, e o crédito de rank fica comigo. O ouro a gente divide. Fechado?"' },
      { quem: 'Narrador', texto: 'Ele não espera resposta — já está andando pra dentro da mina. Alguma coisa nele lembra o Yurin, o contato que o indicou... e isso não é exatamente um elogio.' },
      { quem: 'Narrador', texto: 'Mas o Alfa Nessiano FUGIU mina adentro. Cães infernais não avisam ninguém... a menos que TENHAM um dono.' }
    ],
    opcoes: [{ texto: 'Seguir para a Caverna Oculta', efeito: [{ tipo: 'sairCena' }] }],
    codex: { id: 'ladino_junta', titulo: 'O ladino dos Caçadores', texto: 'Juntou-se à party na entrada das minas — pelo crédito de rank e metade do ouro. O contato dele em Renânia é Yurin, um bruxo cinzento. O Alfa Nessiano fugiu ferido, mina adentro: cães assim costumam ter dono.' }
  },

  cena_no2: {
    cenario: 'assets/img/cenario-caverna.png',
    falas: [
      { quem: 'Narrador', texto: 'A caverna oculta é um jardim de estátuas: mineradores petrificados em poses de fuga, o horror preservado em granito fino. Entre elas, algo desliza pesado, escamas contra pedra.' },
      { quem: 'Ladino', texto: '"Lembra do plano: OLHOS BAIXOS. Quem virar pedra carrega o outro. Brincadeira. Ninguém carrega ninguém, pedra pesa."' }
    ],
    opcoes: [
      { texto: '⚔️ Enfrentar o BASILISCO! (dica: 👁️ Desviar os olhos)', efeito: [{ tipo: 'combate', valor: 'no2_basilisco' }] },
      { texto: 'Recuar ao mapa (por enquanto)', efeito: [{ tipo: 'sairCena' }] }
    ]
  },

  no2_vitoria: {
    cenario: 'assets/img/cenario-caverna.png',
    falas: [
      { quem: 'Narrador', texto: 'O basilisco estremece uma última vez e para. Com muito cuidado — e os olhos ainda meio desviados — vocês colhem as SECREÇÕES OCULARES no frasco do contrato.' },
      { quem: 'Ladino', texto: '"Prêmio garantido. MAS... os cães não vieram desse bicho. E o alfa fugiu pra DENTRO, não pra fora. Tem mais coisa no fundo dessa mina, cavaleiro."' },
      { quem: 'Narrador', texto: 'Ao fundo da caverna, uma galeria desce. Do poço escuro sobe um calor errado — e um som rítmico, metálico. Um MARTELO. Alguém — algo — está FORJANDO lá embaixo.' }
    ],
    opcoes: [{ texto: 'Descer ao Fundo da Mina', efeito: [{ tipo: 'sairCena' }] }],
    codex: { id: 'secrecoes', titulo: 'Secreções do basilisco (prêmio)', texto: 'O prêmio do contrato foi colhido. Falta voltar ao quadro dos Caçadores e cobrar a recompensa — mas a mina ainda ecoa um som de martelo lá embaixo...' }
  },

  cena_no3: {
    cenario: 'assets/img/cenario-forja.png',
    falas: [
      { quem: 'Narrador', texto: 'O fundo da mina não devia ter luz. Tem. Uma FORJA ruge entre pilares de rocha viva, e diante dela, um GIGANTE DO FOGO de quatro metros martela algo incandescente, flanqueado por dois cães infernais do tamanho de touros.' },
      { quem: 'Ladino', texto: '(sussurrando) "Aquela válvula de vapor ali... se alguém arrombar no momento certo, o grandão vai sentir. Só dizendo." (💨 ação LIBERAR VAPOR disponível no combate)' },
      { quem: 'Narrador', texto: 'Sobre a bigorna, entre pilhas de ouro, repousa um bastão de metal estranho. O gigante ergue a cabeça. Fareja. E sorri com dentes de carvão em brasa.' }
    ],
    opcoes: [
      { texto: '⚔️ O CHEFE: enfrentar o Gigante do Fogo!', efeito: [{ tipo: 'combate', valor: 'no3_gigante' }] },
      { texto: 'Recuar ao mapa (por enquanto)', efeito: [{ tipo: 'sairCena' }] }
    ]
  },

  no3_vitoria: {
    cenario: 'assets/img/cenario-forja.png',
    falas: [
      { quem: 'Narrador', texto: 'O gigante desaba de joelhos e depois de bruços, fazendo a caverna inteira tremer. O silêncio que sobra é tão grande que dói nos ouvidos.' },
      { quem: 'Narrador', texto: 'No tesouro: pilhas de ouro, um relicário anão obra-prima... e o BASTÃO DETECTOR DE METAIS E MINERAIS, que vibra na sua mão como um animal nervoso — apontando obstinadamente para a parede do fundo.' },
      { quem: 'Narrador', texto: 'Sob a fuligem, a parede não é de pedra. É de FERRO PURO. Runas anãs correm pelo metal antigo. Você não lê anão. Mas algumas palavras dispensam tradução: "NÃO ABRA."' },
      { quem: 'Ladino', texto: '"...O gigante não estava MORANDO aqui, cavaleiro. Estava CAVANDO. Alguém pagou por isso. E eu apostaria o meu rank em quem."' }
    ],
    opcoes: [{ texto: 'Voltar a Renânia e cobrar a recompensa', efeito: [{ tipo: 'flag', valor: 'missao1Cobrar' }, { tipo: 'sairCena' }] }],
    codex: { id: 'porta_ferro', titulo: 'A parede de ferro puro', texto: 'No fundo da mina, atrás da forja do gigante, há uma parede de FERRO PURO com grafia rúnica anã: "não abra — aqui foram selados os pesadelos há muito esquecidos." O Bastão Detector aponta para ela. O gigante estava CAVANDO em direção a ela — pago por alguém. (Missão 2)' }
  },

  /* ================= RECOMPENSA E EPÍLOGO (Passe C) ================= */

  cobrar_recompensa: {
    cenario: 'assets/img/cidade-praca.png',
    falas: [
      { quem: 'Narrador', texto: 'Na taverna, um homem de libré discreta espera junto ao quadro — o emissário do "nobre interessado". Ele examina os frascos contra a luz da tocha com um monóculo de alquimista.' },
      { quem: 'Emissário', texto: '"Frescas, íntegras... impecáveis. Meu senhor ficará satisfeito." (ele empurra uma bolsa pesada) "600 peças, menos os 25% da guilda: 450 de ouro. O crédito de rank C já foi registrado em Úbia — parabéns ao... Caçador."' },
      { quem: 'Ladino', texto: '(pesando a bolsa) "Rank C. Oficialmente no papel. Sabe o que isso significa, cavaleiro? Que a gente precisa de uma BASE. E eu já sei qual."' }
    ],
    opcoes: [
      { texto: 'Continuar ▸', efeito: [
        { tipo: 'ouro', valor: 450 },
        { tipo: 'removerConsumivel', valor: 'secrecoes_basilisco' },
        { tipo: 'etapa', valor: 'e6' },
        { tipo: 'concluirMissao', valor: 'missao1' },
        { tipo: 'flag', valor: 'rankC' },
        { tipo: 'dialogo', valor: 'casebre_novo' }
      ] }
    ],
    codex: { id: 'rank_c', titulo: 'Rank C — Caçadores', texto: 'O contrato do basilisco foi pago (450 po líquidos) e o crédito de rank C registrado em Úbia no nome do ladino. O primeiro degrau da guilda.' }
  },

  casebre_novo: {
    falas: [
      { quem: 'Narrador', texto: 'O "casebre" fica na beira da vila: pedra fria, telhado que precisa de carinho e uma lareira que, surpreendentemente, funciona. O velho dono aceitou o aluguel adiantado sem perguntar de onde veio o ouro. Renânia é assim.' },
      { quem: 'Ladino', texto: '"Base própria. Cama, lareira, e uma tábua solta no assoalho pra guardar o que não se mostra. TETO é o que separa aventureiro de vagabundo, cavaleiro."' },
      { quem: 'Narrador', texto: '🏠 CASEBRE DA PARTY desbloqueado na praça: descansar, salvar e (em breve) guardar tesouros. E na porta, na manhã seguinte, alguém espera...' }
    ],
    opcoes: [{ texto: 'Ver quem espera na porta ▸', efeito: [{ tipo: 'flag', valor: 'casebre' }, { tipo: 'dialogo', valor: 'epilogo_maga' }] }],
    codex: { id: 'casebre', titulo: 'Casebre da party (base)', texto: 'Base própria em Renânia, conquistada com o ouro da Missão 1. Ponto de descanso e save. O ladino insiste que a tábua solta do assoalho é "recurso estratégico".' }
  },

  epilogo_maga: {
    falas: [
      { quem: 'Narrador', texto: 'Ela está sentada na mureta do casebre, com um corvo no ombro e um grimório azul-meia-noite no colo. Jovem, olheiras de quem estuda demais, olhar de quem não dorme por escolha.' },
      { quem: 'Maga', texto: '"Vocês limparam as minas. Vocês viram a parede de ferro. E vocês NÃO abriram — o que já os torna mais sensatos que a maioria." (ela desce da mureta) "Meu nome não importa ainda. Minha ordem, sim: as Incantatrix BRANCAS."' },
      { quem: 'Maga', texto: '"Há uma Negra operando em Renânia. Lysia Moss. Foi ela quem pagou o gigante para cavar — e é ela quem quer abrir o selo. Sozinha, eu não chego nem no jardim dela. Com vocês..." (o corvo crocita) "...o Cinza acha que sim."' },
      { quem: 'Narrador', texto: '🎉 A MAGA junta-se à party! A v0.1 do jogo está COMPLETA — a Missão 2, "Os Pesadelos Selados", é a próxima fatia da construção. Continue explorando as minas (os nós podem ser re-explorados pra farmar loot) ou descanse na sua nova base.' }
    ],
    opcoes: [{ texto: 'Voltar à praça de Renânia', efeito: [{ tipo: 'recrutar', valor: 'maga' }, { tipo: 'flag', valor: 'v01Completa' }, { tipo: 'voltarCidade' }] }],
    codex: { id: 'lysia_revelada', titulo: 'Lysia Moss (a mulher de preto)', texto: 'A maga das Brancas confirma: a "mulher de preto" é LYSIA MOSS, Incantatrix Negra. Foi ela quem pagou o gigante para cavar até o selo dos anões. Ela quer o que está preso lá dentro. (Missão 2 — próxima fatia)' }
  },

  /* ================= RE-EXPLORAÇÃO (farm) ================= */

  refarm_no1_intro: {
    cenario: 'assets/img/cenario-entrada-mina.png',
    falas: [{ quem: 'Narrador', texto: 'A entrada das minas está mais quieta — mas o cheiro de enxofre nunca vai embora de verdade. Novos pares de brasas piscam na penumbra: a mina repõe seus horrores.' }],
    opcoes: [
      { texto: '⚔️ Caçar os ecos da matilha (farm de loot, XP reduzido)', efeito: [{ tipo: 'combate', valor: 'refarm_no1', farm: true }] },
      { texto: 'Voltar ao mapa', efeito: [{ tipo: 'sairCena' }] }
    ]
  },
  refarm_no2_intro: {
    cenario: 'assets/img/cenario-caverna.png',
    falas: [{ quem: 'Narrador', texto: 'O ninho do basilisco. As estátuas continuam lá — e algo menor desliza entre elas. Onde há um basilisco, cedo ou tarde há outro.' }],
    opcoes: [
      { texto: '⚔️ Enfrentar o basilisco jovem (farm, XP reduzido)', efeito: [{ tipo: 'combate', valor: 'refarm_no2', farm: true }] },
      { texto: 'Voltar ao mapa', efeito: [{ tipo: 'sairCena' }] }
    ]
  },
  refarm_no3_intro: {
    cenario: 'assets/img/cenario-forja.png',
    falas: [{ quem: 'Narrador', texto: 'A forja do gigante esfria aos poucos, mas os túneis fundos ainda cospem criaturas. A parede de ferro espera, indiferente, o dia em que alguém for tolo o bastante.' }],
    opcoes: [
      { texto: '⚔️ Limpar os restos da forja (farm, XP reduzido)', efeito: [{ tipo: 'combate', valor: 'refarm_no3', farm: true }] },
      { texto: 'Voltar ao mapa', efeito: [{ tipo: 'sairCena' }] }
    ]
  },

  /* ================= MISSÃO 2 — OS PESADELOS SELADOS ================= */

  m2_beco: {
    cenario: 'assets/img/cenario-beco.png',
    falas: [
      { quem: 'Narrador', texto: 'O beco atrás da taverna cheira a chuva velha. Encostado na parede, girando uma moeda entre os dedos, está um rapaz que não deve ter nem vinte anos — dezessete, talvez. Sorriso fácil. Olhos que já viram coisa demais pra idade.' },
      { quem: 'Yurin', texto: '"Relaxa, cavaleiro, se eu quisesse briga não teria assinado o bilhete. Yurin. O seu ladino aí me conhece — a gente tem... histórico comercial." (o ladino não confirma nem nega)' },
      { quem: 'Yurin', texto: '"Vim fazer uma caridade: a escavação lá embaixo RECOMEÇOU. Gente contratada, ouro bom, capatazes com símbolo novo no cinto. Estão cavando na direção da sua parede de ferro. E antes que pergunte: sim, eu ganho alguma coisa contando isso. Todo mundo ganha alguma coisa. Sempre."' },
      { quem: 'Narrador', texto: 'A maga aperta o grimório. "Ele não está mentindo. Senti a trama vibrar nas montanhas há três noites — algo enfraquecendo. Se estão mexendo na âncora dos anões..." Yurin abre um sorriso de menino. "Viu? Caridade." E some no escuro do beco como quem nunca esteve ali.' }
    ],
    opcoes: [
      { texto: '⚔️ Descer além do fundo da mina (INICIA A MISSÃO 2)', condicao: { semMissao: 'missao2' },
        efeito: [{ tipo: 'aceitarMissao', valor: 'missao2' }, { tipo: 'etapa', missao: 'missao2', valor: 'e1' }, { tipo: 'dialogo', valor: 'm2_aceita' }] },
      { texto: 'Voltar à praça', efeito: [{ tipo: 'voltarCidade' }] }
    ],
    codex: { id: 'yurin_aviso', titulo: 'Yurin, o mensageiro de dois lados', texto: 'Um bruxo jovem demais — uns 17 anos — que "ganha alguma coisa" com cada informação que passa. Avisou sobre a escavação rumo ao selo. A pergunta que ninguém fez: quem é o patrono de um bruxo tão novo — e o que ELE ganha com o aviso?' }
  },

  m2_aceita: {
    falas: [
      { quem: 'Narrador', texto: 'MISSÃO 2 INICIADA: Os Pesadelos Selados. Novos caminhos se abriram no mapa, além do Fundo da Mina — as galerias fundas. (Dica: descanse e reabasteça poções. Lá embaixo, a Vontade vale tanto quanto a espada.)' },
      { quem: 'Maga', texto: '"Vou reportar às Brancas pelo espelho... embora eu já saiba a resposta delas: observem, não intervenham. Elas sempre respondem isso. Nós vamos intervir, certo?" (é a primeira vez que vocês a veem sorrir de verdade)' }
    ],
    opcoes: [
      { texto: 'Partir para as galerias fundas', efeito: [{ tipo: 'irMapa' }] },
      { texto: 'Preparar-se na vila primeiro', efeito: [{ tipo: 'voltarCidade' }] }
    ]
  },

  bruno_runas: {
    falas: [
      { quem: 'Mestre Bruno', texto: '(vira o relicário anão nas mãos enormes, de repente delicadas) "Onde foi que... é claro. A forja do gigante." (aponta uma sequência de runas na tampa) "Meu avô me ensinou a ler isso. É a MESMA grafia da parede. Olha aqui: \'Khaz-dûhr\' — o selo. E isto: \'sete fechos, sete juramentos\'."' },
      { quem: 'Mestre Bruno', texto: '"O relicário não é uma caixinha, paladino. É uma CHAVE DE LEITURA. Os anões deixavam o manual do selo do lado de fora, protegido, pra quem precisasse MANTER — nunca abrir. Se alguém está cavando até lá..." (ele fecha a mão) "...leve isto junto. E volte."' }
    ],
    opcoes: [{ texto: 'Guardar o relicário com outro peso no bolso', efeito: [{ tipo: 'xp', valor: 300 }, { tipo: 'voltarCidade' }] }],
    codex: { id: 'chave_leitura', titulo: 'O relicário é uma chave de leitura', texto: 'Bruno traduziu as runas do relicário anão: "Khaz-dûhr, sete fechos, sete juramentos". É o manual de MANUTENÇÃO do selo, deixado do lado de fora pelos anões. Serve pra manter fechado — nunca pra abrir.' }
  },

  /* ---------- Nós da M2 ---------- */

  m2_cena_galeria: {
    cenario: 'assets/img/cenario-galeria.png',
    falas: [
      { quem: 'Narrador', texto: 'A galeria nova desce em ângulo perfeito, escorada com madeira cara. Duas dúzias de operários cavam SEM PARAR, olhos vidrados, mãos em carne viva. Nenhum deles pisca. Entre eles, capatazes de maça na mão — e um símbolo discreto no cinto: um corte vermelho num círculo negro.' },
      { quem: 'Maga', texto: '"Encantamento em massa. Estes homens não estão aqui por vontade própria." (ela olha pros capatazes) "Aqueles estão."' }
    ],
    opcoes: [
      { texto: '🗣️ Tentar quebrar o encanto gritando ordens de comando [DIPLOMACIA, CD 14]',
        efeito: [{ tipo: 'teste', pericia: 'Diplomacia', cd: 14, sucesso: 'm2_galeria_liberta', falha: 'm2_galeria_luta' }] },
      { texto: '⚔️ Direto nos capatazes — combate!', efeito: [{ tipo: 'combate', valor: 'm2_galeria' }] },
      { texto: 'Recuar ao mapa', efeito: [{ tipo: 'sairCena' }] }
    ]
  },

  m2_galeria_liberta: {
    cenario: 'assets/img/cenario-galeria.png',
    falas: [
      { quem: 'Narrador', texto: 'Sua voz de comando corta o transe como aço: metade dos operários pisca, larga as pás e CORRE. Os capatazes se viram para vocês — e agora estão em menor número e sem escudo humano.' }
    ],
    opcoes: [{ texto: '⚔️ Agora sim: combate!', efeito: [{ tipo: 'combate', valor: 'm2_galeria' }] }],
    xp: 250,
    codex: { id: 'operarios_encantados', titulo: 'Os operários encantados', texto: 'A escavação usa gente comum sob encantamento em massa — mãos em carne viva, olhos vidrados. Quem paga não queria testemunhas conscientes. Alguns foram libertados pela party.' }
  },

  m2_galeria_luta: {
    falas: [
      { quem: 'Narrador', texto: 'O encanto é mais fundo do que parecia — os operários nem registram sua voz. Um capataz assobia e o combate começa com eles em vantagem de terreno.' }
    ],
    opcoes: [{ texto: '⚔️ Combate!', efeito: [{ tipo: 'combate', valor: 'm2_galeria' }] }]
  },

  m2_galeria_vitoria: {
    cenario: 'assets/img/cenario-galeria.png',
    falas: [
      { quem: 'Narrador', texto: 'Com os capatazes caídos, o encanto afrouxa: os operários desabam onde estão, exaustos, e aos poucos acordam sem saber como chegaram ali. Um deles, um velho de barba rala, agarra seu braço: "Tinha uma MOÇA DE VERMELHO. Bonita que doía. Ela falou uma palavra e o mundo... sumiu."' },
      { quem: 'Narrador', texto: 'No bolso de um capataz: um adiantamento em ouro novo — cunhagem de Danos — e instruções numa caligrafia elegante: "cavem até o ferro. Não toquem no ferro."' }
    ],
    opcoes: [{ texto: 'Seguir para o Bolsão Anti-Planar', efeito: [{ tipo: 'sairCena' }] }],
    codex: { id: 'moca_de_vermelho', titulo: 'A moça de vermelho', texto: 'Os operários encantados lembram apenas de uma mulher DE VERMELHO, "bonita que doía", que falou uma palavra e apagou o mundo. O ouro dos capatazes tem cunhagem de Danos. As instruções: "cavem até o ferro. Não toquem no ferro."' }
  },

  m2_cena_bolsao: {
    cenario: 'assets/img/cenario-bolsao.png',
    falas: [
      { quem: 'Narrador', texto: 'O ar aqui DOBRA errado — como olhar através de água. No teto, runas anãs de ancoragem piscam fracas, falhando como velas no vento. E pelas falhas, coisas pequenas atravessam: garras, risinhos, olhos amarelos.' },
      { quem: 'Maga', texto: '"Âncora dimensional. Os anões não selaram só com ferro — selaram com LEI. E alguém está roendo a lei." (três vultos pequenos descem das runas, rindo) "Quasits. Se os pequenos já passam, os grandes estão na fila."' }
    ],
    opcoes: [
      { texto: '⚔️ Exterminar os quasits antes que abram caminho', efeito: [{ tipo: 'combate', valor: 'm2_bolsao' }] },
      { texto: 'Recuar ao mapa', efeito: [{ tipo: 'sairCena' }] }
    ]
  },

  m2_bolsao_vitoria: {
    cenario: 'assets/img/cenario-bolsao.png',
    falas: [
      { quem: 'Narrador', texto: 'O último quasit evapora em fumaça fedorenta. A maga passa uma hora reforçando as runas de ancoragem com giz arcano e teimosia — não é conserto, é curativo. "Vai segurar uns dias. Talvez."' },
      { quem: 'Maga', texto: '"Escutem. As runas registram o que atravessa. Dois sinais GRANDES passaram há semanas... e pararam. Do lado de cá. Algo está esperando entre nós e o selo."' }
    ],
    opcoes: [{ texto: 'Avançar para a Antessala do Selo', efeito: [{ tipo: 'sairCena' }] }],
    codex: { id: 'ancora_anao', titulo: 'A âncora dimensional dos anões', texto: 'O selo não é só ferro: é uma âncora anti-planar que impede travessias. Está falhando — quasits já vazam, e as runas registram DOIS sinais grandes que atravessaram há semanas e aguardam nas galerias.' },
    xp: 200
  },

  m2_cena_antessala: {
    cenario: 'assets/img/cenario-antessala.png',
    falas: [
      { quem: 'Narrador', texto: 'Colunas anãs sustentam um salão que nenhum minerador de Renânia jamais viu. O silêncio aqui tem textura. E então vocês percebem: dois vultos MAGROS COMO FOME, pele escorrendo lodo negro, parados diante da passagem — como sentinelas. Como convidados que chegaram cedo.' },
      { quem: 'Ladino', texto: '(sussurro) "Eles não estão surpresos de nos ver. Estavam ESPERANDO alguém abrir. Só não sabiam que seríamos nós de fora."' }
    ],
    opcoes: [
      { texto: '⚔️ Banir os Babau de volta ao Abismo', efeito: [{ tipo: 'combate', valor: 'm2_antessala' }] },
      { texto: 'Recuar ao mapa', efeito: [{ tipo: 'sairCena' }] }
    ]
  },

  m2_antessala_vitoria: {
    cenario: 'assets/img/cenario-antessala.png',
    falas: [
      { quem: 'Narrador', texto: 'O lodo dos Babau ferve e some. No chão onde o segundo escapou, restou uma marca queimada — não de fuga cega: um TRAJETO. Ele foi na direção do Paredão. Avisar.' },
      { quem: 'Paladino', texto: '(o Detectar o Mal formiga na nuca há minutos) "Tem algo maior à frente. Duas presenças mortais... e uma terceira que não consigo ler. Como um borrão vermelho na graça da Triuni."' }
    ],
    opcoes: [{ texto: 'Avançar para a Fissura de Pesadelo', efeito: [{ tipo: 'sairCena' }] }],
    codex: { id: 'babau_sentinelas', titulo: 'Demônios diante do selo', texto: 'Dois Babau aguardavam DIANTE do paredão — sentinelas de alguém do outro lado, ou convidados de quem quer abrir. Um escapou para avisar. O paladino sente três presenças à frente: duas mortais e um "borrão vermelho".' }
  },

  m2_cena_fissura: {
    cenario: 'assets/img/cenario-fissura.png',
    falas: [
      { quem: 'Narrador', texto: 'E ali está: uma rachadura FINA como um fio de cabelo na quina do ferro antigo — aberta não pela escavação, mas por dentro. Em volta dela, o ar treme com formas que não deviam ter forma: criaturas de carne pálida e olhos demais, tecidas de puro medo.' },
      { quem: 'Maga', texto: '"Fihyr. Nascem dos pesadelos — literalmente. Os mineradores da vila andam sonhando com isto AQUI, e a fissura dá corpo ao sonho." (ela ergue a voz, firme) "Mentes firmes! Eles se alimentam do medo que causam!"' }
    ],
    opcoes: [
      { texto: '⚔️ Dispersar os pesadelos', efeito: [{ tipo: 'combate', valor: 'm2_fissura' }] },
      { texto: 'Recuar ao mapa', efeito: [{ tipo: 'sairCena' }] }
    ]
  },

  m2_fissura_vitoria: {
    cenario: 'assets/img/cenario-fissura.png',
    falas: [
      { quem: 'Narrador', texto: 'Os fihyr se desmancham como névoa ao amanhecer. A fissura continua ali — fina, paciente. E agora vocês ouvem, vindo do Paredão logo adiante: um CANTO. Duas vozes. Uma reza em idioma mortuário... e o som ritmado de algo cortando pele.' },
      { quem: 'Narrador', texto: 'Chegou a hora. Do outro lado da última galeria, alguém está abrindo o que os anões morreram para fechar.' }
    ],
    opcoes: [{ texto: '⚠️ Marchar para O PAREDÃO', efeito: [{ tipo: 'sairCena' }] }],
    codex: { id: 'fihyr_fissura', titulo: 'A fissura que sonha', texto: 'A rachadura no ferro foi aberta POR DENTRO. Os pesadelos dos mineradores ganham corpo perto dela (fihyr). Do Paredão vem um canto ritual em idioma mortuário — e o som de cortes ritmados.' },
    xp: 250
  },

  m2_cena_paredao: {
    cenario: 'assets/img/cenario-paredao.png',
    falas: [
      { quem: 'Narrador', texto: 'O PAREDÃO enche a caverna de parede a parede — ferro puro, negro, coberto de runas que brilham fracas como brasas morrendo. Diante dele, um círculo ritual: velas de sebo negro, correntes de prata... e SANGUE fresco desenhando gramática arcana no chão.' },
      { quem: 'Narrador', texto: 'Uma sacerdotisa de vermelho-rubi mantém o canto — Ekaterina, do templo novo da vila. E das sombras da coluna, um drow de lâminas gêmeas se desdobra como tinta derramada: "Vocês não deviam ter chegado tão longe", diz Drahz, sem pressa. "Ela disse que viriam. Ela sempre acerta."' }
    ],
    opcoes: [
      { texto: '⚔️ INTERROMPER O RITUAL — combate!', efeito: [{ tipo: 'combate', valor: 'm2_paredao' }] },
      { texto: 'Recuar ao mapa (o canto continua...)', efeito: [{ tipo: 'sairCena' }] }
    ]
  },

  m2_lysia_cena: {
    cenario: 'assets/img/cenario-forja.png',
    falas: [
      { quem: 'Narrador', texto: 'Drahz cai de joelhos; Ekaterina desaba junto ao círculo desfeito. Por um segundo, silêncio. Então... palmas. Lentas. Vindas de lugar nenhum.' },
      { quem: 'Lysia Moss', texto: 'Ela ATRAVESSA a parede de sombra como quem entra em casa: vestes VERMELHAS até o chão, cicatrizes finas e precisas nos antebraços, um sorriso educado. "Impressionante. Sinceramente. Meus associados custaram caro." (ela olha para a maga) "Uma aspirante das Brancas. Que nostálgico. Eu também já usei branco."' },
      { quem: 'Lysia Moss', texto: 'Sem pressa, ela desliza uma adaga carmesim pela própria palma. O SANGUE não cai — sobe, tecendo símbolos no ar que doem de olhar. "Eu não vim abrir tudo, entendam. Ainda não. Só precisava de uma... amostra." O sangue-símbolo TOCA a fissura.' },
      { quem: 'Narrador', texto: 'O ferro GRITA. Da rachadura, algo se derrama pra fora — grande, pálido, com olhos demais, um pesadelo que sobreviveu ao próprio sonho. Lysia recua para a sombra com uma pequena reverência: "Divirtam-se. Eu levaria a sério os salvamentos de Vontade." E some.' }
    ],
    opcoes: [
      { texto: '⚔️ ENFRENTAR O QUE ESCAPOU', efeito: [{ tipo: 'etapa', missao: 'missao2', valor: 'e6' }, { tipo: 'combate', valor: 'm2_grande_fihyr' }] }
    ],
    codex: { id: 'lysia_vermelha', titulo: 'Lysia Moss, a maga de vermelho', texto: 'A "mulher de preto" dos rumores veste VERMELHO: Lysia Moss, maga do sangue — corta a própria pele e o sangue conjura por ela. Não quis abrir o selo inteiro: colheu uma "amostra" pela fissura e sumiu pelas sombras. Os operários a conheciam: "bonita que doía".' }
  },

  m2_epilogo: {
    cenario: 'assets/img/cenario-forja.png',
    falas: [
      { quem: 'Narrador', texto: 'O Grande Fihyr colapsa em névoa — e a névoa é SUGADA de volta pela fissura, como se o selo respirasse fundo. As runas anãs reacendem, uma a uma. Com o círculo ritual desfeito e a âncora remendada, o Paredão volta a ser o que sempre foi: uma promessa mantida.' },
      { quem: 'Maga', texto: '(pálida, olhando a fissura) "Nós vencemos a noite. Não a guerra. Ela levou uma AMOSTRA do que dorme aqui — e eu não quero descobrir para quê." (ela aperta a lasca de ferro rúnico) "Isto vai para as Brancas. Elas vão TER que responder mais do que \'observem\'."' },
      { quem: 'Narrador', texto: 'Na saída, sobre o corpo caído de Drahz... nada. Nem corpo. Só as marcas de arrasto de alguém que foi RECOLHIDO. E um bilhete espetado numa adaga carmesim cravada no chão, em caligrafia elegante: "Até a próxima, heróis de Renânia. — L."' }
    ],
    opcoes: [
      { texto: 'Voltar a Renânia', efeito: [{ tipo: 'etapa', missao: 'missao2', valor: 'e7' }, { tipo: 'flag', valor: 'missao2Relatorio' }, { tipo: 'sairCena' }] }
    ],
    codex: { id: 'selo_respirou', titulo: 'O selo resistiu (desta vez)', texto: 'Com o ritual desfeito e o Grande Fihyr destruído, a fissura sugou a névoa de volta e as runas reacenderam. Mas Lysia levou a amostra. Drahz e Ekaterina foram RECOLHIDOS — nem corpos ficaram. O bilhete na adaga: "Até a próxima. — L."' }
  },

  m2_relatorio: {
    cenario: 'assets/img/cidade-praca.png',
    falas: [
      { quem: 'Narrador', texto: 'Renânia amanhece sem saber que quase não amanhecia. Na taverna, Odo entrega um envelope lacrado com o selo da guilda: "Chegou de Úbia, de madrugada. Primeira vez que vejo o correio dos Caçadores correr."' },
      { quem: 'Carta de Jack Caolha', texto: '"Ninguém contratou. Ninguém pagou. E mesmo assim o serviço mais importante do semestre foi feito debaixo do meu nariz. A guilda não credita heroísmo — credita RESULTADO. Rank B, aspirante. Não me façam parecer sentimental. — J.C." (junto: 600 po "por despesas")' },
      { quem: 'Maga', texto: '(fechando o espelho de comunicação, com raiva contida) "As Brancas responderam. Querem a lasca, o relatório completo... e que \'não persigamos a Blood Magus\'. Elas SABEM o que ela é. Sabiam o tempo todo, e me deixaram aqui como termômetro." (pausa) "O conselho teme o nome da mestra dela mais do que teme o selo."' },
      { quem: 'Narrador', texto: 'Longe dali, numa fortaleza erguida sobre ossos de dragão, uma jóia toca. "Conseguiu, minha aprendiz?" — a voz da Mestra Viridiana é seda sobre pedra. "Sim, mestra. Uma amostra viável." Um silêncio satisfeito. "Então ELE vai ficar contente. O exército precisa dormir... e agora temos com o que fazê-lo sonhar." A MISSÃO 2 ESTÁ COMPLETA — a Missão 3 aguarda nas sombras.' }
    ],
    opcoes: [
      { texto: '🏅 Encerrar (recompensas e descanso merecido)', efeito: [
        { tipo: 'ouro', valor: 600 },
        { tipo: 'etapa', missao: 'missao2', valor: 'e8' },
        { tipo: 'concluirMissao', valor: 'missao2' },
        { tipo: 'flag', valor: 'rankB' },
        { tipo: 'flag', valor: 'v02Completa' },
        { tipo: 'xp', valor: 800 },
        { tipo: 'voltarCidade' }
      ] }
    ],
    codex: { id: 'rank_b', titulo: 'Rank B — e um conselho que teme um nome', texto: 'Jack Caolha creditou rank B sem contrato ("a guilda credita RESULTADO") + 600 po. As Brancas recolheram a lasca e proibiram perseguir a Blood Magus — o conselho teme o nome da MESTRA dela. E em Avenches, Viridiana recebeu a notícia: "o exército precisa dormir... e agora temos com o que fazê-lo sonhar."' }
  },

  /* ---------- Refarm M2 ---------- */
  refarm_m2_bolsao_intro: {
    cenario: 'assets/img/cenario-bolsao.png',
    falas: [{ quem: 'Narrador', texto: 'As runas remendadas seguram o grosso — mas frestas são frestas, e quasits são teimosos. De tempos em tempos, um risinho ecoa entre as colunas.' }],
    opcoes: [
      { texto: '⚔️ Caçar os que vazaram (farm, XP reduzido)', efeito: [{ tipo: 'combate', valor: 'refarm_m2_bolsao', farm: true }] },
      { texto: 'Voltar ao mapa', efeito: [{ tipo: 'sairCena' }] }
    ]
  },
  refarm_m2_fissura_intro: {
    cenario: 'assets/img/cenario-fissura.png',
    falas: [{ quem: 'Narrador', texto: 'Enquanto a vila sonhar, a fissura fabrica horrores — menores agora, mas famintos. Alguém precisa aparar os pesadelos. De preferência, com lucro.' }],
    opcoes: [
      { texto: '⚔️ Dispersar os ecos (farm, XP reduzido)', efeito: [{ tipo: 'combate', valor: 'refarm_m2_fissura', farm: true }] },
      { texto: 'Voltar ao mapa', efeito: [{ tipo: 'sairCena' }] }
    ]
  },

  /* ================= ANEXO DOS CAÇADORES (classes de prestígio) ================= */

  anexo_treinamento: {
    cenario: 'assets/img/cidade-praca.png',
    falas: [
      { quem: 'Narrador', texto: 'A sala nos fundos da taverna virou outra coisa: alvos de arremesso, um manequim de treino já sem cabeça e mapas de Úbia pregados na parede. Encostada na mesa, uma mulher de couraça surrada avalia vocês como quem pesa gado.' },
      { quem: 'Dora Terra-brava', texto: '"Dora Terra-brava. Top 2 do ranking geral — o Top 1 é a Yara, e ninguém alcança a Yara. Jack me pediu pra parar aqui no caminho e dar uma olhada nos aspirantes que andam fazendo barulho em Renânia." (ela morde uma maçã) "Vocês são menores do que eu esperava."' },
      { quem: 'Dora Terra-brava', texto: '"Regra da guilda: quem tem contrato CREDITADO tem direito a TREINAMENTO DE TRILHA. Especialização. O que separa um caçador de carreira de um cadáver com distintivo. Serve pra quem já aguenta o tranco — nível 4 de estrada, no mínimo. Cada um escolhe UMA trilha, e não tem troca depois, então pensem." (ela aponta a maçã pro paladino) "E antes que pergunte: sim, a Ordem de vocês já mandou os sigilos. Todo mundo quer um pedaço de vocês agora."' }
    ],
    opcoes: [
      { texto: '🎖️ Ver as trilhas de prestígio (escolha permanente)', efeito: [{ tipo: 'abrirPrestigio' }] },
      { texto: 'Voltar à praça', efeito: [{ tipo: 'voltarCidade' }] }
    ],
    codex: { id: 'dora_terrabrava', titulo: 'Dora Terra-brava (Top 2)', texto: 'A segunda melhor caçadora do ranking geral, de passagem por Renânia a mando de Jack Caolha para treinar os aspirantes locais. Regra da guilda: contrato creditado + nível 4 dá direito a UMA trilha de especialização (classe de prestígio) — permanente.' }
  },

  /* ================= MISSÃO 3 — A VILA QUE DORME ================= */

  m3_aceita: {
    cenario: 'assets/img/cidade-praca.png',
    falas: [
      { quem: 'Narrador', texto: 'Não é um pergaminho de quadro. É uma CARTA, entregue por Odo com as duas mãos, lacre da guilda ainda quente. Contrato direto — privilégio (e coleira) de quem chegou ao rank B.' },
      { quem: 'Carta de Jack Caolha', texto: '"Vau da Prata, estrada do sul, dorme há NOVE DIAS. Caravanas voltam com os condutores roncando na boleia. O Barão abafou pra não derrubar o comércio; eu não abafo nada. Descubram, resolvam, cobrem. 1.200 po. E aspirantes... o meu faro diz que isso cheira ao MESMO perfume do serviço de vocês no selo. — J.C."' },
      { quem: 'Maga', texto: '(pálida) "Nove dias. Uma aldeia inteira sonhando... e a amostra que a Blood Magus levou era exatamente ISTO: matéria de pesadelo viva." (ela fecha o grimório com força) "Não é uma praga. É um TESTE DE CAMPO. E nós vamos interromper o experimento."' }
    ],
    efeitoEntrada: [{ tipo: 'etapa', missao: 'missao3', valor: 'e1' }],
    opcoes: [
      { texto: 'Partir pela Estrada do Sul', efeito: [{ tipo: 'irMapa' }] },
      { texto: 'Preparar-se na vila primeiro', efeito: [{ tipo: 'voltarCidade' }] }
    ],
    codex: { id: 'vau_da_prata', titulo: 'Vau da Prata dorme', texto: 'Contrato direto de Jack Caolha (1.200 po): a aldeia de Vau da Prata dorme há nove dias. A maga suspeita do óbvio: é um teste de campo da amostra que Lysia colheu no selo. "O exército precisa dormir."' }
  },

  m3_cena_estrada: {
    cenario: 'assets/img/cenario-aldeia.png',
    falas: [
      { quem: 'Narrador', texto: 'A caravana está parada no meio da estrada como um brinquedo largado: seis carroças, bois pastando soltos, mercadorias intactas. Nas boleias, os condutores DORMEM — sorrindo. Um deles abraça o chicote como quem abraça um filho.' },
      { quem: 'Narrador', texto: 'Nenhum sinal de luta. Nenhum roubo. Só um cheiro adocicado no ar, como flor pisada, e uma fileira de moscas dormindo — MOSCAS, dormindo — na canga do primeiro boi.' }
    ],
    opcoes: [
      { texto: '🩺 Examinar os adormecidos [CURAR, CD 14]',
        efeito: [{ tipo: 'teste', pericia: 'Curar', cd: 14, sucesso: 'm3_estrada_sucesso', falha: 'm3_estrada_falha' }] },
      { texto: '👁️ Procurar rastros em volta da caravana [PROCURAR, CD 14]',
        efeito: [{ tipo: 'teste', pericia: 'Procurar', cd: 14, sucesso: 'm3_estrada_sucesso', falha: 'm3_estrada_falha' }] },
      { texto: 'Seguir direto para Vau da Prata', efeito: [{ tipo: 'etapa', missao: 'missao3', valor: 'e2' }, { tipo: 'fecharCena' }] }
    ]
  },

  m3_estrada_sucesso: {
    cenario: 'assets/img/cenario-aldeia.png',
    falas: [
      { quem: 'Narrador', texto: 'Não é doença nem veneno comum: as pupilas dançam sob as pálpebras num ritmo IDÊNTICO em todos os condutores — seis homens sonhando O MESMO SONHO, no mesmo compasso. E nos pulsos de cada um, uma marca fina de fuligem: alguém já esteve aqui, conferindo o rebanho.' },
      { quem: 'Narrador', texto: 'Nos rastros: pegadas de sandálias em fila (acólitos, seis ou sete) e — mais fundo que todas — DOIS sulcos de casco queimados na terra, como ferro de marcar. O que fez isto pesa como um cavalo de guerra e caminha soltando brasa.' }
    ],
    xp: 350,
    opcoes: [{ texto: 'Para Vau da Prata — depressa', efeito: [{ tipo: 'etapa', missao: 'missao3', valor: 'e2' }, { tipo: 'fecharCena' }] }],
    codex: { id: 'sono_sincronizado', titulo: 'O sono sincronizado', texto: 'Os adormecidos da caravana sonham O MESMO sonho, no mesmo compasso — e têm marcas de inspeção nos pulsos. Rastros: acólitos em fila e cascos que QUEIMAM a terra. Alguém pastoreia o sono alheio.' }
  },

  m3_estrada_falha: {
    cenario: 'assets/img/cenario-aldeia.png',
    falas: [
      { quem: 'Narrador', texto: 'O cheiro adocicado engrossa enquanto vocês examinam — e a maga puxa a party pra trás no último segundo: "SAIAM da nuvem! É o pólen do sonho, ele está ATIVO!" A cabeça roda; os joelhos amolecem. Vocês recuam a tempo, mas a estrada cobrou o pedágio.' }
    ],
    opcoes: [{ texto: 'Respirar fundo e seguir para Vau da Prata', efeito: [{ tipo: 'dano', valor: 8 }, { tipo: 'etapa', missao: 'missao3', valor: 'e2' }, { tipo: 'fecharCena' }] }]
  },

  m3_cena_vau: {
    cenario: 'assets/img/cenario-vau.png',
    falas: [
      { quem: 'Narrador', texto: 'Vau da Prata dorme onde caiu. O ferreiro roncando sobre a bigorna fria. Duas crianças enroladas com o cachorro no meio da rua. Uma mesa de jantar posta há nove dias, com nove dias de moscas — as moscas também dormem. O silêncio é tão completo que dá pra ouvir a aldeia inteira RESPIRANDO NO MESMO RITMO.' },
      { quem: 'Narrador', texto: 'E entre os adormecidos, figuras de roupão cinza trabalham com eficiência de formiga: erguem os que dormem, penduram etiquetas de madeira nos pescoços, carregam os "etiquetados" para uma carroça coberta. Um deles nota vocês — e SORRI, erguendo a palma aberta: "Irmãos! Vieram receber a bênção do descanso?"' },
      { quem: 'Maga', texto: '(sussurro urgente) "As etiquetas têm runas de PREÇO. Eles não estão salvando ninguém — estão fazendo TRIAGEM. Separando os sonhadores fortes para alguém que paga."' }
    ],
    opcoes: [
      { texto: '⚔️ Derrubar os "Irmãos da Vigília" — ninguém leva ninguém', efeito: [{ tipo: 'combate', valor: 'm3_vau' }] },
      { texto: 'Recuar ao mapa', efeito: [{ tipo: 'sairCena' }] }
    ]
  },

  m3_vau_vitoria: {
    cenario: 'assets/img/cenario-vau.png',
    falas: [
      { quem: 'Narrador', texto: 'O último Irmão desaba — e os aldeões SEGUEM DORMINDO, sereno e fundo, o que de certa forma é pior. Na carroça coberta: doze adormecidos etiquetados. As etiquetas, traduzidas pela maga: "FORTE. FÉRTIL. SONHA ALTO." E um destino: "Capela — para a Vigília pagar."' },
      { quem: 'Narrador', texto: 'No bolso do Irmão mais graduado, um caderninho de contabilidade. Última linha: "Entregues à Capela: 41. A Senhora do Véu paga em prata o sonhador comum... e em OURO o que sonha com o selo."' }
    ],
    opcoes: [{ texto: 'Para a Capela das Lamúrias', efeito: [{ tipo: 'sairCena' }] }],
    codex: { id: 'triagem_sono', titulo: 'A triagem dos sonhadores', texto: 'Os Irmãos da Vigília etiquetam os adormecidos ("forte, fértil, sonha alto") e vendem os melhores à Capela das Lamúrias. A compradora final: "a Senhora do Véu" — que paga OURO por quem sonha com o selo. 41 já foram entregues.' }
  },

  m3_cena_capela: {
    cenario: 'assets/img/cenario-capela.png',
    falas: [
      { quem: 'Narrador', texto: 'A capela rural do Templo das Lamúrias finge luto: velas baratas, flores murchas, um altar de pedra cinzenta. Mas atrás da cortina do coro, o "depósito": adormecidos empilhados em prateleiras COM ETIQUETAS, como garrafas numa adega. Sacerdotes de roupão vermelho-ferrugem conferem o estoque.' },
      { quem: 'Paladino', texto: '(o Detectar o Mal queima como brasa engolida) "Nerull. Este lugar inteiro é uma mentira consagrada a Nerull — o Ceifador. E aquele roupão vermelho-ferrugem eu conheço dos arquivos da Ordem: ADAGAS NEGRAS. Assassinos de aluguel com batina."' },
      { quem: 'Sacerdote Ceifeiro', texto: '(sem se virar) "Um paladino da Triuni na minha capela. Que dia abençoado." (a foice desce da parede sozinha, até a mão dele) "A Senhora do Véu paga bem pelos que sonham... mas por vocês, acordados e barulhentos, ela não paga NADA. O que faz de vocês... despesa."' }
    ],
    opcoes: [
      { texto: '⚔️ COMBATE — a Triuni contra o Ceifador', efeito: [{ tipo: 'combate', valor: 'm3_capela' }] },
      { texto: 'Recuar ao mapa', efeito: [{ tipo: 'sairCena' }] }
    ]
  },

  m3_capela_vitoria: {
    cenario: 'assets/img/cenario-capela.png',
    falas: [
      { quem: 'Narrador', texto: 'O Ceifeiro cai atravessado no próprio altar — a foice ainda procurando a mão dele, teimosa. No livro-caixa da capela, a contabilidade do horror: 41 sonhadores comprados dos Irmãos, 38 revendidos "à Gruta, pelo Véu". E uma observação em letra miúda: "a Senhora entrega os sonhos COLHIDOS à maga de vermelho. A de vermelho entrega a uma máscara de osso. NÃO PERGUNTAR sobre a máscara."' },
      { quem: 'Maga', texto: '"Máscara de osso salpicada de sangue... é ELA. Mestra Viridiana Quispe, do conselho das Cinco." (a voz treme entre medo e fúria) "A cadeia inteira: os Irmãos colhem, as Lamúrias revendem, a Anciã EXTRAI os sonhos... e o extrato viaja para Avenches. Estamos dentro do experimento dela, olhando pra linha de produção."' }
    ],
    xp: 400,
    opcoes: [{ texto: 'Para o Limiar do Sonho', efeito: [{ tipo: 'sairCena' }] }],
    codex: { id: 'cadeia_producao', titulo: 'A linha de produção dos sonhos', texto: 'A cadeia completa: Irmãos da Vigília colhem → Capela das Lamúrias (Nerull/Adagas Negras) revende → "Senhora do Véu" extrai os sonhos na Gruta → o extrato vai para Lysia → e de Lysia para a MÁSCARA DE OSSO: Mestra Viridiana Quispe. Vau da Prata é a linha de montagem do exército que sonha.' }
  },

  m3_cena_limiar: {
    cenario: 'assets/img/cenario-limiar.png',
    falas: [
      { quem: 'Narrador', texto: 'A névoa começa exatamente numa linha, como uma parede sem parede. Do outro lado, as cores estão ERRADAS — mais bonitas, mais fundas, cores de dentro da pálpebra. É aqui que os sonhos de quarenta e um aldeões se encontram. A maga estica a mão: "Se entrarmos, entramos no SONHO COLETIVO. Mentes firmes ou não saímos."' },
      { quem: 'Narrador', texto: 'Vocês atravessam. Do outro lado: Vau da Prata — mas dourada, farta, sem carvão nas unhas de ninguém. A aldeia SONHA a própria vida melhorada. E no meio da praça de sonho, esperando de braços cruzados, com um sorriso que não devia estar num sonho alheio... YURIN.' },
      { quem: 'Yurin', texto: '"Relaxa. Eu SEMPRE consigo entrar onde não devia — regalias de quem tem o patrono certo. Escutem rápido, porque a Anciã sente visitas: o covil dela é a GRUTA a nordeste do pasto queimado. O foco do encanto é a PEDRA DO CORAÇÃO dela — quebrem a pedra e a aldeia inteira acorda. Simples assim."' },
      { quem: 'Yurin', texto: '"Por que estou ajudando? Digamos que... o MEU patrono não gosta de concorrência." (o sorriso fecha um milímetro) "A senhora da máscara de osso quer um exército sonhando. Suzas ACHA GRAÇA de exércitos alheios. Então hoje, e SÓ hoje, os interesses dele e os seus dormem na mesma cama." (ele joga algo — um anel de ferro negro) "Bônus por conta da casa. Não pergunte de onde veio. Você não vai gostar da resposta."' }
    ],
    opcoes: [
      { texto: '💪 Firmar a mente e arrancar a party do sonho [SABEDORIA, CD 14]',
        efeito: [{ tipo: 'teste', atributo: 'SAB', cd: 14, sucesso: 'm3_limiar_sucesso', falha: 'm3_limiar_falha' }] }
    ],
    codex: { id: 'yurin_no_sonho', titulo: 'Yurin caminha em sonhos', texto: 'Yurin apareceu DENTRO do sonho coletivo — regalia do pacto com Suzas. Entregou o covil da Anciã (a Gruta), o ponto fraco (a pedra do coração) e um anel "por conta da casa". Motivo declarado: Suzas não tolera o exército sonhador de Viridiana. Inimigo do meu inimigo... por exatamente uma noite.' }
  },

  m3_limiar_sucesso: {
    cenario: 'assets/img/cenario-limiar.png',
    falas: [
      { quem: 'Narrador', texto: 'A party acorda de pé, do lado de fora da névoa, com o gosto de mel do sonho ainda na língua — e o anel de ferro negro FRIO e real na palma da maga. No chão, onde a névoa lambe a terra, um pergaminho que não existia: granizo desenhado em tinta azul. O sonho, às vezes, paga pedágio de volta.' }
    ],
    efeitoEntrada: [{ tipo: 'itemUnico', valor: 'u_sinete_pacto' }, { tipo: 'item', valor: 'perg_tempestade_de_gelo' }],
    xp: 500,
    opcoes: [
      { texto: 'Guardar tudo e marchar ao Pasto de Cinzas',
        efeito: [{ tipo: 'etapa', missao: 'missao3', valor: 'e5' }, { tipo: 'fecharCena' }] }
    ]
  },

  m3_limiar_falha: {
    cenario: 'assets/img/cenario-limiar.png',
    falas: [
      { quem: 'Narrador', texto: 'O sonho GRUDA. Por um tempo impossível de medir, vocês vivem a Vau da Prata dourada — colheitas, festas, nenhum monstro, nenhum contrato. É a maga quem quebra o encanto, cravando as unhas na própria cicatriz: "ISTO. NÃO. É. NOSSO." Vocês acordam de joelhos na terra fria, exaustos como quem trabalhou a noite inteira... mas com o anel e o aviso de Yurin intactos.' }
    ],
    efeitoEntrada: [{ tipo: 'itemUnico', valor: 'u_sinete_pacto' }],
    xp: 250,
    opcoes: [
      { texto: 'Levantar e marchar ao Pasto de Cinzas (o sonho cobrou caro)',
        efeito: [{ tipo: 'dano', valor: 10 }, { tipo: 'etapa', missao: 'missao3', valor: 'e5' }, { tipo: 'fecharCena' }] }
    ]
  },

  m3_cena_pasto: {
    cenario: 'assets/img/cenario-pasto.png',
    falas: [
      { quem: 'Narrador', texto: 'O pasto é um círculo perfeito de cinza, e no centro dele ELE pasta: um corcel negro do tamanho de um touro, crina de fogo baixo, cascos afundando marcas queimadas na terra. Não come grama. Come o RESTO dos sonhos que a Anciã descarta — e engorda.' },
      { quem: 'Narrador', texto: 'O Pesadelo ergue a cabeça. Os olhos são duas brasas pacientes. Ele não relincha — ele RI, do jeito que cavalos não deviam saber rir, e bate o casco três vezes. Do capim cinzento, larvas se desenterram como dedos.' }
    ],
    opcoes: [
      { texto: '⚔️ Abater o corcel do Véu (dica: ele odeia FRIO)', efeito: [{ tipo: 'combate', valor: 'm3_pasto' }] },
      { texto: 'Recuar ao mapa', efeito: [{ tipo: 'sairCena' }] }
    ]
  },

  m3_pasto_vitoria: {
    cenario: 'assets/img/cenario-pasto.png',
    falas: [
      { quem: 'Narrador', texto: 'O Pesadelo desaba em brasas que a grama cinzenta bebe. Sem a montaria, a Anciã não cavalga mais os sonhos de ninguém esta noite — está PRESA na gruta, com o estoque dela. A trilha de cascos queimados aponta direto para a boca de pedra a nordeste. Ela sabe que vocês vêm. Os pesadelos sempre sabem.' }
    ],
    opcoes: [{ texto: '⚠️ Para a Gruta do Véu — acabar com isto', efeito: [{ tipo: 'sairCena' }] }],
    codex: { id: 'pesadelo_abatido', titulo: 'O corcel abatido', texto: 'O Pesadelo (corcel abissal das anciãs noturnas, MM 3.5) foi destruído. Sem montaria, Madame Vevra não cavalga sonhos — está encurralada na Gruta do Véu com os 38 sonhadores do "estoque".' }
  },

  m3_cena_covil: {
    cenario: 'assets/img/cenario-gruta.png',
    falas: [
      { quem: 'Narrador', texto: 'A gruta respira. Dentro, pendurados em casulos de teia cinzenta, os 38 adormecidos de Vau da Prata — e de cada testa sai um FIO de prata luminosa, fino como cabelo, todos correndo para o centro da câmara, onde uma pedra negra do tamanho de um punho PULSA como um coração fora do peito.' },
      { quem: 'Madame Vevra', texto: 'Ela se desdobra da sombra — bela de um jeito que dói atrás dos olhos, exatamente como os operários descreveram a outra. "Visitas. E EU sem chá." (os fios de prata cantam quando ela passa) "Vocês mataram meu cavalo. Sabem quanto custa um Pesadelo adulto? A senhora da máscara vai descontar do MEU pagamento."' },
      { quem: 'Narrador', texto: 'Do fundo da câmara, uma segunda silhueta avança — e a maga solta um som pequeno, ferido. Vestes rubras. Cetro rachado. O rosto de EKATERINA, a sacerdotisa que caiu no Paredão. Os olhos dela encontram a party: vazios, educados, terrivelmente despertos. "A Vigília Rubra saúda os heróis de Renânia", diz a boca dela, com a voz dela, sem NADA dela dentro.' }
    ],
    opcoes: [
      { texto: '⚔️ QUEBRAR A PEDRA DO CORAÇÃO — combate final!', efeito: [{ tipo: 'combate', valor: 'm3_covil' }] },
      { texto: 'Recuar (os fios de prata cantam às suas costas...)', efeito: [{ tipo: 'sairCena' }] }
    ],
    codex: { id: 'ekaterina_rediviva', titulo: 'Ekaterina voltou — errada', texto: 'A sacerdotisa que caiu no Paredão está de pé na Gruta do Véu: "a Vigília Rubra". Wee Jas é deusa da Morte E da Magia, e Lysia é devota aplicada. O que voltou tem o rosto, a fé e a voz de Ekaterina — e nenhum dos medos.' }
  },

  m3_lab_cena: {
    cenario: 'assets/img/cenario-forja.png',
    falas: [
      { quem: 'Narrador', texto: 'A pedra do coração RACHA no golpe final — e a gruta inteira EXPIRA. Os fios de prata se soltam das testas como suspiros; os casulos amolecem; e trinta e oito pessoas acordam ao mesmo tempo, chorando, rindo, chamando nomes. Ao longe, embaixo, Vau da Prata ACORDA JUNTO: sinos, cachorros, uma aldeia inteira voltando a existir de uma vez. Vevra evapora em névoa cinza, uivando. O corpo da Vigília Rubra simplesmente... desliga, e cai. Desta vez, fica onde caiu.' },
      { quem: 'Narrador', texto: 'Entre os cacos da pedra, um fio de OUTRA coisa: resíduo rubro, denso, familiar. A maga o recolhe num frasco com mãos de cirurgiã. "Resíduo da amostra do selo. Ela DILUIU a amostra pra abastecer a pedra... o que significa que a amostra-mãe ainda existe. E rende." O rastro do resíduo leva a um endereço em Renânia: um porão alugado atrás do templo novo da Feiticeira Rubi.' },
      { quem: 'Narrador', texto: 'O porão: um LABORATÓRIO, abandonado às pressas e limpo com método. Bancadas vazias, círculos de giz raspados, um tanque de vidro do tamanho de uma PESSOA — vazio, escorrendo. E sobre a única mesa, à luz de uma vela deixada ACESA, um bilhete em caligrafia elegante:' },
      { quem: 'Bilhete de Lysia', texto: '"Heróis — Vevra era cara e Ekaterina era MINHA, então vamos chamar isto de empate técnico. O ensaio de Vau da Prata rendeu os dados de que a mestra precisava; a amostra-mãe já viaja para onde vocês não alcançam. Sem rancor: vocês são a variável mais interessante do experimento. Cuidem do sono de vocês. — L. // P.S.: digam ao menino do diabo que eu SEI que foi ele. Suzas devia escolher melhor os brinquedos."' }
    ],
    opcoes: [
      { texto: 'Recolher as provas e voltar a Renânia',
        efeito: [{ tipo: 'etapa', missao: 'missao3', valor: 'e8' }, { tipo: 'flag', valor: 'missao3Relatorio' }, { tipo: 'xp', valor: 500 }, { tipo: 'sairCena' }] }
    ],
    codex: { id: 'lab_lysia', titulo: 'O laboratório vazio', texto: 'O porão-laboratório de Lysia atrás do templo da Rubi: tanque de CLONE vazio, bancadas limpas, bilhete deixado com vela acesa. O ensaio de Vau da Prata "rendeu os dados"; a amostra-mãe viaja para Avenches. E Lysia sabe que Yurin traiu — "Suzas devia escolher melhor os brinquedos."' }
  },

  m3_relatorio: {
    cenario: 'assets/img/cidade-praca.png',
    falas: [
      { quem: 'Narrador', texto: 'Desta vez o correio da guilda chega em dobro: o envelope de Jack... e um tubo selado de MARFIM, com o sinete das Encantatrizes Brancas, endereçado à maga. Odo entrega os dois e sai de perto, por via das dúvidas.' },
      { quem: 'Carta de Jack Caolha', texto: '"Uma aldeia inteira acordada, uma anciã noturna expulsa, as Adagas Negras com um posto a menos e um LABORATÓRIO de blood magus documentado. Aspirantes, vou ser sincero: parem de me impressionar, fica caro. 1.200 po. Segunda missão B creditada — MAIS UMA e vocês são MEMBROS INTERNOS, com direito a contrato de rank A. A guilda observa. Eu também. — J.C."' },
      { quem: 'Tubo das Brancas', texto: 'Dentro, uma única folha, sem assinatura, no lacre do conselho dos 8: "O resíduo recolhido confirma o pior cenário. A proibição de perseguir a Blood Magus está SUSPENSA. A aspirante e seus companheiros devem apresentar-se em ÚBIA quando o próximo contrato os levar ao leste. Não escrevam sobre isto. Não falem sobre isto. Queimem esta folha." A folha, obediente, pega fogo sozinha.' },
      { quem: 'Narrador', texto: 'E longe, em Avenches, numa cidadela erguida sobre ossos de dragão, uma máscara de osso salpicada de sangue examina frascos rubros alinhados como soldados. "O ensaio rendeu, minha aprendiz. Iniciem a fase dois." Atrás da máscara, algo imenso e sem carne assiste das sombras entre os mundos — e ri baixinho, do jeito que os diabos riem de quem pensa que o jogo tem só dois lados. A MISSÃO 3 ESTÁ COMPLETA.' }
    ],
    opcoes: [
      { texto: '🏅 Encerrar (recompensas e um descanso MERECIDO)', efeito: [
        { tipo: 'ouro', valor: 1200 },
        { tipo: 'etapa', missao: 'missao3', valor: 'e9' },
        { tipo: 'concluirMissao', valor: 'missao3' },
        { tipo: 'flag', valor: 'v03Completa' },
        { tipo: 'xp', valor: 1200 },
        { tipo: 'voltarCidade' }
      ] }
    ],
    codex: { id: 'rumo_ubia', titulo: 'Rumo a Úbia (Missão 4)', texto: 'Jack: 2ª missão B creditada — mais uma e a party vira MEMBRO INTERNO (contratos rank A). As Brancas SUSPENDERAM a proibição de perseguir Lysia e convocaram a party a Úbia. Em Avenches, Viridiana inicia "a fase dois". E Suzas ri de todos os lados do tabuleiro.' }
  },

  /* ---------- Refarm M3 ---------- */
  refarm_m3_vau_intro: {
    cenario: 'assets/img/cenario-vau.png',
    falas: [{ quem: 'Narrador', texto: 'Vau da Prata acordou — mas nove dias de sonho coletivo deixam resíduo. Nas noites sem lua, larvas se desenterram dos quintais como má lembrança. A aldeia paga bem por quem as apara.' }],
    opcoes: [
      { texto: '⚔️ Aparar as larvas (farm, XP reduzido)', efeito: [{ tipo: 'combate', valor: 'refarm_m3_vau', farm: true }] },
      { texto: 'Voltar ao mapa', efeito: [{ tipo: 'sairCena' }] }
    ]
  },
  refarm_m3_pasto_intro: {
    cenario: 'assets/img/cenario-pasto.png',
    falas: [{ quem: 'Narrador', texto: 'A grama do pasto continua cinza, e nas cinzas os sonhos ruins ainda criam corpo de vez em quando. Menores que antes. Mais famintos também.' }],
    opcoes: [
      { texto: '⚔️ Dispersar o que sonha nas cinzas (farm, XP reduzido)', efeito: [{ tipo: 'combate', valor: 'refarm_m3_pasto', farm: true }] },
      { texto: 'Voltar ao mapa', efeito: [{ tipo: 'sairCena' }] }
    ]
  },

  /* ================= MISSÃO 4 — A CIDADE DOS HERÓIS (ÚBIA) ================= */

  m4_convocacao: {
    cenario: 'assets/img/cidade-praca.png',
    falas: [
      { quem: 'Narrador', texto: 'O tubo de marfim espera sobre a mesa do casebre — o segundo em um mês. Este não pega fogo sozinho: dentro há um SALVO-CONDUTO com o lacre do conselho dos 8 e uma única linha: "Apresentem-se na Torre de Marfim de Úbia. A aspirante sabe por quê."' },
      { quem: 'Narrador', texto: 'Por baixo do tubo, dobrado em quatro, um bilhete em letra de quem escreve com pressa e um olho só: "Sede. AGORA. Os dois assuntos são o mesmo assunto. E aspirantes... venham armados. — J.C."' },
      { quem: 'Maga', texto: '"As Brancas e o Jack pedindo a mesma viagem no mesmo dia." (ela fecha o grimório devagar) "Da última vez que todo mundo quis a gente no mesmo lugar, o lugar era uma armadilha. Vamos assim mesmo, certo?" (não é bem uma pergunta)' }
    ],
    opcoes: [
      { texto: '🐎 Tomar a diligência para ÚBIA (três dias de estrada)', efeito: [{ tipo: 'flag', valor: 'ubiaAberta' }, { tipo: 'regiao', valor: 'ubia' }] },
      { texto: 'Resolver pendências em Renânia primeiro', efeito: [{ tipo: 'voltarCidade' }] }
    ],
    codex: { id: 'convocacao_ubia', titulo: 'Convocação a Úbia', texto: 'As Brancas convocaram a party à Torre de Marfim de Úbia; Jack Caolha mandou um bilhete pedindo a MESMA viagem: "os dois assuntos são o mesmo assunto". A diligência para o leste parte da praça de Renânia.' }
  },

  m4_sede: {
    cenario: 'assets/img/cidade-ubia.png',
    falas: [
      { quem: 'Narrador', texto: 'A Sede dos Caçadores é um salão de pé-direito duplo forrado de placas de bronze — um nome de caçador em cada uma, os mortos com a data, os vivos com o RANKING. No topo da coluna central: "1. YARA". Alguém pendurou um pano preto sobre a placa. Ninguém teve coragem de tirá-la.' },
      { quem: 'Jack Caolha', texto: 'Ele é menor do que as histórias — e o olho que sobrou compensa os dois. "Sentem. Vou economizar o teatro: a YARA sumiu há seis dias. A Dora foi atrás. A DORA sumiu há dois. E metade da minha ala leste está dormindo em pé, sorrindo, depois de tomar um TÔNICO que ninguém sabe quem distribui." (ele empurra um frasco âmbar sobre a mesa) "Cheirem. Sem beber."' },
      { quem: 'Maga', texto: '(ela nem precisa abrir o frasco; o corvo Cinza eriça as penas) "Extrato do selo, diluído. O mesmo perfume de Vau da Prata." (pausa) "Jack... isto não é um contrato. É a FASE DOIS. Eles não estão adormecendo uma aldeia desta vez. Estão adormecendo os HERÓIS."' },
      { quem: 'Jack Caolha', texto: '"Por isso o contrato está no MURAL, com o meu lacre pessoal. Terceira missão B de vocês — cumpram e são MEMBROS INTERNOS, com tudo que isso abre e tudo que isso custa." (ele se levanta) "Tragam a minha Top 1 de volta, aspirantes. Acordada."' }
    ],
    opcoes: [
      { texto: '📜 Examinar o contrato no Mural da Sede', efeito: [{ tipo: 'dialogo', valor: 'm4_mural' }] },
      { texto: '🎖️ Treinar trilhas de prestígio na Sede', efeito: [{ tipo: 'abrirPrestigio' }] },
      { texto: 'Voltar à praça alta', efeito: [{ tipo: 'voltarCidade' }] }
    ],
    codex: { id: 'jack_caolha', titulo: 'Jack Caolha (em pessoa)', texto: 'O chefe dos Caçadores: baixo, um olho, zero paciência. Yara (Top 1) sumiu há seis dias; Dora (Top 2) foi atrás e também sumiu. Um "tônico" com extrato do selo circula pela guilda. A 3ª missão B da party está no mural — com o lacre pessoal dele.' }
  },

  m4_mural: {
    cenario: 'assets/img/cidade-ubia.png',
    falas: [
      { quem: 'Narrador', texto: 'O Mural da Sede é a mãe de todos os quadros de contratos do continente — três andares de pergaminho, prêmio e promessa. No centro, isolado por um cordão, um único contrato com o lacre de cera negra de Jack Caolha:' },
      { quem: 'Contrato', texto: '"CONTRATO RANQUEADO — RANK B (interno). Recompensa: 2.000 po + INVESTIDURA DE MEMBRO INTERNO. Objeto: a linha de distribuição do chamado Tônico da Vigília; o paradeiro da caçadora YARA; o que quer que esteja usando o SUBSOLO da primeira Úbia. Discrição zero. Violência a critério. — J.C." (a guilda, desta vez, não retém nada.)' }
    ],
    opcoes: [
      { texto: '⚔️ Aceitar o contrato de Jack (inicia a MISSÃO 4)', condicao: { semMissao: 'missao4' },
        efeito: [{ tipo: 'aceitarMissao', valor: 'missao4' }, { tipo: 'etapa', missao: 'missao4', valor: 'e1' }, { tipo: 'dialogo', valor: 'm4_aceita' }] },
      { texto: '🏅 Apresentar o RELATÓRIO FINAL a Jack', condicao: { flag: 'missao4Relatorio', semFlag: 'v04Completa' },
        goto: 'm4_relatorio' },
      { texto: 'Deixar o mural', efeito: [{ tipo: 'voltarCidade' }] }
    ]
  },

  m4_aceita: {
    falas: [
      { quem: 'Narrador', texto: 'MISSÃO 4 INICIADA: A Cidade dos Heróis. A Baixa do Porto abriu no mapa de Úbia. (Dica: descanse na Estalagem para salvar, e visite a Torre de Marfim — as Brancas convocaram a maga por um motivo.)' },
      { quem: 'Ladino', texto: '"Membro interno. Contratos rank A. Sabe o que rank A paga, cavaleiro?" (ele olha para o pano preto sobre a placa da Yara e o sorriso murcha um pouco) "...Primeiro a gente devolve a moça pro mural. DEPOIS a gente fica rico."' }
    ],
    opcoes: [
      { texto: '⚓ Descer à Baixa do Porto', efeito: [{ tipo: 'irMapa' }] },
      { texto: 'Preparar-se na cidade primeiro', efeito: [{ tipo: 'voltarCidade' }] }
    ]
  },

  m4_torre: {
    cenario: 'assets/img/cidade-ubia.png',
    falas: [
      { quem: 'Narrador', texto: 'A Torre de Marfim não tem porta — tem um ARCO, e quem o conselho aceita simplesmente... já está dentro. O salão cheira a pergaminho e neve. Uma mulher de branco, sem idade visível, espera com as mãos nas mangas. O corvo Cinza pousa no ombro dela como se voltasse pra casa.' },
      { quem: 'Encantatriz Branca', texto: '"Aspirante. Companheiros." (ela inclina a cabeça exatamente dois graus) "O conselho suspendeu a proibição sobre a Blood Magus — vocês sabem. O que não sabem: nós rastreamos o extrato dela até AQUI. Úbia é a fase dois. Uma cidade de heróis que dorme é um EXÉRCITO que a máscara de osso não precisa recrutar... só coroar."' },
      { quem: 'Encantatriz Branca', texto: '"Cacem a linha de distribuição. Encontrem o que ela coroou. E aspirante..." (pela primeira vez, a voz dela hesita meio tom) "...quando a missão terminar, volte a esta torre. O conselho tem algo para a senhorita. Costuramos há três semanas."' }
    ],
    opcoes: [
      { texto: '🕊️ Apresentar-se ao conselho (fim da missão)', condicao: { missaoConcluida: 'missao4', semFlag: 'mantoEntregue' },
        goto: 'm4_torre_manto' },
      { texto: 'Voltar à praça alta', efeito: [{ tipo: 'voltarCidade' }] }
    ],
    codex: { id: 'torre_marfim', titulo: 'A Torre de Marfim (Úbia)', texto: 'A embaixada das Brancas em Úbia: sem porta, só um arco que decide quem entra. A proibição sobre Lysia está suspensa e o conselho confirma — Úbia é a FASE DOIS: uma cidade de heróis adormecida é um exército pronto para ser coroado. Elas "costuram algo há três semanas" para a maga.' }
  },

  m4_torre_manto: {
    cenario: 'assets/img/cidade-ubia.png',
    falas: [
      { quem: 'Narrador', texto: 'Desta vez são CINCO mulheres de branco no salão — e o silêncio delas pesa como veredicto. A do centro traz nos braços um tecido dobrado que parece luz de inverno: seda branca, fio de prata rúnica, o sigilo da Cidadela no fecho.' },
      { quem: 'Encantatriz Branca', texto: '"Pela quebra da coroa, pela caçadora devolvida e pela fase dois interrompida: o conselho reconhece a aspirante como INICIADA." (ela estende o manto) "Tecido não é armadura, Iniciada — a senhorita conjura livre dentro dele. E onde quer que o vista... NÓS saberemos como a senhorita está. Considere as duas coisas um presente."' },
      { quem: 'Narrador', texto: '🕊️ A maga recebe o MANTO DA INCANTATRIX (item único: vestes — CA +3 total e +2 em Vontade). E a mulher do centro acrescenta, baixo: "A amostra-mãe está em AVENCHES. Quando a guilda apontar o leste... o conselho apontará junto. Pela primeira vez em duzentos anos."' }
    ],
    efeitoEntrada: [{ tipo: 'itemUnico', valor: 'u_manto_incantatrix' }, { tipo: 'flag', valor: 'mantoEntregue' }],
    opcoes: [{ texto: 'Vestir o manto e sair sob o arco', efeito: [{ tipo: 'voltarCidade' }] }],
    codex: { id: 'iniciada_brancas', titulo: 'Iniciada das Brancas', texto: 'A maga foi reconhecida como INICIADA e recebeu o Manto da Incantatrix (vestes únicas — e um rastreador elegante). O conselho confirmou: a amostra-mãe está em AVENCHES, e pela primeira vez em dois séculos as Brancas vão apontar na mesma direção que uma guilda de mercenários.' },
    xp: 600
  },

  m4_museu_visita: {
    cenario: 'assets/img/cidade-ubia.png',
    falas: [
      { quem: 'Narrador', texto: 'O Museu dos Heróis guarda as eras de Úbia em vitrines de cristal: a couraça do Primeiro Caçador, a estátua dos duelistas de mestre-sala, espadas com mais títulos que muitos nobres. No centro, num pedestal de mármore negro, a LÁGRIMA DE ÚBIA — a joia que, dizem, chora quando a cidade corre perigo.' },
      { quem: 'Narrador', texto: 'Há uma poça fina e brilhante na base do pedestal. O vigia jura que limpou de manhã. E que ontem limpou duas vezes.' }
    ],
    opcoes: [{ texto: 'Deixar o museu (com um arrepio na nuca)', efeito: [{ tipo: 'voltarCidade' }] }],
    codex: { id: 'lagrima_ubia', titulo: 'A Lágrima de Úbia', texto: 'A relíquia-coração do museu: uma joia que CHORA quando Úbia corre perigo. Está chorando há dois dias. Relíquias que sentem a cidade inteira seriam um amplificador e tanto — para quem quisesse fazer a cidade inteira SONHAR.' },
    xp: 300
  },

  /* ---------- Nós da M4 ---------- */

  m4_cena_porto: {
    cenario: 'assets/img/cenario-porto.png',
    falas: [
      { quem: 'Narrador', texto: 'A Baixa do Porto deveria ferver a esta hora — guindastes, palavrões, peixe. Em vez disso: metade das docas trabalha em silêncio, e a outra metade COCHILA sentada nos cabrestantes, sorrindo. Empilhados no cais 7, caixotes novos com um selo simpático: "TÔNICO REVIGORANTE DA VIGÍLIA — o descanso do trabalhador".' },
      { quem: 'Maga', texto: '"Revigorante." (ela raspa a cera do selo com a unha) "Distribuição de graça, no porto, onde ninguém pergunta. Precisamos saber pra ONDE vai o resto da carga — e quem assina o manifesto."' }
    ],
    opcoes: [
      { texto: '🔍 Vasculhar o manifesto de carga no escritório do cais [PROCURAR, CD 14]',
        efeito: [{ tipo: 'teste', pericia: 'Procurar', cd: 14, sucesso: 'm4_porto_sucesso', falha: 'm4_porto_falha' }] },
      { texto: '🗣️ Pagar uma rodada e soltar a língua dos estivadores acordados [DIPLOMACIA, CD 14]',
        efeito: [{ tipo: 'teste', pericia: 'Diplomacia', cd: 14, sucesso: 'm4_porto_sucesso', falha: 'm4_porto_falha' }] }
    ]
  },

  m4_porto_sucesso: {
    cenario: 'assets/img/cenario-porto.png',
    falas: [
      { quem: 'Narrador', texto: 'O manifesto canta: toda a carga do "tônico" desce no ARMAZÉM 7, arrendado há um mês por uma "Sociedade Beneficente da Vigília". Destinos das saídas: o quartel da guarda do porto, duas tavernas da cidade alta... e o ALOJAMENTO DA SEDE DOS CAÇADORES.' },
      { quem: 'Narrador', texto: 'A assinatura do arrendamento é um floreio elegante: "V.R." E na margem, em letra miúda de contador: "prioridade aos que SONHAM ALTO — a coroa serve."' }
    ],
    xp: 600,
    opcoes: [{ texto: 'Ao Armazém 7', efeito: [{ tipo: 'etapa', missao: 'missao4', valor: 'e2' }, { tipo: 'fecharCena' }] }],
    codex: { id: 'tonico_vigilia', titulo: 'O Tônico da Vigília', texto: 'Extrato do selo diluído, distribuído DE GRAÇA como "tônico revigorante": porto, tavernas, o quartel da guarda — e o alojamento da própria Sede. Arrendatária do Armazém 7: "Sociedade Beneficente da Vigília", assinatura "V.R.". Na margem: "prioridade aos que sonham alto — a coroa serve."' }
  },

  m4_porto_falha: {
    cenario: 'assets/img/cenario-porto.png',
    falas: [
      { quem: 'Narrador', texto: 'O escrivão do cais é simpático, prestativo — e sonolento. No meio da conversa ele boceja, sorri... e o ar adocicado do hálito dele bate como um porrete de veludo. Vocês recuam da nuvem de pólen a tempo de não dormir NO CAIS — mas a cabeça cobra o pedágio.' },
      { quem: 'Ladino', texto: '(esfregando os olhos) "O caixote de cima tinha um mapa de entregas rabiscado. Vi pouco... mas vi ARMAZÉM 7. Serve de começo."' }
    ],
    xp: 250,
    opcoes: [{ texto: 'Respirar fundo e ir ao Armazém 7', efeito: [{ tipo: 'dano', valor: 6 }, { tipo: 'etapa', missao: 'missao4', valor: 'e2' }, { tipo: 'fecharCena' }] }]
  },

  m4_cena_armazem: {
    cenario: 'assets/img/cenario-armazem.png',
    falas: [
      { quem: 'Narrador', texto: 'O Armazém 7 é uma catedral de caixotes — milhares de frascos âmbar dormindo em palha, o suficiente para adoçar cada caneca de Úbia por um mês. Entre as pilhas, vultos de roupão cinza conferem listas... e duas figuras À PAISANA, paradas demais, com as mãos leves demais perto das mangas.' },
      { quem: 'Paladino', texto: '(baixo) "As duas de casaco. O Detectar o Mal ARDE — e eu conheço o corte dessas mangas. Adagas Negras. Sem batina, desta vez."' }
    ],
    opcoes: [
      { texto: '⚔️ Tomar o armazém — combate!', efeito: [{ tipo: 'combate', valor: 'm4_armazem' }] },
      { texto: 'Recuar ao mapa', efeito: [{ tipo: 'sairCena' }] }
    ]
  },

  m4_armazem_vitoria: {
    cenario: 'assets/img/cenario-armazem.png',
    falas: [
      { quem: 'Narrador', texto: 'O capataz cai por último, e o silêncio do armazém vira um silêncio HONESTO. Na escrivaninha, a lista-mestra de entregas — e um adendo com o mesmo floreio "V.R.": "Fase dois em cronograma. Quartéis: 60%. Guilda: em curso. A COROA está estável no hospedeiro; a Lágrima será colhida na madrugada do dia 9."' },
      { quem: 'Maga', texto: '"Hospedeiro." (a palavra sai fria) "A coroa está EM ALGUÉM, e esse alguém vai roubar a Lágrima hoje." (ela ergue os olhos) "Que dia é hoje? ...DIA 9. Corram. O museu. AGORA."' }
    ],
    opcoes: [{ texto: '🏃 Correr ao Museu dos Heróis (madrugada)', efeito: [{ tipo: 'etapa', missao: 'missao4', valor: 'e3' }, { tipo: 'sairCena' }] }],
    codex: { id: 'lista_mestra', titulo: 'A lista-mestra da fase dois', texto: 'A distribuição em números: guarda 60% dosada, guilda "em curso". E o pior: "a COROA está estável no hospedeiro; a Lágrima será colhida na madrugada do dia 9" — hoje. Alguém coroado vai roubar a relíquia que sente a cidade inteira.' }
  },

  m4_cena_museu: {
    cenario: 'assets/img/cenario-museu.png',
    falas: [
      { quem: 'Narrador', texto: 'O museu de madrugada é um bosque de heróis mortos em luz de lampião. O vigia dorme abraçado à alabarda, sorrindo. E no pedestal de mármore negro, de costas para vocês, alguém ergue a LÁGRIMA DE ÚBIA contra a luz — uma mulher em couraça de batalha gasta, cabelo em trança de guerra... e um ARO DE PRATA fino demais na testa, pulsando como um segundo coração.' },
      { quem: 'Narrador', texto: 'Ela se vira. E vocês entendem o pano preto sobre a placa do ranking: é YARA. Os olhos da Top 1 dos Caçadores estão abertos, educados... e ausentes. "A Vigília agradece a doação", diz a boca dela, com a voz dela, sem NADA dela dentro.' }
    ],
    opcoes: [
      { texto: '🗣️ Chamar a caçadora pelo NOME — alcançar quem está sob a coroa [SABEDORIA, CD 15]',
        efeito: [{ tipo: 'teste', atributo: 'SAB', cd: 15, sucesso: 'm4_museu_sucesso', falha: 'm4_museu_falha' }] },
      { texto: '🏃 Cortar a saída dela — rápido e silencioso [DESTREZA, CD 15]',
        efeito: [{ tipo: 'teste', atributo: 'DES', cd: 15, sucesso: 'm4_museu_sucesso', falha: 'm4_museu_falha' }] }
    ]
  },

  m4_museu_sucesso: {
    cenario: 'assets/img/cenario-museu.png',
    falas: [
      { quem: 'Narrador', texto: '"YARA." O nome atravessa a coroa como pedra em vidraça. Por UM segundo, os olhos dela FOCAM — pavor, fúria, socorro — e a mão dela desvia sozinha, derrubando do próprio cinto um caderno de patrulha. Então o aro pulsa, o rosto fecha, e ela ATRAVESSA a rotunda num salto que nenhum humano deveria dar, sumindo com a Lágrima por uma boca de aqueduto.' },
      { quem: 'Narrador', texto: 'No caderno, na letra firme da Top 1, a última anotação lúcida: "Subsolo. Fórum velho. Eles cantam pra uma COROA. Se eu não voltar — digam ao Jack que o tônico entra pela ala leste." Ela sabia. Ela FOI. E foi coroada.' }
    ],
    xp: 700,
    opcoes: [{ texto: 'Ao subsolo, atrás dela', efeito: [{ tipo: 'etapa', missao: 'missao4', valor: 'e4' }, { tipo: 'fecharCena' }] }],
    codex: { id: 'coroa_de_sonho', titulo: 'A Coroa de Sonho (e quem a veste)', texto: 'A ladra da Lágrima é YARA — coroada com um aro de prata que pulsa como coração: a COROA DE SONHO. Por um segundo o nome dela a alcançou; ela deixou cair o caderno: "Fórum velho. Eles cantam pra uma coroa. O tônico entra pela ala leste." A Top 1 investigou sozinha — e virou o hospedeiro.' }
  },

  m4_museu_falha: {
    cenario: 'assets/img/cenario-museu.png',
    falas: [
      { quem: 'Narrador', texto: 'Vocês avançam — e a Top 1 do continente mostra POR QUE é a Top 1, mesmo vazia: a bainha (ela não desembainhou; alguma parte dela se recusou) varre a rotunda em dois arcos e três costelas. Quando o mundo para de girar, Yara é uma silhueta sumindo numa boca de aqueduto, com a Lágrima.' },
      { quem: 'Ladino', texto: '(cuspindo poeira de mármore) "...Ela lutou com a BAINHA. Tá me dizendo que aquilo era ela SEGURANDO o golpe?" (ele se levanta com esforço) "Subsolo. E vamos rezando pra coroa não pedir a lâmina."' }
    ],
    xp: 300,
    opcoes: [{ texto: 'Ao subsolo, atrás dela (doloridos)', efeito: [{ tipo: 'dano', valor: 10 }, { tipo: 'etapa', missao: 'missao4', valor: 'e4' }, { tipo: 'fecharCena' }] }],
    codex: { id: 'coroa_de_sonho', titulo: 'A Coroa de Sonho (e quem a veste)', texto: 'A ladra da Lágrima é YARA, a Top 1 — coroada com um aro de prata pulsante: a COROA DE SONHO. Ela derrubou a party lutando COM A BAINHA (alguma parte dela ainda segura o golpe) e sumiu no subsolo com a relíquia.' }
  },

  m4_cena_subterraneo: {
    cenario: 'assets/img/cenario-subterraneo.png',
    falas: [
      { quem: 'Narrador', texto: 'Sob a cidade alta corre a PRIMEIRA Úbia: aquedutos secos, arcos afogados em raiz, ruas inteiras que a cidade nova usou de alicerce. Alguém marcou o caminho com setas de fuligem — recentes, feitas para os que vêm DEPOIS. E no fim da galeria, luz vermelha e o bater ritmado de alabardas em pedra: uma PATRULHA.' },
      { quem: 'Maga', texto: '(olhando as silhuetas paradas demais) "Vigilantes. Como a Ekaterina — mas em SÉRIE. É isto que a coroa fabrica com os que sonham alto." (o foco arcano acende nos dedos dela) "Ekaterina não teve escolha. Estes também não tiveram. Sejamos RÁPIDOS, por respeito."' }
    ],
    opcoes: [
      { texto: '⚔️ Abrir passagem — combate!', efeito: [{ tipo: 'combate', valor: 'm4_subterraneo' }] },
      { texto: 'Recuar ao mapa', efeito: [{ tipo: 'sairCena' }] }
    ]
  },

  m4_subterraneo_vitoria: {
    cenario: 'assets/img/cenario-subterraneo.png',
    falas: [
      { quem: 'Narrador', texto: 'O último Vigilante desliga — e alguém APLAUDE de cima de um arco, devagar, com o deboche de sempre. Yurin está sentado no aqueduto como quem senta num muro de quintal, jogando uma moeda. "Vocês demoraram. Eu marquei o caminho com FULIGEM, pelos deuses. Era pra ser óbvio."' },
      { quem: 'Yurin', texto: '"Escutem rápido: a coroa da moça é ENSAIO — a mestra quer Úbia inteira sonhando em um mês, e a Lágrima é o amplificador. O canto acontece no Fórum Afundado, embaixo da SEDE. Poético, né? O exército dela nascendo debaixo da cadeira do Jack." (a moeda para no ar, entre dois dedos) "Por que ajudo de novo? O MEU patrono continua não gostando de concorrência. E... digam à L. que o Suzas mandou lembranças. Ela vai ODIAR. Vale a viagem só por isso."' }
    ],
    xp: 400,
    opcoes: [{ texto: 'Ao Santuário da Vigília', efeito: [{ tipo: 'etapa', missao: 'missao4', valor: 'e5' }, { tipo: 'sairCena' }] }],
    codex: { id: 'yurin_ubia', titulo: 'Yurin, de novo no meio', texto: 'O bruxo de Suzas marcou o caminho no subsolo COM FULIGEM (as setas eram dele). A coroa de Yara é ensaio: a meta é Úbia inteira sonhando em UM MÊS, com a Lágrima de amplificador, e o ritual acontece no Fórum Afundado — exatamente sob a Sede dos Caçadores. Suzas segue não tolerando o exército alheio.' }
  },

  m4_cena_santuario: {
    cenario: 'assets/img/cenario-santuario.png',
    falas: [
      { quem: 'Narrador', texto: 'A galeria abre num salão que já foi um mercado da primeira Úbia — e agora é um POMAR. Dos arcos pendem casulos de teia cinzenta, dezenas, cada um com uma etiqueta de madeira e um fio de prata subindo da testa de quem dorme dentro. Caçadores. Guardas. Uma taverneira ainda de avental. Os fios correm todos na mesma direção: para baixo, para o Fórum.' },
      { quem: 'Narrador', texto: 'Entre os casulos, irmãos de roupão trabalham com tesouras de podar — e um FIHYR do tamanho de um cavalo dorme enrolado no centro do salão, gordo de pesadelo alheio. Um dos irmãos ergue a palma, sorrindo: "Vieram receber a bênção do descanso?"' }
    ],
    opcoes: [
      { texto: '⚔️ "Viemos PODAR." — combate!', efeito: [{ tipo: 'combate', valor: 'm4_santuario' }] },
      { texto: 'Recuar ao mapa', efeito: [{ tipo: 'sairCena' }] }
    ]
  },

  m4_santuario_vitoria: {
    cenario: 'assets/img/cenario-santuario.png',
    falas: [
      { quem: 'Narrador', texto: 'O Fihyr Adulto se desfaz em névoa que ninguém respira de volta. A maga corta os fios de prata um a um, e casulo por casulo o salão ACORDA — tosse, palavrões, uma taverneira exigindo saber quem paga o avental rasgado. E de um casulo etiquetado "FORTE. TEIMOSA. SONHA COM O TOPO.", sai rasgando com as próprias unhas...' },
      { quem: 'Dora Terra-brava', texto: '"...QUATRO DIAS. Me penduraram que nem PRESUNTO por quatro dias." (ela cospe teia, e o olhar dela encontra o de vocês — e por um segundo o Top 2 do continente parece quase constrangida) "Vocês. Claro que são vocês." (ela agarra o braço do paladino, séria como pedra) "Escutem: a Yara tá lá embaixo, e vão mandar vocês MATAREM ela. NÃO MATEM. A coroa solta quando o corpo cede — derrubem a MENINA pra libertar a CAÇADORA. E deixem a maga de vermelho comigo... não. Não deixem. Eu ainda tô cuspindo teia."' }
    ],
    xp: 500,
    opcoes: [{ texto: '⚖️ Ao Fórum Afundado — quebrar a coroa', efeito: [{ tipo: 'etapa', missao: 'missao4', valor: 'e6' }, { tipo: 'sairCena' }] }],
    codex: { id: 'dora_libertada', titulo: 'Dora, fora do casulo', texto: 'Dora Terra-brava estava entre os colhidos ("forte, teimosa, sonha com o topo"). Libertada, deu a instrução que importa: NÃO matar Yara — a Coroa de Sonho solta quando o corpo cede. Derrubar a menina é libertar a caçadora. Os casulos do santuário foram abertos; os fios de prata corriam todos para o Fórum.' }
  },

  m4_cena_forum: {
    cenario: 'assets/img/cenario-forum.png',
    falas: [
      { quem: 'Narrador', texto: 'O Fórum Afundado é a primeira Úbia inteira num só salão: arquibancadas de mármore submersas em sombra, colunas como costelas de um deus antigo — e no centro, num círculo de velas de sebo negro, a LÁGRIMA DE ÚBIA flutuando sobre um tripé de prata, chorando sem parar. Cada lágrima que cai VIRA FIO, e cada fio sobe para a cidade lá em cima.' },
      { quem: 'Narrador', texto: 'Yara está de joelhos diante da relíquia, a coroa pulsando — e ao lado dela, conduzindo o canto com a palma aberta e ensanguentada, VESTES VERMELHAS até o chão. Lysia Moss nem se vira: "Pontuais. Eu disse à mestra: os heróis de Renânia chegam sempre DEPOIS do ensaio... e sempre ANTES da estreia." (o sangue dela sobe, tecendo o ar) "Vamos ver se a fase dois estreia hoje."' },
      { quem: 'Maga', texto: '"LYSIA!" (o grito da maga ecoa nas arquibancadas mortas — dois anos de conta chegando ao vencimento) "O recado do seu bilhete, lá do laboratório? Considere RESPONDIDO."' }
    ],
    opcoes: [
      { texto: '⚔️ QUEBRAR A COROA — o combate final de Úbia!', efeito: [{ tipo: 'combate', valor: 'm4_forum' }] },
      { texto: 'Recuar (o canto continua às suas costas...)', efeito: [{ tipo: 'sairCena' }] }
    ]
  },

  m4_forum_vitoria: {
    cenario: 'assets/img/cenario-forum.png',
    falas: [
      { quem: 'Narrador', texto: 'Yara cai de joelhos — e a COROA RACHA com um som de sino trincado. O aro de prata rola pelo mármore, tenta pulsar uma última vez... e a bota do ladino resolve o assunto com um estalo seco e ZERO cerimônia. Os fios de prata do salão inteiro se soltam como cordas cortadas. Em algum lugar lá em cima, Úbia inteira vira de lado na cama e ACORDA.' },
      { quem: 'Yara', texto: 'Os olhos dela focam — e desta vez FICAM. "...Eu vi tudo. Cada entrega. Cada casulo. Eu tava lá dentro, batendo na vidraça." (ela se levanta sozinha, recusando o braço do paladino, e apanha a própria espada do chão... e a ESTENDE, cabo primeiro) "Ela lutou contra vocês sem mim. Agora luta COM vocês. É assim que eu pago dívida de acordar."' },
      { quem: 'Narrador', texto: '⚔️ A party recebe a LÂMINA DA YARA (item único). A Lágrima de Úbia para de chorar — e no silêncio novo, todos ouvem o que ela chorava: passos. Milhares. Marchando em sonho, em algum lugar a LESTE. A relíquia não chorava por Úbia. Chorava pelo que vem DEPOIS de Úbia.' }
    ],
    efeitoEntrada: [{ tipo: 'itemUnico', valor: 'u_lamina_yara' }],
    opcoes: [{ texto: 'Subir com Yara e a Lágrima — relatório na Sede', efeito: [{ tipo: 'etapa', missao: 'missao4', valor: 'e7' }, { tipo: 'flag', valor: 'missao4Relatorio' }, { tipo: 'sairCena' }] }],
    codex: { id: 'coroa_quebrada', titulo: 'A coroa quebrou (e a Lágrima parou)', texto: 'A Coroa de Sonho rachou quando Yara caiu — e a cidade acordou. Lysia fugiu MENOS elegante que de costume. Yara, desperta e furiosa, entregou a própria lâmina à party. E a Lágrima parou de chorar... revelando POR QUE chorava: um exército marcha em sonho, a leste. Ela não chorava por Úbia.' }
  },

  m4_relatorio: {
    cenario: 'assets/img/cidade-ubia.png',
    falas: [
      { quem: 'Narrador', texto: 'O salão da Sede está LOTADO — caçadores acordados há uma hora, ainda de camisola de dormir sob a couraça, todos fingindo que não estão olhando. Jack Caolha arranca o pano preto de cima da placa "1. YARA" e o joga no lixo. Depois vira o olho bom para a party. O salão inteiro prende o ar.' },
      { quem: 'Jack Caolha', texto: '"Três missões B. Um selo mantido, uma aldeia acordada, e agora a MINHA cidade e a MINHA Top 1 devolvidas no mesmo dia." (ele abre um estojo de couro: dois mil em barras, e três placas de bronze NOVAS) "Chega de \'aspirantes\'. A partir de hoje vocês são MEMBROS INTERNOS dos Caçadores — placa na coluna, voto no salão, e contratos rank A. Não me façam discursar. EU NÃO DISCURSO."' },
      { quem: 'Yara', texto: '(da beira do salão, braços cruzados, meio sorriso) "Discursou." (risada geral; Jack aponta a porta; ninguém sai) "Membros internos: quando marcharem pro LESTE — e vocês vão — eu vou junto. Dívida é dívida."' },
      { quem: 'Narrador', texto: 'E longe, em Avenches, numa cidadela sobre ossos de dragão, uma máscara de osso encara um mapa com uma cidade RISCADA. "Úbia perdida, mestra?" — pergunta a voz de seda, com um fio novo de medo. "Perdida?" A máscara não se altera. "Úbia era o ENSAIO GERAL, criança. A estreia nunca foi aqui." Atrás dela, o que não tem carne ri baixinho — e desta vez, ri POR ÚLTIMO. A MISSÃO 4 ESTÁ COMPLETA.' }
    ],
    opcoes: [
      { texto: '🏅 Encerrar (a placa, o ouro e um descanso de HERÓI)', efeito: [
        { tipo: 'ouro', valor: 2000 },
        { tipo: 'etapa', missao: 'missao4', valor: 'e8' },
        { tipo: 'concluirMissao', valor: 'missao4' },
        { tipo: 'flag', valor: 'v04Completa' },
        { tipo: 'flag', valor: 'membroInterno' },
        { tipo: 'xp', valor: 1500 },
        { tipo: 'voltarCidade' }
      ] }
    ],
    codex: { id: 'membro_interno', titulo: 'MEMBROS INTERNOS (rank A)', texto: 'Jack investiu a party como MEMBROS INTERNOS: placa de bronze, voto no salão, contratos rank A — e 2.000 po. Yara jurou marchar junto quando a guilda apontar o leste. Em Avenches, Viridiana riscou Úbia do mapa sem alterar a máscara: "Úbia era o ensaio geral. A estreia nunca foi aqui." (Missão 5: Avenches — e a Torre de Marfim tem algo para a maga.)' }
  },

  /* ---------- Refarm M4 ---------- */
  refarm_m4_armazem_intro: {
    cenario: 'assets/img/cenario-armazem.png',
    falas: [{ quem: 'Narrador', texto: 'O Armazém 7 foi lacrado pela guilda — o que não impede a irmandade de mandar gente atrás do estoque perdido. Lâminas caras rondam as docas à noite. A guilda paga por elas.' }],
    opcoes: [
      { texto: '⚔️ Caçar as Adagas remanescentes (farm, XP reduzido)', efeito: [{ tipo: 'combate', valor: 'refarm_m4_armazem', farm: true }] },
      { texto: 'Voltar ao mapa', efeito: [{ tipo: 'sairCena' }] }
    ]
  },
  refarm_m4_subterraneo_intro: {
    cenario: 'assets/img/cenario-subterraneo.png',
    falas: [{ quem: 'Narrador', texto: 'A primeira Úbia é grande demais para varrer numa noite. Vigilantes perdidos ainda patrulham ordens que ninguém mais canta, e o pesadelo residual cria corpo nos cantos escuros.' }],
    opcoes: [
      { texto: '⚔️ Varrer as galerias (farm, XP reduzido)', efeito: [{ tipo: 'combate', valor: 'refarm_m4_subterraneo', farm: true }] },
      { texto: 'Voltar ao mapa', efeito: [{ tipo: 'sairCena' }] }
    ]
  }

});
