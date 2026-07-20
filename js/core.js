/* =====================================================
   OZEIN RPG — js/core.js
   Núcleo: registro de dados, regras d20 (D&D 3.5) e
   sistema de saves em MÚLTIPLOS SLOTS (v0.4).
   Carrega ANTES dos arquivos de dados.
   ===================================================== */
'use strict';

/* ---------- Registro central de dados ---------- */
const GameData = {
  _store: {},
  register(chave, dados) { this._store[chave] = dados; },
  get(chave) { return this._store[chave]; }
};

/* ---------- Regras d20 (D&D 3.5 SRD) ---------- */
const Regras = {
  rolar(faces) { return Math.floor(Math.random() * faces) + 1; },
  d20() { return this.rolar(20); },

  mod(valorAtributo) { return Math.floor((valorAtributo - 10) / 2); },

  fmtMod(m) { return (m >= 0 ? '+' : '') + m; },

  teste(heroi, { atributo, pericia, cd }) {
    const dado = this.d20();
    let bonus = 0, rotulo = '';
    if (pericia) {
      bonus = (heroi.pericias && heroi.pericias[pericia]) || 0;
      rotulo = pericia.replace(/_/g, ' ');
    } else if (atributo) {
      bonus = this.mod(heroi.atributos[atributo]);
      rotulo = GameData.get('config').regras.nomesAtributos[atributo] || atributo;
    }
    const total = dado + bonus;
    return {
      dado, bonus, total, cd, rotulo,
      sucesso: dado === 20 || (dado !== 1 && total >= cd),
      critico: dado === 20,
      desastre: dado === 1
    };
  },

  nivelPorXp(xp) {
    const tabela = GameData.get('config').regras.xpPorNivel;
    let nivel = 1;
    for (let n = 2; n < tabela.length; n++) if (xp >= tabela[n]) nivel = n;
    return nivel;
  }
};

/* ---------- Sistema de saves em slots ----------
   4 slots independentes (jogadores diferentes).
   localStorage quando disponível (Chrome/Edge aceitam em file://);
   fallback em memória + exportar/importar arquivo .json. */
const SaveSystem = {
  N_SLOTS: 8,
  PREFIXO: 'ozein-rpg-slot-',
  CHAVE_ANTIGA: 'ozein-rpg-save-v01',
  _memoria: {},

  disponivel() {
    try {
      localStorage.setItem('__ozein_teste', '1');
      localStorage.removeItem('__ozein_teste');
      return true;
    } catch (e) { return false; }
  },

  /* Save único das versões anteriores vira o Slot 1 */
  migrarLegado() {
    if (!this.disponivel()) return;
    try {
      const antigo = localStorage.getItem(this.CHAVE_ANTIGA);
      if (antigo && !localStorage.getItem(this.PREFIXO + '1')) {
        localStorage.setItem(this.PREFIXO + '1', antigo);
        localStorage.removeItem(this.CHAVE_ANTIGA);
      }
    } catch (e) { /* segue */ }
  },

  _ler(slot) {
    let pacote = null;
    if (this.disponivel()) pacote = localStorage.getItem(this.PREFIXO + slot);
    if (!pacote) pacote = this._memoria[slot] || null;
    if (!pacote) return null;
    try { return JSON.parse(pacote); } catch (e) { return null; }
  },

  salvar(estado) {
    const slot = estado.slot || 1;
    const pacote = JSON.stringify({ v: GameData.get('config').versao, quando: new Date().toISOString(), estado });
    this._memoria[slot] = pacote;
    if (this.disponivel()) {
      try { localStorage.setItem(this.PREFIXO + slot, pacote); return 'disco'; } catch (e) { /* fallback */ }
    }
    return 'memoria';
  },

  carregar(slot) {
    const dados = this._ler(slot);
    return dados ? dados.estado : null;
  },

  apagar(slot) {
    delete this._memoria[slot];
    if (this.disponivel()) { try { localStorage.removeItem(this.PREFIXO + slot); } catch (e) {} }
  },

  existe(slot) { return !!this._ler(slot); },

  algumSave() {
    for (let s = 1; s <= this.N_SLOTS; s++) if (this.existe(s)) return true;
    return false;
  },

  /* Resumo de cada slot pra tela de título */
  listarSlots() {
    const slots = [];
    for (let s = 1; s <= this.N_SLOTS; s++) {
      const dados = this._ler(s);
      if (!dados || !dados.estado) { slots.push({ slot: s, vazio: true }); continue; }
      const e = dados.estado;
      const m1 = e.missoes && e.missoes.missao1;
      slots.push({
        slot: s,
        vazio: false,
        nome: e.nomeJogador || 'Aventureiro',
        nivel: Regras.nivelPorXp(e.xp || 0),
        ouro: e.ouro || 0,
        party: (e.party || []).length,
        progresso: e.flags && e.flags.v01Completa ? 'Missão 1 concluída ✓'
          : (m1 ? 'Missão 1 — ' + ((m1.etapasFeitas || []).length) + '/6 etapas' : 'Início da jornada'),
        quando: dados.quando ? new Date(dados.quando).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'
      });
    }
    return slots;
  },

  exportar(estado) {
    const pacote = JSON.stringify({ v: GameData.get('config').versao, quando: new Date().toISOString(), estado }, null, 2);
    const blob = new Blob([pacote], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ozein-save-${(estado.nomeJogador || 'jogador').toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  },

  importar(arquivo, aoTerminar) {
    const leitor = new FileReader();
    leitor.onload = () => {
      try {
        const dados = JSON.parse(leitor.result);
        aoTerminar(dados.estado || null);
      } catch (e) { aoTerminar(null); }
    };
    leitor.readAsText(arquivo);
  }
};
