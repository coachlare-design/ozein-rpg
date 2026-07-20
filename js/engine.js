/* =====================================================
   OZEIN RPG — js/engine.js
   O motor: estado do jogo, interpretador de efeitos,
   progressão no mapa de nós, party e ciclo de cena.
   Carrega DEPOIS dos dados, ANTES da UI.
   ===================================================== */
'use strict';

const Engine = {
  estado: null,
  VERSAO_SAVE: 5,

  /* ---------- Estado inicial (Novo Jogo) ---------- */
  novoJogo(nomeJogador, slot) {
    this.estado = {
      versaoSave: this.VERSAO_SAVE,
      nomeJogador: nomeJogador || 'Aventureiro',
      slot: slot || 1,
      party: [],
      ativo: 'paladino',
      herois: {},
      pv: {},
      equips: {},
      xp: GameData.get('heroes').paladino.xp,
      ouro: 50,
      inventario: ['pocao_cura_leve', 'pocao_cura_leve'],
      mochila: [],            // itens gerados (loot)
      reservaImpor: 0,
      missoes: {},            // id -> { aceita, etapasFeitas, concluida }
      codex: [],
      flags: {},
      nosConcluidos: [],
      dialogosVistos: [],
      local: 'cidade',
      contadorDescansos: 0,
      estudos: {}            // pergaminho de magia -> nº do descanso da última tentativa
    };
    this.recrutarHeroi('paladino');
    this.estado.reservaImpor = this._reservaMaxima();
    return this.estado;
  },

  recrutarHeroi(id) {
    if (this.estado.party.includes(id)) return;
    const base = GameData.get('heroes')[id];
    const h = JSON.parse(JSON.stringify(base));
    this.estado.party.push(id);
    this.estado.herois[id] = h;
    this.estado.equips[id] = this._equipInicial(h);
    const stats = Loot.statsHeroi(h, this.estado.equips[id]);
    this.estado.pv[id] = stats.pvMax;
  },

  _equipInicial(h) {
    const itens = GameData.get('items');
    const equip = { arma: null, armadura: null, escudo: null, elmo: null, amuleto: null, anel1: null, anel2: null, botas: null };
    for (const iid of (h.equipamento || [])) {
      const def = itens[iid];
      if (!def || !def.slot) continue;
      const it = JSON.parse(JSON.stringify(def));
      it.uid = 'ini_' + iid;
      let slot = it.slot === 'anel' ? (equip.anel1 ? 'anel2' : 'anel1') : it.slot;
      if (!equip[slot]) equip[slot] = it;
    }
    return equip;
  },

  _reservaMaxima() {
    const p = this.estado.herois.paladino;
    if (!p) return 0;
    return Regras.nivelPorXp(this.estado.xp) * Math.max(1, Regras.mod(p.atributos.CAR));
  },

  heroiAtivo() { return this.estado.herois[this.estado.ativo]; },
  statsAtivo() { return Loot.statsHeroi(this.heroiAtivo(), this.estado.equips[this.estado.ativo]); },
  pvAtivo() { return this.estado.pv[this.estado.ativo]; },
  pvMax() { return this.statsAtivo().pvMax; },

  ganharXp(qtd) {
    if (!qtd) return null;
    const antes = Regras.nivelPorXp(this.estado.xp);
    this.estado.xp += qtd;
    const depois = Regras.nivelPorXp(this.estado.xp);
    if (depois > antes) this._aplicarNivel(antes, depois);
    return { qtd, subiu: depois > antes, nivel: depois };
  },

  /* Subir de nível: +PV por classe, +1 BBA, salvamentos alternados.
     Simplificado do 3.5 pra videogame — a party sobe junta (pool de XP). */
  _aplicarNivel(antes, depois) {
    const dvPorClasse = { 'Paladino': 10, 'Ladino': 6, 'Maga (Evocadora)': 4 };
    for (const id of Object.keys(this.estado.herois)) {
      const h = this.estado.herois[id];
      for (let n = antes; n < depois; n++) {
        const dv = dvPorClasse[h.classe] || 6;
        const ganhoPv = Math.max(1, Math.floor(dv / 2) + 1 + Regras.mod(h.atributos.CON));
        h.pvBase += ganhoPv;
        h.bba += 1;
        h.nivel = depois;
        if (n % 2 === 0) { h.salvamentos.fortitude += 1; h.salvamentos.reflexos += 1; h.salvamentos.vontade += 1; }
        this.estado.pv[id] = (this.estado.pv[id] || 0) + ganhoPv; // subir de nível revigora
      }
    }
    this.estado.reservaImpor = this._reservaMaxima();
  },

  ajustarPvAoMax() {
    for (const id of this.estado.party) {
      const stats = Loot.statsHeroi(this.estado.herois[id], this.estado.equips[id]);
      this.estado.pv[id] = Math.min(this.estado.pv[id], stats.pvMax);
    }
  },

  sofrerDano(qtd) {
    const id = this.estado.ativo;
    this.estado.pv[id] = Math.max(1, this.estado.pv[id] - qtd); // fora de combate nunca mata
  },

  curarTudo() {
    for (const id of this.estado.party) {
      const stats = Loot.statsHeroi(this.estado.herois[id], this.estado.equips[id]);
      this.estado.pv[id] = stats.pvMax;
    }
  },

  aceitarMissao(id) {
    if (!this.estado.missoes[id]) this.estado.missoes[id] = { aceita: true, etapasFeitas: ['e1'] };
  },

  missaoAtiva() { return !!this.estado.missoes.missao1; },

  marcarEtapa(missaoId, etapaId) {
    const m = this.estado.missoes[missaoId];
    if (m && !m.etapasFeitas.includes(etapaId)) m.etapasFeitas.push(etapaId);
  },

  registrarCodex(entrada) {
    if (!entrada) return false;
    if (this.estado.codex.some(c => c.id === entrada.id)) return false;
    this.estado.codex.push(entrada);
    return true;
  },

  /* ---------- Mapa de nós ---------- */
  vizinhos(noId) {
    const mapa = GameData.get('world').mapa;
    const v = [];
    for (const [a, b] of mapa.arestas) {
      if (a === noId) v.push(b);
      if (b === noId) v.push(a);
    }
    return v;
  },

  estadoDoNo(no) {
    const feitos = this.estado.nosConcluidos;
    if (no.tipo === 'cidade') return 'acessivel';
    if (feitos.includes(no.id)) return 'concluido';
    const viz = this.vizinhos(no.id);
    const aberto = viz.some(v => v === 'no_cidade' || feitos.includes(v));
    return aberto ? 'acessivel' : 'bloqueado';
  },

  concluirNo(noId) {
    if (!this.estado.nosConcluidos.includes(noId)) {
      this.estado.nosConcluidos.push(noId);
      const mapaEtapas = { no_estrada1: 'e2', no_estrada2: 'e2' };
      if (mapaEtapas[noId]) this.marcarEtapa('missao1', mapaEtapas[noId]);
    }
  },

  /* ---------- Interpretador de efeitos ---------- */
  executarEfeitos(efeitos, contexto) {
    const instrucoes = [];
    for (const ef of (efeitos || [])) {
      switch (ef.tipo) {
        case 'dialogo':
          instrucoes.push({ ui: 'abrirDialogo', id: ef.valor });
          break;
        case 'voltarCidade':
          this.estado.local = 'cidade';
          instrucoes.push({ ui: 'cidade' });
          break;
        case 'irMapa':
          this.estado.local = 'mapa';
          instrucoes.push({ ui: 'mapa' });
          break;
        case 'aceitarMissao':
          this.aceitarMissao(ef.valor);
          instrucoes.push({ ui: 'toast', texto: '📜 Missão aceita: ' + GameData.get('quests')[ef.valor].nome });
          break;
        case 'teste': {
          const stats = this.statsAtivo();
          const heroiComItens = { ...this.heroiAtivo(), atributos: stats.atributos };
          const r = Regras.teste(heroiComItens, ef);
          instrucoes.push({ ui: 'resultadoTeste', resultado: r, proximo: r.sucesso ? ef.sucesso : ef.falha });
          break;
        }
        case 'fecharCena':
          if (contexto && contexto.noId) this.concluirNo(contexto.noId);
          this.estado.local = 'mapa';
          instrucoes.push({ ui: 'mapa' });
          break;
        case 'sairCena':
          this.estado.local = 'mapa';
          instrucoes.push({ ui: 'mapa' });
          break;
        case 'combate':
          instrucoes.push({ ui: 'combate', id: ef.valor, farm: !!ef.farm });
          break;
        case 'loja':
          instrucoes.push({ ui: 'loja' });
          break;
        case 'previaCombate':
          instrucoes.push({ ui: 'previaCombate', monstros: ef.valor, noId: contexto ? contexto.noId : null });
          break;
        case 'dano':
          this.sofrerDano(ef.valor);
          instrucoes.push({ ui: 'toast', texto: '💔 −' + ef.valor + ' PV' });
          break;
        case 'ouro':
          this.estado.ouro += ef.valor;
          instrucoes.push({ ui: 'toast', texto: (ef.valor >= 0 ? '💰 +' : '💸 ') + ef.valor + ' po' });
          break;
        case 'flag':
          this.estado.flags[ef.valor] = true;
          break;
        case 'recrutar': {
          this.recrutarHeroi(ef.valor);
          instrucoes.push({ ui: 'toast', texto: '🎉 ' + this.estado.herois[ef.valor].nome + ' junta-se à party!' });
          break;
        }
        case 'removerConsumivel': {
          const i = this.estado.inventario.indexOf(ef.valor);
          if (i >= 0) this.estado.inventario.splice(i, 1);
          break;
        }
        case 'etapa':
          this.marcarEtapa(ef.missao || 'missao1', ef.valor);
          break;
        case 'concluirMissao': {
          const m = this.estado.missoes[ef.valor];
          if (m) m.concluida = true;
          instrucoes.push({ ui: 'toast', texto: '🏅 MISSÃO CONCLUÍDA: ' + GameData.get('quests')[ef.valor].nome });
          break;
        }
        case 'xp': {
          const g = this.ganharXp(ef.valor);
          instrucoes.push({ ui: 'toast', texto: '✨ +' + ef.valor + ' XP' + (g && g.subiu ? ' — NÍVEL ' + g.nivel + '!' : '') });
          break;
        }
        case 'item': { // consumível/pergaminho por id (items.js)
          const def = GameData.get('items')[ef.valor];
          // pergaminho de magia: não duplica se já tem ou se a magia já foi aprendida
          if (def && def.magia) {
            const maga = this.estado.herois.maga;
            if (this.estado.inventario.includes(ef.valor) || (maga && maga.habilidadesCombate.includes(def.magia))) break;
          }
          this.estado.inventario.push(ef.valor);
          instrucoes.push({ ui: 'toast', texto: '🎁 Item recebido: ' + (def ? def.nome : ef.valor) });
          break;
        }
        case 'itemUnico': { // item ÚNICO do loot.js, direto na mochila, já identificado
          const u = GameData.get('loot').unicos.find(x => x.id === ef.valor);
          const uid = 'dado_' + ef.valor;
          const jaTem = this.estado.mochila.some(x => x.uid === uid) ||
            Object.values(this.estado.equips).some(eq => Object.values(eq).some(x => x && x.uid === uid));
          if (u && !jaTem) {
            const it = JSON.parse(JSON.stringify(u));
            it.raridade = 'unico'; it.gerado = true; it.naoIdentificado = false;
            it.uid = 'dado_' + ef.valor;
            this.estado.mochila.push(it);
            instrucoes.push({ ui: 'toast', texto: '🎁 ITEM ÚNICO recebido: ' + it.nome });
          }
          break;
        }
        case 'abrirPrestigio':
          instrucoes.push({ ui: 'prestigio' });
          break;
      }
    }
    return instrucoes;
  },

  /* ---------- Classes de prestígio ---------- */
  podePrestigio(heroiId) {
    const P = GameData.get('prestige');
    const h = this.estado.herois[heroiId];
    if (!h || h.prestigio) return false;
    return Regras.nivelPorXp(this.estado.xp) >= (P.requisitoNivel || 7);
  },

  aplicarPrestigio(heroiId, prestigioId) {
    const P = GameData.get('prestige');
    const h = this.estado.herois[heroiId];
    const def = (P[heroiId] || []).find(p => p.id === prestigioId);
    if (!h || !def || h.prestigio) return false;
    if (Regras.nivelPorXp(this.estado.xp) < (P.requisitoNivel || 7)) return false;
    h.prestigio = prestigioId;
    h.titulo = def.nome + ' — ' + h.titulo;
    // habilidade nova entra antes de "defender" no menu de combate
    if (def.habilidadeNova && !h.habilidadesCombate.includes(def.habilidadeNova)) {
      const i = h.habilidadesCombate.indexOf('defender');
      h.habilidadesCombate.splice(i >= 0 ? i : h.habilidadesCombate.length, 0, def.habilidadeNova);
    }
    h.habilidades.push({ nome: def.icone + ' ' + def.nome + ' (prestígio)', desc: def.passivaDesc });
    // PV atual acompanha o novo máximo
    const stats = Loot.statsHeroi(h, this.estado.equips[heroiId]);
    this.estado.pv[heroiId] = Math.min(stats.pvMax, this.estado.pv[heroiId] + ((def.bonus && def.bonus.pvExtra) || 0));
    return true;
  },

  /* ---------- Grimório: estudo de magias (regras 3.5 adaptadas) ----------
     Identificar Magia (Spellcraft) CD 15 + círculo; custo em tinta rara
     (100 po × círculo); 1 tentativa por pergaminho POR DESCANSO. */
  estudarMagia(scrollId) {
    const itens = GameData.get('items');
    const scroll = itens[scrollId];
    const maga = this.estado.herois.maga;
    if (!scroll || !scroll.magia || !maga) return { erro: 'Pergaminho inválido.' };
    if (!this.estado.inventario.includes(scrollId)) return { erro: 'Você não tem este pergaminho.' };
    if (maga.habilidadesCombate.includes(scroll.magia)) return { erro: 'Esta magia já está no grimório.' };
    const custo = 100 * (scroll.circulo || 1);
    if (this.estado.ouro < custo) return { erro: `Faltam ${custo - this.estado.ouro} po para a tinta rara (custo: ${custo} po).` };
    if (this.estado.estudos[scrollId] === this.estado.contadorDescansos) {
      return { erro: 'A maga já quebrou a cabeça com este pergaminho neste descanso. Tente no próximo.' };
    }

    this.estado.estudos[scrollId] = this.estado.contadorDescansos;
    this.estado.ouro -= custo; // a tinta gasta na tentativa — sucesso ou não (3.5 é cruel)
    const cd = 15 + (scroll.circulo || 1);
    const dado = Regras.rolar(20);
    const bonus = (maga.pericias.Identificar_Magia || 0) + Math.floor(Regras.nivelPorXp(this.estado.xp) / 2);
    const total = dado + bonus;
    if (dado !== 1 && (dado === 20 || total >= cd)) {
      const i = this.estado.inventario.indexOf(scrollId);
      if (i >= 0) this.estado.inventario.splice(i, 1);
      const iDef = maga.habilidadesCombate.indexOf('defender');
      maga.habilidadesCombate.splice(iDef >= 0 ? iDef : maga.habilidadesCombate.length, 0, scroll.magia);
      return { sucesso: true, dado, total, cd, custo, magia: scroll.magia };
    }
    return { sucesso: false, dado, total, cd, custo };
  },

  /* Efeitos de entrada de um diálogo — só na 1ª visita */
  aoEntrarDialogo(id, dlg) {
    const novidades = [];
    if (this.estado.dialogosVistos.includes(id)) return novidades;
    this.estado.dialogosVistos.push(id);
    if (dlg.efeitoEntrada) {
      for (const ins of this.executarEfeitos(dlg.efeitoEntrada)) novidades.push(ins);
    }
    if (dlg.codex && this.registrarCodex(dlg.codex)) {
      novidades.push({ ui: 'toast', texto: '📖 Diário atualizado: ' + dlg.codex.titulo });
    }
    if (dlg.xp) {
      const g = this.ganharXp(dlg.xp);
      novidades.push({ ui: 'toast', texto: '✨ +' + dlg.xp + ' XP' + (g && g.subiu ? ' — NÍVEL ' + g.nivel + '!' : '') });
    }
    return novidades;
  },

  /* ---------- Save ---------- */
  descansar() {
    this.curarTudo();
    this.estado.reservaImpor = this._reservaMaxima();
    this.estado.contadorDescansos = (this.estado.contadorDescansos || 0) + 1;
    const onde = SaveSystem.salvar(this.estado);
    return onde;
  },

  continuar(slot) {
    const est = SaveSystem.carregar(slot || 1);
    if (!est) return false;
    this.estado = est;
    if (!this.estado.slot) this.estado.slot = slot || 1;
    this._migrarSave();
    // sincroniza retratos com os dados atuais (arte nova vale pra saves antigos)
    for (const id of this.estado.party) {
      const base = GameData.get('heroes')[id];
      if (base && base.retrato) this.estado.herois[id].retrato = base.retrato;
    }
    return true;
  },

  /* Migração de saves antigos (Passe A → Passe B/C) */
  _migrarSave() {
    const e = this.estado;
    if (e.versaoSave === this.VERSAO_SAVE) return;
    if (!e.mochila) e.mochila = [];
    if (!e.equips) {
      e.equips = {};
      for (const id of e.party) e.equips[id] = this._equipInicial(e.herois[id]);
    }
    for (const id of e.party) {
      const h = e.herois[id];
      const base = GameData.get('heroes')[id];
      if (!h.atbVel) h.atbVel = base.atbVel;
      if (!h.habilidadesCombate) h.habilidadesCombate = base.habilidadesCombate;
      if (h.nivel === undefined) h.nivel = Regras.nivelPorXp(e.xp);
    }
    if (e.reservaImpor === undefined) e.reservaImpor = this._reservaMaxima();
    if (!e.flags) e.flags = {};
    if (!e.nomeJogador) e.nomeJogador = 'Aventureiro';
    if (!e.slot) e.slot = 1;
    // v5: grimório e prestígio
    if (e.contadorDescansos === undefined) e.contadorDescansos = 0;
    if (!e.estudos) e.estudos = {};
    e.versaoSave = this.VERSAO_SAVE;
  }
};
