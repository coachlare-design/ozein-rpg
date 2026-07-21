/* =====================================================
   OZEIN RPG — js/combat.js
   Motor de combate ATB: barras de ação (FF), resolução
   d20 (D&D 3.5), condições, scripts de encontro, fraquezas,
   auto-batalha e fuga.
   ===================================================== */
'use strict';

const Combat = {
  c: null,          // estado do combate corrente
  TICK_MS: 120,
  aoTerminar: null, // callback (resultado) — setado por quem inicia

  /* ---------- Utilidades de dados ---------- */
  rolarDado(expr) { // "2d6+3" → total
    if (!expr) return 0;
    const m = String(expr).match(/(\d+)d(\d+)([+-]\d+)?/);
    if (!m) return parseInt(expr) || 0;
    const [, n, faces, mod] = m;
    let total = 0;
    for (let i = 0; i < +n; i++) total += Regras.rolar(+faces);
    return total + (mod ? parseInt(mod) : 0);
  },

  parseCritico(str) { // "19-20/×2" | "×3" | "20/×2"
    let ameaca = 20, mult = 2;
    if (!str) return { ameaca, mult };
    const mMult = str.match(/×(\d+)/);
    if (mMult) mult = +mMult[1];
    const mFaixa = str.match(/^(\d+)/);
    if (mFaixa && +mFaixa[1] < 20) ameaca = +mFaixa[1];
    return { ameaca, mult };
  },

  /* Usos de Golpe Sagrado por combate: 1 base, +1 no nível 5 e no 10
     (progressão de "destruir o mal" do D&D 3.5), +1 pela trilha de prestígio. */
  _limiteGolpe(h) {
    const base = (h.stats.passiva && h.stats.passiva.golpeSagradoUsos) || 1;
    return base + Math.floor((h.nivel || Regras.nivelPorXp(Engine.estado.xp)) / 5);
  },

  /* ---------- Início / fim ---------- */
  iniciar(encontroId, aoTerminar) {
    const enc = GameData.get('encounters')[encontroId];
    if (!enc) { console.error('Encontro não encontrado:', encontroId); return; }
    this.aoTerminar = aoTerminar || null;

    // ✋ Impor as Mãos renova A CADA ENCONTRO (paridade com o foco arcano da maga)
    if (Engine.estado.party.includes('paladino')) {
      Engine.estado.reservaImpor = Engine._reservaMaxima();
    }
    const herois = Engine.estado.party.map(id => this._montarHeroi(id));
    const inimigos = enc.inimigos.map((e, i) => ({
      ...JSON.parse(JSON.stringify(e)),
      idx: i, pvMax: e.pv, atb: Math.random() * 30, condicoes: [], acoes: 0,
      morto: false, fugiu: false
    }));

    this.c = {
      encontroId, enc, herois, inimigos,
      turnos: 0, rodada: 1, prontos: [], aguardando: null,
      log: [], terminado: false, auto: false,
      forjaUsada: false, scriptsFeitos: []
    };
    this.logar(`⚔️ ${enc.nome} — o combate começa!`);
    this._ligarRelogio();
  },

  _montarHeroi(id) {
    const h = Engine.estado.herois[id];
    const stats = Loot.statsHeroi(h, Engine.estado.equips[id] || {});
    // PV atual não pode passar do novo máximo
    Engine.estado.pv[id] = Math.min(Engine.estado.pv[id], stats.pvMax);
    const nivel = Regras.nivelPorXp(Engine.estado.xp);
    // FOCO ARCANO por combate (conjuradores): 4 + nível/2 + passiva
    const usaFoco = (h.habilidadesCombate || []).some(a => { const ab = GameData.get('abilities')[a]; return ab && ab.circulo; });
    return {
      id, ref: h, stats, nivel,
      atb: Math.random() * 25, condicoes: [], desviando: false,
      usos: {}, caido: Engine.estado.pv[id] <= 0,
      foco: usaFoco ? 4 + Math.floor(nivel / 2) + ((stats.passiva && stats.passiva.focoExtra) || 0) : null
    };
  },

  _ligarRelogio() {
    clearInterval(this._timer);
    this._timer = setInterval(() => this.tick(), this.TICK_MS);
  },

  pararRelogio() { clearInterval(this._timer); },

  /* ---------- Loop ATB ---------- */
  tick() {
    const c = this.c;
    if (!c || c.terminado) return;
    // pausa enquanto o jogador escolhe (exceto no modo auto)
    if (c.aguardando !== null && !c.auto) return;

    // heróis
    for (const h of c.herois) {
      if (h.caido || this._tem(h, 'petrificado')) continue;
      const acel = this._tem(h, 'acelerado') ? 1.5 : 1;
      h.atb = Math.min(100, h.atb + h.ref.atbVel * 0.55 * acel);
    }
    // inimigos
    for (const e of c.inimigos) {
      if (e.morto || e.fugiu) continue;
      e.atb = Math.min(100, e.atb + e.atbVel * 0.55);
      if (e.atb >= 100) { this.turnoInimigo(e); if (c.terminado) return; }
    }
    // herói pronto?
    if (c.aguardando === null) {
      const pronto = c.herois.find(h => h.atb >= 100 && !h.caido && !this._tem(h, 'petrificado'));
      if (pronto) {
        if (this._processarInicioTurno(pronto)) { // condições podem consumir o turno
          c.aguardando = c.herois.indexOf(pronto);
          if (c.auto) this._agirAuto(pronto);
        }
      }
    }
    UICombate.render();
  },

  _avancarTurno() {
    const c = this.c;
    c.turnos++;
    const vivos = c.herois.filter(h => !h.caido).length + c.inimigos.filter(e => !e.morto && !e.fugiu).length;
    const novaRodada = Math.floor(c.turnos / Math.max(1, vivos)) + 1;
    if (novaRodada > c.rodada) { c.rodada = novaRodada; this._rodarScripts(); }
    this._checarFim();
  },

  /* ---------- Condições ---------- */
  _tem(alvo, cond) { return alvo.condicoes.some(x => x.tipo === cond); },
  _aplicar(alvo, tipo, duracao) {
    const jaTem = alvo.condicoes.find(x => x.tipo === tipo);
    if (tipo === 'petrificando') {
      if (jaTem) { jaTem.stacks = (jaTem.stacks || 1) + 1; if (jaTem.stacks >= 2) { alvo.condicoes = alvo.condicoes.filter(x => x.tipo !== 'petrificando'); alvo.condicoes.push({ tipo: 'petrificado', duracao: 99 }); return 'petrificado'; } return 'petrificando2'; }
      alvo.condicoes.push({ tipo, duracao: 99, stacks: 1 }); return 'petrificando1';
    }
    if (jaTem) jaTem.duracao = Math.max(jaTem.duracao, duracao);
    else alvo.condicoes.push({ tipo, duracao });
    return tipo;
  },
  _removerExpiradas(alvo) {
    alvo.condicoes = alvo.condicoes.filter(x => x.duracao > 0);
  },

  // retorna false se o turno foi consumido pela condição
  _processarInicioTurno(alvo) {
    // queimando
    const q = alvo.condicoes.find(x => x.tipo === 'queimando');
    if (q) {
      const dano = this.rolarDado('1d6');
      this._ferir(alvo, dano, '🔥 queimando');
      q.duracao--;
      this._removerExpiradas(alvo);
      if (this._estaFora(alvo)) { this._avancarTurno(); return false; }
    }
    const ab2 = alvo.condicoes.find(x => x.tipo === 'abalado');
    if (ab2) { ab2.duracao--; this._removerExpiradas(alvo); }
    // buffs com duração em turnos (contam no início do turno do dono)
    for (const tipo of ['protegido', 'resguardado', 'acelerado', 'abencoado', 'oculto']) {
      const cnd = alvo.condicoes.find(x => x.tipo === tipo);
      if (cnd && cnd.duracao < 90) { cnd.duracao--; }
    }
    this._removerExpiradas(alvo);
    const at = alvo.condicoes.find(x => x.tipo === 'atordoado');
    if (at) {
      this.logar(`💫 ${this._nome(alvo)} está atordoado e perde a ação!`);
      alvo.condicoes = alvo.condicoes.filter(x => x.tipo !== 'atordoado');
      alvo.atb = 0;
      this._avancarTurno();
      return false;
    }
    return true;
  },

  _estaFora(alvo) {
    return alvo.caido || alvo.morto || alvo.fugiu || this._tem(alvo, 'petrificado');
  },

  _nome(alvo) { return alvo.apelido || (alvo.ref && alvo.ref.nome) || '???'; },

  /* ---------- Dano / cura ---------- */
  _ferir(alvo, dano, motivo) {
    if (alvo.stats) { // herói
      // Redução de Dano (Defensor Juramentado)
      const rd = (alvo.stats.passiva && alvo.stats.passiva.rd) || 0;
      if (rd > 0) {
        dano = Math.max(0, dano - rd);
        if (dano === 0) { UICombate.flutuar(alvo, 'RD ' + rd + '!', 'erro'); return; }
      }
      // ROLADA DEFENSIVA (Dançarino das Sombras, 1×/combate): o golpe que
      // derrubaria causa metade — ele rola com o impacto (defensive roll 3.5)
      if (alvo.stats.passiva && alvo.stats.passiva.roladaDefensiva &&
          dano >= Engine.estado.pv[alvo.id] && !(alvo.usos && alvo.usos.rolada_defensiva)) {
        alvo.usos = alvo.usos || {};
        alvo.usos.rolada_defensiva = 1;
        dano = Math.floor(dano / 2);
        this.logar(`🌑 ROLADA DEFENSIVA! ${this._nome(alvo)} rola com o impacto — o golpe letal causa só ${dano}.`);
      }
      Engine.estado.pv[alvo.id] = Math.max(0, Engine.estado.pv[alvo.id] - dano);
      UICombate.flutuar(alvo, '-' + dano, 'dano');
      if (Engine.estado.pv[alvo.id] <= 0) {
        alvo.caido = true;
        this.logar(`💀 ${this._nome(alvo)} cai inconsciente! (${motivo})`);
      }
    } else {
      alvo.pv = Math.max(0, alvo.pv - dano);
      UICombate.flutuar(alvo, '-' + dano, 'dano');
      if (alvo.pv <= 0) { alvo.morto = true; this.logar(`☠️ ${alvo.apelido} tomba! (${motivo})`); }
    }
  },

  _curar(heroi, qtd) {
    const max = heroi.stats.pvMax;
    const antes = Engine.estado.pv[heroi.id];
    Engine.estado.pv[heroi.id] = Math.min(max, antes + qtd);
    const ganho = Engine.estado.pv[heroi.id] - antes;
    UICombate.flutuar(heroi, '+' + ganho, 'cura');
    if (heroi.caido && Engine.estado.pv[heroi.id] > 0) { heroi.caido = false; this.logar(`🌅 ${this._nome(heroi)} recobra os sentidos!`); }
    return ganho;
  },

  /* ---------- Resolução de ataque (d20 vs CA) ---------- */
  _atacarAlvo(atacante, alvo, opcoes = {}) {
    const ehHeroi = !!atacante.stats;
    let bonus = (opcoes.bonusAcerto || 0) + (ehHeroi ? atacante.stats.ataque : atacante.atk);
    if (ehHeroi && this._tem(atacante, 'abalado')) bonus -= 2; // medo pesa no braço
    const caAlvoBase = ehHeroi ? alvo.ca : this._caHeroi(alvo);
    const caAlvo = opcoes.toque ? Math.max(8, caAlvoBase - 4) : caAlvoBase;
    const dado = Regras.d20();

    if (!opcoes.autoAcerto && UICombate.flutuarDado) {
      UICombate.flutuarDado(atacante, dado, dado === 20 ? 'nat20' : dado === 1 ? 'nat1' : (dado + bonus >= caAlvo ? 'acerto' : 'erro'));
    }
    if (opcoes.autoAcerto || dado === 20 || (dado !== 1 && dado + bonus >= caAlvo)) {
      // crítico?
      const crit = this.parseCritico(ehHeroi ? atacante.stats.critico : null);
      if (opcoes.critAmeaca) crit.ameaca = Math.min(crit.ameaca, opcoes.critAmeaca);
      let mult = 1, critou = false;
      if (!opcoes.autoAcerto && dado >= crit.ameaca) {
        const confirma = Regras.d20() + bonus;
        if (confirma >= caAlvo) { mult = crit.mult; critou = true; }
      }
      let dano = 0;
      const dadoDano = opcoes.dado || (ehHeroi ? atacante.stats.danoDado : atacante.dano);
      for (let i = 0; i < mult; i++) dano += this.rolarDado(dadoDano) + (opcoes.bonusDano !== undefined ? opcoes.bonusDano : (ehHeroi ? atacante.stats.danoBonus : 0));
      dano = Math.max(1, dano);

      // elementais da arma + fraqueza
      let extraTxt = '';
      if (ehHeroi) {
        for (const ex of atacante.stats.danoExtraElem) {
          let d = this.rolarDado(ex.dado);
          if (alvo.vulneravel && alvo.vulneravel === ex.elemento) { d = Math.floor(d * 1.5); extraTxt += ' (FRAQUEZA!)'; }
          dano += d;
        }
        // ataque furtivo do ladino (condição no alvo OU atacando das sombras)
        if (atacante.id === 'ladino' && (this._tem(alvo, 'atordoado') || this._tem(alvo, 'petrificando') || alvo.desprevenido || this._tem(atacante, 'oculto'))) {
          const nivelL = Regras.nivelPorXp(Engine.estado.xp);
          const nDados = Math.max(1, Math.ceil(nivelL / 2)) + ((atacante.stats.passiva && atacante.stats.passiva.furtivoExtra) || 0);
          const dFurtivo = this.rolarDado(nDados + 'd6');
          dano += dFurtivo;
          extraTxt += ` +${dFurtivo} FURTIVO`;
        }
        // Flagelo do Abismo (Cavaleiro do Cálice): +2d6 contra o mal sobrenatural
        if (atacante.stats.passiva && atacante.stats.passiva.flagelo && this._ehDoMal(alvo)) {
          const dF = this.rolarDado(atacante.stats.passiva.flagelo);
          dano += dF;
          extraTxt += ` +${dF} FLAGELO`;
        }
        // dados extras da habilidade (Punição Celestial etc.)
        if (opcoes.bonusDanoDados) {
          const dE = this.rolarDado(opcoes.bonusDanoDados);
          dano += dE;
          extraTxt += ` +${dE}`;
        }
      }
      // elemento da própria habilidade (raio de gelo etc.)
      if (opcoes.elemento && alvo.vulneravel === opcoes.elemento) { dano = Math.floor(dano * 1.5); extraTxt += ' (FRAQUEZA!)'; }
      // mordidas de fogo dos cães
      if (!ehHeroi && atacante.extraFogo) dano += this.rolarDado(atacante.extraFogo);

      this._ferir(alvo, dano, this._nome(atacante));
      this.logar(`${critou ? '🌟 CRÍTICO! ' : ''}${this._nome(atacante)} acerta ${this._nome(alvo)}: ${dano} de dano${extraTxt}. (d20=${dado}+${bonus} vs CA ${caAlvo})`);
      // roubo de vida
      if (ehHeroi && atacante.stats.roubo) this._curar(atacante, atacante.stats.roubo);
      if (ehHeroi) this._sairDasSombras(atacante);
      return true;
    }
    UICombate.flutuar(alvo, 'errou', 'erro');
    this.logar(`${this._nome(atacante)} erra ${this._nome(alvo)}. (d20=${dado}+${bonus} vs CA ${caAlvo})`);
    if (ehHeroi) this._sairDasSombras(atacante);
    // RIPOSTE do Duelista (1×/rodada — parry do 3.5, não metralhadora):
    // inimigo errou um herói de pé → contra-ataque imediato grátis
    if (!ehHeroi && !opcoes.riposte && alvo.stats && !alvo.caido &&
        alvo.stats.passiva && alvo.stats.passiva.contraAtaque && !this._tem(alvo, 'petrificado') &&
        alvo._riposteRodada !== this.c.rodada) {
      alvo._riposteRodada = this.c.rodada;
      this.logar(`🤺 RIPOSTE! ${this._nome(alvo)} pune o erro de ${this._nome(atacante)}:`);
      this._atacarAlvo(alvo, atacante, { riposte: true });
    }
    return false;
  },

  _sairDasSombras(h) {
    if (this._tem(h, 'oculto')) {
      h.condicoes = h.condicoes.filter(x => x.tipo !== 'oculto');
      this.logar(`🌑 ${this._nome(h)} emerge das sombras.`);
    }
  },

  _ehDoMal(inimigo) {
    const ref = GameData.get('monsters')[inimigo.ref];
    const tipo = (ref && ref.tipo) || '';
    return /dem[oô]n|aberra|morto-vivo|abismo|extraplanar|pesadelo/i.test(tipo);
  },

  _caHeroi(h) {
    let ca = h.stats.ca;
    if (this._tem(h, 'protegido')) ca += 4;
    if (this._tem(h, 'resguardado')) ca += 2; // Baluarte do Defensor
    if (this._tem(h, 'escudo_arcano')) ca += 4;
    if (this._tem(h, 'abencoado')) ca += 2;
    if (h.desviando) ca -= 0; // desviar os olhos não muda CA, muda o acerto do herói
    return ca;
  },

  _salvarHeroi(h, tipo, cd) {
    const dado = Regras.d20();
    let bonus = h.stats.salvamentos[tipo];
    if (this._tem(h, 'abencoado')) bonus += 2;
    // Égide de Marfim: qualquer Encantatriz Branca de pé abençoa a Vontade da party
    if (tipo === 'vontade' && this.c) {
      const egide = this.c.herois.find(x => !this._estaFora(x) && x.stats.passiva && x.stats.passiva.vontadeParty);
      if (egide) bonus += egide.stats.passiva.vontadeParty;
    }
    const total = dado + bonus;
    const passou = dado === 20 || (dado !== 1 && total >= cd);
    if (UICombate.flutuarDado) UICombate.flutuarDado(h, dado, dado === 20 ? 'nat20' : dado === 1 ? 'nat1' : (passou ? 'acerto' : 'erro'), '🛡');
    return { passou, dado, total };
  },

  _salvarInimigo(e, cd) {
    const bonus = 2 + Math.floor((e.nd || 3) / 2);
    const dado = Regras.d20();
    return dado === 20 || (dado !== 1 && dado + bonus >= cd);
  },

  /* ---------- Ações do herói ---------- */
  heroiPronto() { return this.c && this.c.aguardando !== null ? this.c.herois[this.c.aguardando] : null; },

  agir(habilidadeId, alvoIdx) {
    const c = this.c;
    const h = this.heroiPronto();
    if (!h || c.terminado) return;
    const ab = GameData.get('abilities')[habilidadeId];
    const inimigosVivos = c.inimigos.filter(e => !e.morto && !e.fugiu);
    const alvo = alvoIdx !== undefined ? c.inimigos[alvoIdx] : inimigosVivos[0];
    const passiva = h.stats.passiva || {};

    // itens de GATILHO (varinhas/bastões): disparam sem teste, gastam carga e a ação
    if (habilidadeId && habilidadeId.indexOf('gatilho:') === 0) {
      if (!this._usarGatilho(h, habilidadeId.slice(8), alvo)) return;
      h.atb = 0; h.desprevenido = false; c.aguardando = null;
      this._avancarTurno(); UICombate.render(); return;
    }

    // limites genéricos: usos por combate e FOCO ARCANO
    if (ab && ab.usosPorCombate && habilidadeId !== 'golpe_sagrado') {
      if ((h.usos[habilidadeId] || 0) >= ab.usosPorCombate) { this.logar(`${ab.nome}: sem usos restantes neste combate.`); return; }
    }
    if (ab && ab.circulo && h.foco !== null && h.foco !== undefined) {
      if (h.foco < ab.circulo) { this.logar(`🔮 Foco arcano insuficiente para ${ab.nome} (precisa ${ab.circulo}, tem ${h.foco}).`); return; }
    }

    switch (habilidadeId) {
      case 'atacar': {
        const pena = h.desviando ? -4 : 0;
        this._atacarAlvo(h, alvo, { bonusAcerto: pena });
        break;
      }
      case 'golpe_sagrado': {
        const limite = this._limiteGolpe(h);
        if ((h.usos.golpe_sagrado || 0) >= limite) { this.logar('☀️ O Golpe Sagrado se esgotou neste combate.'); return; }
        h.usos.golpe_sagrado = (h.usos.golpe_sagrado || 0) + 1;
        const pena = h.desviando ? -4 : 0;
        const nivel = Regras.nivelPorXp(Engine.estado.xp);
        this._atacarAlvo(h, alvo, { bonusAcerto: Regras.mod(h.stats.atributos.CAR) + pena, bonusDano: h.stats.danoBonus + nivel });
        break;
      }
      case 'impor_maos': {
        const reserva = Engine.estado.reservaImpor;
        if (reserva <= 0) { this.logar('✋ A reserva divina está vazia — renova no próximo encontro.'); return; }
        const feridos = c.herois.filter(x => !this._tem(x, 'petrificado') && Engine.estado.pv[x.id] < x.stats.pvMax);
        const alvoCura = feridos.sort((a, b) => (Engine.estado.pv[a.id] / a.stats.pvMax) - (Engine.estado.pv[b.id] / b.stats.pvMax))[0] || h;
        const falta = alvoCura.stats.pvMax - Engine.estado.pv[alvoCura.id];
        const usar = Math.min(reserva, Math.max(1, falta));
        Engine.estado.reservaImpor -= usar;
        const g = this._curar(alvoCura, usar);
        this.logar(`✋ Impor as Mãos: ${this._nome(h)} cura ${this._nome(alvoCura)} em ${g} PV. (Reserva: ${Engine.estado.reservaImpor})`);
        break;
      }
      case 'defender':
        this._aplicar(h, 'protegido', 1);
        this.logar(`🛡️ ${this._nome(h)} assume postura defensiva (+4 CA).`);
        break;
      case 'usar_pocao': {
        const i = Engine.estado.inventario.indexOf('pocao_cura_leve');
        if (i < 0) { this.logar('🧪 Sem poções na mochila!'); return; }
        Engine.estado.inventario.splice(i, 1);
        const g = this._curar(h, this.rolarDado('1d8+1'));
        this.logar(`🧪 ${this._nome(h)} bebe uma poção: +${g} PV.`);
        break;
      }
      case 'truque_sujo': {
        if (this._salvarInimigo(alvo, 13)) this.logar(`💨 ${alvo.apelido} pisca a areia pra longe — resistiu ao Truque Sujo!`);
        else { this._aplicar(alvo, 'atordoado', 1); this.logar(`💨 Truque Sujo! ${alvo.apelido} está ATORDOADO — hora do furtivo!`); }
        break;
      }
      case 'misseis_magicos': {
        for (let i = 0; i < 2; i++) {
          const d = this.rolarDado('1d4+1') + (passiva.danoPorDado || 0);
          this._ferir(alvo, d, 'míssil mágico');
        }
        this.logar(`✨ Mísseis Mágicos atingem ${alvo.apelido} sem chance de errar!`);
        break;
      }
      case 'raio_de_gelo':
        this._atacarAlvo(h, alvo, { toque: true, dado: '1d6+2', bonusDano: (passiva.danoPorDado || 0), elemento: 'frio' });
        break;
      case 'escudo_arcano':
        this._aplicar(h, 'escudo_arcano', 99);
        this.logar(`🔮 ${this._nome(h)} ergue um Escudo Arcano (+4 CA até o fim do combate).`);
        break;
      case 'forja': {
        if (c.forjaUsada) { this.logar('💨 A válvula da forja já foi liberada.'); return; }
        c.forjaUsada = true;
        const chefe = c.inimigos.find(e => e.chefe && !e.morto);
        if (chefe) {
          const d = this.rolarDado('3d6');
          this._ferir(chefe, d, 'vapor da forja');
          this._aplicar(chefe, 'atordoado', 1);
          this.logar(`💨 ${this._nome(h)} arromba a válvula! Vapor escaldante engole o ${chefe.apelido}: ${d} de dano e ATORDOADO!`);
        }
        break;
      }

      /* ---------- Habilidades data-driven (magias novas + prestígio) ---------- */
      default: {
        if (!ab) break;
        const cdBonus = passiva.cdMagia || 0;
        const bonusDados = (expr) => {
          if (!passiva.danoPorDado) return 0;
          const m = String(expr).match(/(\d+)d/);
          return m ? (+m[1]) * passiva.danoPorDado : 0;
        };

        if (ab.areaInimigos) {                       // bola de fogo, tempestade, explosão arcana
          this.logar(`${ab.nome} — ${this._nome(h)} varre o campo!`);
          for (const e of inimigosVivos) {
            let d = this.rolarDado(ab.dado) + bonusDados(ab.dado);
            let txt = '';
            if (ab.salvamento && this._salvarInimigo(e, (ab.cd || 14) + cdBonus)) { d = Math.floor(d / 2); txt = ' (salvou: metade)'; }
            if (ab.elemento && e.vulneravel === ab.elemento) { d = Math.floor(d * 1.5); txt += ' (FRAQUEZA!)'; }
            this._ferir(e, Math.max(1, d), ab.nome);
            this.logar(`   ${e.apelido}: ${Math.max(1, d)} de dano${txt}.`);
          }
        } else if (ab.controleTodos) {               // sono profundo
          this.logar(`${ab.nome} — ondas de torpor cobrem o campo...`);
          for (const e of inimigosVivos) {
            if (e.chefe) { this.logar(`   ${e.apelido} é forte demais para dormir.`); continue; }
            if (this._salvarInimigo(e, (ab.cd || 14) + cdBonus)) this.logar(`   ${e.apelido} resiste ao sono.`);
            else { this._aplicar(e, ab.controleTodos.condicao, ab.controleTodos.duracao); this.logar(`   ${e.apelido} APAGA — perderá a próxima ação!`); }
          }
        } else if (ab.aplicarParty) {                // velocidade, baluarte, selo de marfim
          for (const x of c.herois) if (!this._estaFora(x)) this._aplicar(x, ab.aplicarParty.condicao, ab.aplicarParty.duracao);
          this.logar(`${ab.nome}: a party inteira! (${ab.aplicarParty.duracao} turnos)`);
        } else if (ab.curaParty) {                   // clamor da Triuni
          this.logar(`${ab.nome} — a luz responde!`);
          for (const x of c.herois) {
            if (this._tem(x, 'petrificado')) continue;
            const g = this._curar(x, this.rolarDado(ab.curaParty) + (ab.somaNivel ? h.nivel : 0));
            if (g > 0) this.logar(`   ${this._nome(x)} recupera ${g} PV.`);
          }
        } else if (ab.dreno) {                       // toque vampírico
          const antes = alvo.pv;
          const ok = this._atacarAlvo(h, alvo, { toque: true, dado: ab.dado, bonusDano: bonusDados(ab.dado), elemento: ab.elemento });
          if (ok) {
            const roubado = Math.floor(Math.max(0, antes - alvo.pv) / 2);
            if (roubado > 0) { this._curar(h, roubado); this.logar(`   🩸 A vida drenada flui: ${this._nome(h)} recupera ${roubado} PV.`); }
          }
        } else if (ab.mortal) {                      // ataque mortal do Assassino
          const abertura = this._tem(alvo, 'atordoado') || this._tem(alvo, 'petrificando') || alvo.desprevenido || this._tem(h, 'oculto');
          if (abertura && !alvo.chefe) {
            const cdM = 13 + Math.floor(h.nivel / 2);
            if (!this._salvarInimigo(alvo, cdM)) {
              this._sairDasSombras(h);
              alvo.pv = 0; alvo.morto = true;
              UICombate.flutuar(alvo, '☠ MORTE', 'dano');
              this.logar(`🗡️ ATAQUE MORTAL! ${this._nome(h)} encontra a fresta exata — ${alvo.apelido} morre sem entender como. (Fort. falhou vs CD ${cdM})`);
            } else {
              this.logar(`🗡️ ${alvo.apelido} sente a lâmina e gira no último instante (resistiu ao golpe mortal)...`);
              this._atacarAlvo(h, alvo, { bonusDanoDados: '4d6' });
            }
          } else {
            this._atacarAlvo(h, alvo, { bonusDanoDados: abertura ? '4d6' : '2d6' });
          }
        } else if (ab.ataqueEspecial) {              // punição celestial, estocada precisa
          const ae = ab.ataqueEspecial;
          const pena = h.desviando ? -4 : 0;
          const bA = (ae.bonusAcertoAtributo ? Math.max(0, Regras.mod(h.stats.atributos[ae.bonusAcertoAtributo])) : 0) + pena;
          this.logar(`${ab.nome}!`);
          this._atacarAlvo(h, alvo, { bonusAcerto: bA, bonusDanoDados: ae.bonusDanoDados, critAmeaca: ae.critAmeaca });
        } else if (ab.aplicar && ab.aplicar.alvo === 'self') { // passo sombrio etc.
          this._aplicar(h, ab.aplicar.condicao, ab.aplicar.duracao);
          this.logar(`${ab.nome}: ${this._nome(h)}${ab.aplicar.condicao === 'oculto' ? ' SOME nas sombras — o próximo golpe será furtivo.' : '.'}`);
        } else if (ab.dado && ab.toqueDistancia) {   // conflagração
          this._atacarAlvo(h, alvo, { toque: true, dado: ab.dado, bonusDano: (ab.somaNivel ? h.nivel : 0) + bonusDados(ab.dado), elemento: ab.elemento });
        }
        break;
      }
    }
    // pagamento genérico: usos e foco arcano
    if (ab && ab.usosPorCombate && habilidadeId !== 'golpe_sagrado') h.usos[habilidadeId] = (h.usos[habilidadeId] || 0) + 1;
    if (ab && ab.circulo && h.foco !== null && h.foco !== undefined) h.foco -= ab.circulo;
    h.atb = 0;
    h.desprevenido = false;
    c.aguardando = null;
    this._avancarTurno();
    UICombate.render();
  },

  /* Ativa um item de gatilho (D&D 3.5: dispara a magia sem teste, se a magia
     está na lista da classe). Retorna false se a ação não pôde acontecer. */
  _usarGatilho(h, itemId, alvo) {
    const def = GameData.get('items')[itemId];
    if (!def || def.tipo !== 'gatilho') return false;
    if (!def.quem.includes(h.id)) {
      this.logar(`🚫 ${this._nome(h)} sacode ${def.nome} — nada. Itens de gatilho exigem a magia na LISTA DA CLASSE (D&D 3.5). Quem ativa: ${def.quem.join(', ')}.`);
      return false;
    }
    const cargas = Engine.estado.cargas[itemId] || 0;
    if (cargas <= 0) { this.logar(`⚡ ${def.nome} está sem cargas — virou um graveto caro.`); return false; }
    Engine.estado.cargas[itemId] = cargas - 1;
    const g = def.gatilho;
    if (g.cura) {
      const c = this.c;
      const feridos = c.herois.filter(x => !this._tem(x, 'petrificado') && Engine.estado.pv[x.id] < x.stats.pvMax);
      const alvoCura = feridos.sort((a, b) => (Engine.estado.pv[a.id] / a.stats.pvMax) - (Engine.estado.pv[b.id] / b.stats.pvMax))[0] || h;
      const ganho = this._curar(alvoCura, this.rolarDado(g.cura));
      this.logar(`⚡ ${this._nome(h)} ativa ${def.nome}: +${ganho} PV em ${this._nome(alvoCura)}. (${Engine.estado.cargas[itemId]} cargas)`);
    } else if (g.area) {
      this.logar(`⚡ ${this._nome(h)} ergue ${def.nome} — a palavra de comando incendeia o ar!`);
      for (const e of this.c.inimigos) {
        if (e.morto || e.fugiu) continue;
        let d = this.rolarDado(g.dano);
        let txt = '';
        if (g.salvamento && this._salvarInimigo(e, g.cd || 14)) { d = Math.floor(d / 2); txt = ' (salvou: metade)'; }
        this._ferir(e, d, def.nome);
        this.logar(`   🔥 ${e.apelido} sofre ${d}${txt}.`);
      }
      this.logar(`   (${Engine.estado.cargas[itemId]} cargas restantes)`);
    } else {
      const d = this.rolarDado(g.dano);
      this._ferir(alvo, d, def.nome);
      this.logar(`⚡ ${this._nome(h)} ativa ${def.nome}: ${d} de dano em ${alvo.apelido}${g.automatico ? ' — sem chance de errar' : ''}. (${Engine.estado.cargas[itemId]} cargas)`);
    }
    return true;
  },

  alternarDesvio() {
    const h = this.heroiPronto();
    if (!h) return;
    h.desviando = !h.desviando;
    this.logar(h.desviando
      ? `👁️ ${this._nome(h)} DESVIA OS OLHOS (imune ao olhar; -4 no acerto). Não gasta a ação.`
      : `👁️ ${this._nome(h)} volta a olhar direto (acerto normal; vulnerável ao olhar).`);
    UICombate.render();
  },

  tentarFugir() {
    const c = this.c;
    const h = this.heroiPronto();
    if (!h) return;
    if (Math.random() < 0.5) {
      this.logar('🏃 A party escapa pelo cascalho!');
      this.terminar('fuga');
    } else {
      this.logar('🏃 A fuga falha — os inimigos cortam o caminho!');
      h.atb = 0; c.aguardando = null;
      this._avancarTurno();
    }
  },

  alternarAuto() {
    this.c.auto = !this.c.auto;
    this.logar(this.c.auto ? '⚡ Auto-batalha LIGADA.' : '⚡ Auto-batalha desligada.');
    if (this.c.auto && this.c.aguardando !== null) this._agirAuto(this.heroiPronto());
    UICombate.render();
  },

  _agirAuto(h) {
    const c = this.c;
    const vivos = c.inimigos.map((e, i) => ({ e, i })).filter(x => !x.e.morto && !x.e.fugiu);
    if (!vivos.length) return;
    const sabe = (id) => h.ref.habilidadesCombate.includes(id);
    const podeUso = (id) => { const ab = GameData.get('abilities')[id]; return !ab.usosPorCombate || (h.usos[id] || 0) < ab.usosPorCombate; };
    const temFoco = (id) => { const ab = GameData.get('abilities')[id]; return !ab.circulo || (h.foco || 0) >= ab.circulo; };
    // desviar os olhos automaticamente em luta com olhar
    if (c.enc.olharAtivo && !h.desviando) h.desviando = true;
    // poção se estiver mal e tiver
    if (Engine.estado.pv[h.id] < h.stats.pvMax * 0.45 && Engine.estado.inventario.includes('pocao_cura_leve')) {
      this.agir('usar_pocao'); return;
    }
    // paladino: cura aliado muito ferido; golpes sagrados no chefe
    if (h.id === 'paladino') {
      const feridos = c.herois.filter(x => !this._estaFora(x) && Engine.estado.pv[x.id] < x.stats.pvMax * 0.35).length;
      if (feridos >= 2 && sabe('clamor_triuni') && podeUso('clamor_triuni')) { this.agir('clamor_triuni'); return; }
      if (feridos && Engine.estado.reservaImpor > 3) { this.agir('impor_maos'); return; }
      const chefe = vivos.find(x => x.e.chefe);
      if (chefe && sabe('punicao_celestial') && podeUso('punicao_celestial')) { this.agir('punicao_celestial', chefe.i); return; }
      if (chefe && (h.usos.golpe_sagrado || 0) < this._limiteGolpe(h)) { this.agir('golpe_sagrado', chefe.i); return; }
      if (sabe('baluarte') && podeUso('baluarte') && c.rodada === 1 && vivos.length >= 2) { this.agir('baluarte'); return; }
    }
    // vapor da forja no momento certo
    if (c.enc.forjaInstavel && !c.forjaUsada) { this.agir('forja'); return; }
    // ladino: prestígio primeiro, senão faca
    if (h.id === 'ladino') {
      const aberto = vivos.find(x => this._tem(x.e, 'atordoado') || this._tem(x.e, 'petrificando'));
      if (sabe('ataque_mortal') && podeUso('ataque_mortal') && (aberto || this._tem(h, 'oculto'))) {
        this.agir('ataque_mortal', (aberto || vivos.sort((a, b) => b.e.pv - a.e.pv)[0]).i); return;
      }
      if (sabe('passo_sombrio') && podeUso('passo_sombrio') && !this._tem(h, 'oculto') && vivos.some(x => x.e.chefe)) {
        this.agir('passo_sombrio'); return;
      }
    }
    // maga: magias por prioridade de situação
    if (h.id === 'maga') {
      if (sabe('explosao_arcana') && podeUso('explosao_arcana') && vivos.length >= 3) { this.agir('explosao_arcana'); return; }
      if (sabe('bola_de_fogo') && temFoco('bola_de_fogo') && vivos.length >= 3) { this.agir('bola_de_fogo'); return; }
      if (sabe('tempestade_de_gelo') && temFoco('tempestade_de_gelo') && vivos.length >= 3) { this.agir('tempestade_de_gelo'); return; }
      if (sabe('velocidade') && temFoco('velocidade') && c.rodada === 1 && vivos.some(x => x.e.chefe) && !this._tem(h, 'acelerado')) { this.agir('velocidade'); return; }
      if (sabe('sono_profundo') && temFoco('sono_profundo') && vivos.filter(x => !x.e.chefe).length >= 2) { this.agir('sono_profundo'); return; }
      if (sabe('toque_vampirico') && temFoco('toque_vampirico') && Engine.estado.pv[h.id] < h.stats.pvMax * 0.6) {
        this.agir('toque_vampirico', vivos.sort((a, b) => a.e.pv - b.e.pv)[0].i); return;
      }
      if (sabe('conflagracao') && temFoco('conflagracao') && vivos.some(x => x.e.chefe)) {
        this.agir('conflagracao', vivos.find(x => x.e.chefe).i); return;
      }
      if (sabe('misseis_magicos') && temFoco('misseis_magicos')) {
        const alvoM = vivos.sort((a, b) => a.e.pv - b.e.pv)[0];
        this.agir('misseis_magicos', alvoM.i); return;
      }
    }
    const alvo = vivos.sort((a, b) => a.e.pv - b.e.pv)[0]; // foca o mais ferido
    this.agir('atacar', alvo.i);
  },

  /* ---------- Turno inimigo ---------- */
  turnoInimigo(e) {
    const c = this.c;
    e.atb = 0;
    if (!this._processarInicioTurno(e)) { UICombate.render(); return; }

    // script de fuga (Nessian)
    if (e.script && e.script.fogeEmPv && e.pv <= e.pvMax * e.script.fogeEmPv && !e.fugiu) {
      e.fugiu = true;
      this.logar('🐺 ' + e.script.msgFuga);
      this._avancarTurno();
      UICombate.render();
      return;
    }

    e.acoes++;
    const heroisTodos = c.herois.filter(h => !this._estaFora(h));
    if (!heroisTodos.length) { this._checarFim(); return; }
    // heróis OCULTOS não são alvejáveis (a menos que só reste sombra)
    const alvejaveis = heroisTodos.filter(h => !this._tem(h, 'oculto'));
    const herois = alvejaveis.length ? alvejaveis : heroisTodos;

    // habilidade especial a cada N ações (sorteia entre as que o monstro tem)
    const abId = (e.habilidades && e.habilidades.length && e.acoes > 1 && e.acoes % (e.cadaN || 3) === 0)
      ? e.habilidades[Math.floor(Math.random() * e.habilidades.length)] : null;
    if (abId) {
      const ab = GameData.get('abilities')[abId];
      if (ab.tipo === 'area') {
        this.logar(`🔥 ${e.apelido} usa ${ab.nome}!`);
        for (const h of herois) {
          let d = this.rolarDado(ab.dado);
          const s = this._salvarHeroi(h, ab.salvamento, ab.cd);
          if (s.passou) d = (h.id === 'ladino' && ab.salvamento === 'reflexos') ? 0 : Math.floor(d / 2); // Evasão (só reflexos)
          if (d > 0) this._ferir(h, d, ab.nome);
          else UICombate.flutuar(h, 'evadiu!', 'erro');
          this.logar(`   ${this._nome(h)} ${s.passou ? 'salva (' + s.total + ' vs CD ' + ab.cd + ')' : 'falha no salvamento'} — ${d} de dano.`);
        }
      } else if (ab.tipo === 'aura') {
        this.logar(`😨 ${e.apelido} irradia ${ab.nome}!`);
        for (const h of herois) {
          const s2 = this._salvarHeroi(h, ab.salvamento, ab.cd);
          if (s2.passou) this.logar(`   ${this._nome(h)} firma a mente (${s2.total} vs CD ${ab.cd}).`);
          else {
            this._aplicar(h, ab.condicao, ab.duracao || 2);
            this.logar(`   ${this._nome(h)} é tomado pelo desespero — ABALADO (-2 no acerto)!`);
          }
        }
      } else if (ab.tipo === 'olhar') {
        const alvos = herois.filter(h => !h.desviando);
        if (!alvos.length) this.logar(`👁️ ${e.apelido} varre a caverna com o olhar — mas todos desviam os olhos!`);
        else {
          const h = alvos[Math.floor(Math.random() * alvos.length)];
          const s = this._salvarHeroi(h, ab.salvamento, ab.cd);
          if (s.passou) this.logar(`👁️ O olhar cai sobre ${this._nome(h)} — Fortitude ${s.total} vs CD ${ab.cd}: RESISTE! A pele arrepia como cascalho.`);
          else {
            const r = this._aplicar(h, 'petrificando');
            if (r === 'petrificado') this.logar(`🗿 ${this._nome(h)} VIRA PEDRA! (fora do combate — reverte na vitória)`);
            else this.logar(`👁️ ${this._nome(h)} sente os membros ENDURECEREM (petrificando ${r === 'petrificando2' ? '2/2' : '1/2'})... desvie os olhos!`);
          }
        }
      } else if (ab.tipo === 'ataque_pesado') {
        const h = herois[Math.floor(Math.random() * herois.length)];
        this.logar(`🪨 ${e.apelido} usa ${ab.nome}!`);
        const acertou = this._atacarAlvo(e, h, { dado: ab.dado, bonusDano: 0 });
        if (acertou && ab.aplica && Math.random() < ab.aplica.chance) {
          this._aplicar(h, ab.aplica.condicao, ab.aplica.duracao);
          this.logar(`   ${ab.aplica.condicao === 'queimando' ? '🔥 ' + this._nome(h) + ' está QUEIMANDO!' : '💫 ' + this._nome(h) + ' APAGA — perde a próxima ação!'}`);
        }
      } else if (ab.tipo === 'cura_aliada') {
        const aliados = c.inimigos.filter(x => !x.morto && !x.fugiu && x.pv < x.pvMax);
        const quem = aliados.sort((a, b) => (a.pv / a.pvMax) - (b.pv / b.pvMax))[0];
        if (quem) {
          const g = Math.min(quem.pvMax - quem.pv, this.rolarDado(ab.dado));
          quem.pv += g;
          UICombate.flutuar(quem, '+' + g, 'cura');
          this.logar(`🔮 ${e.apelido} usa ${ab.nome}: ${quem.apelido} recupera ${g} PV.`);
        } else {
          const h = herois[Math.floor(Math.random() * herois.length)];
          this._atacarAlvo(e, h, { dado: e.dano, bonusDano: 0 });
        }
      }
    } else {
      const h = herois[Math.floor(Math.random() * herois.length)];
      this._atacarAlvo(e, h, { dado: e.dano, bonusDano: 0 });
    }
    this._avancarTurno();
    UICombate.render();
  },

  /* ---------- Scripts de encontro ---------- */
  _rodarScripts() {
    const c = this.c;
    for (const s of (c.enc.scripts || [])) {
      const chave = s.tipo + s.valor;
      if (c.scriptsFeitos.includes(chave)) continue;
      if (s.quando === 'rodada' && c.rodada >= s.valor) {
        c.scriptsFeitos.push(chave);
        if (s.tipo === 'entraHeroi') {
          Engine.recrutarHeroi(s.heroi);
          c.herois.push(this._montarHeroi(s.heroi));
          this.logar(s.msg);
          UICombate.flutuar(c.herois[c.herois.length - 1], 'ENTROU!', 'cura');
        }
      }
    }
  },

  /* ---------- Fim de combate ---------- */
  _checarFim() {
    const c = this.c;
    if (c.terminado) return;
    const inimigosDePe = c.inimigos.filter(e => !e.morto && !e.fugiu).length;
    const heroisDePe = c.herois.filter(h => !this._estaFora(h)).length;
    if (inimigosDePe === 0) this.terminar('vitoria');
    else if (heroisDePe === 0) this.terminar('derrota');
  },

  terminar(resultado) {
    const c = this.c;
    c.terminado = true;
    this.pararRelogio();

    let premio = null;
    if (resultado === 'vitoria') {
      const r = c.enc.recompensa;
      const ouro = Loot.rolarOuro(r.ouro);
      const drops = [];
      const tabela = GameData.get('loot').tabelaDrop[c.enc.tier] || GameData.get('loot').tabelaDrop.baixo;
      for (let i = 0; i < (r.drops || 0); i++) {
        if (Math.random() < tabela.chanceDrop) drops.push(Loot.gerarItem(c.enc.iLvl, c.enc.tier));
      }
      const fixos = (r.fixos || []).map(id => GameData.get('items')[id]).filter(Boolean);
      const g = Engine.ganharXp(r.xp);
      Engine.estado.ouro += ouro;
      for (const d of drops) Engine.estado.mochila.push(d);
      for (const f of fixos) if (!Engine.estado.inventario.includes(f.id)) Engine.estado.inventario.push(f.id);
      // respiro pós-vitória: todos recuperam 20% do PV máximo (caídos acordam)
      for (const h of c.herois) {
        h.condicoes = [];
        const rec = Math.ceil(h.stats.pvMax * 0.2);
        Engine.estado.pv[h.id] = Math.min(h.stats.pvMax, Math.max(0, Engine.estado.pv[h.id]) + rec);
        h.caido = false;
      }
      premio = { xp: r.xp, subiu: g && g.subiu, nivel: g ? g.nivel : null, ouro, drops, fixos };
    }
    if (resultado === 'derrota') {
      const perda = Math.floor(Engine.estado.ouro * 0.1);
      Engine.estado.ouro -= perda;
      Engine.curarTudo();
      premio = { perda };
    }
    if (resultado === 'fuga') {
      for (const h of c.herois) { h.condicoes = []; if (Engine.estado.pv[h.id] <= 0) Engine.estado.pv[h.id] = 1; }
    }
    UICombate.telaFim(resultado, premio);
  },

  logar(msg) {
    if (!this.c) return;
    this.c.log.push(msg);
    if (this.c.log.length > 60) this.c.log.shift();
  }
};
