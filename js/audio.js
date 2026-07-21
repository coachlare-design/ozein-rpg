/* =====================================================
   OZEIN RPG — js/audio.js
   Trilha sonora sintetizada em WebAudio — zero arquivos,
   100% offline. Quatro temas compostos em código:
   · 'cidade'  — O Jarro Dourado (acolhedor, esperançoso)
   · 'estrada' — Passos em Renânia (aventura em marcha)
   · 'minas'   — Profundezas Selada (tenso, cavernoso)
   · 'combate' — Aço e Brasa (percussivo, urgente)
   O navegador só libera áudio após o 1º clique — o motor
   espera esse gesto sozinho.
   ===================================================== */
'use strict';

const Musica = {
  ctx: null,
  master: null,
  temaAtual: null,
  temaPedido: null,
  _timer: null,
  _passo: 0,
  _proximaNota: 0,
  ligada: true,
  volume: 0.42,

  /* ---------- Temas (dados de composição) ---------- */
  // Notas em Hz (calculadas por semitons a partir de A2=110)
  _hz(semitonsDeA2) { return 110 * Math.pow(2, semitonsDeA2 / 12); },

  temas: {
    cidade: {
      bpm: 72, passosPorCompasso: 8,
      // Ré maior acolhedor: D A Bm G (I V vi IV)
      acordes: [[5, 9, 12], [12, 16, 19], [14, 17, 21], [10, 14, 17]],
      baixo: [-7, 0, 2, -2],
      arpejo: true, arpejoOitava: 12, brilho: 1800,
      pad: .16, plk: .12, bx: .16, perc: 0
    },
    estrada: {
      bpm: 104, passosPorCompasso: 8,
      // Lá menor decidido: Am F C G
      acordes: [[0, 3, 7], [-4, 0, 5], [3, 7, 10], [-2, 2, 5]],
      baixo: [0, -4, 3, -2],
      arpejo: true, arpejoOitava: 12, brilho: 1500,
      pad: .12, plk: .15, bx: .2, perc: .10, percPadrao: [1, 0, 0, 0, 1, 0, 1, 0]
    },
    minas: {
      bpm: 54, passosPorCompasso: 8,
      // Ré menor cavernoso: Dm Bb Dm A(baixo)
      acordes: [[5, 8, 12], [1, 5, 8], [5, 8, 12], [0, 4, 7]],
      baixo: [-19, -23, -19, -24],
      arpejo: false, sino: true, brilho: 900,
      pad: .17, plk: .10, bx: .22, perc: 0
    },
    combate: {
      bpm: 142, passosPorCompasso: 8,
      // Mi menor urgente: Em C D Em
      acordes: [[7, 10, 14], [3, 7, 10], [5, 9, 12], [7, 10, 14]],
      baixo: [-5, -9, -7, -5],
      arpejo: false, riff: [0, 0, 12, 0, 10, 0, 7, 8], brilho: 2200,
      pad: .10, plk: .17, bx: .25, perc: .22, percPadrao: [2, 0, 1, 1, 2, 0, 1, 1]
    }
  },

  /* ---------- Boot (espera o 1º gesto do usuário) ---------- */
  armar() {
    try {
      const pref = localStorage.getItem('ozein-audio');
      if (pref) { const p = JSON.parse(pref); this.ligada = p.ligada !== false; if (p.volume) this.volume = p.volume; }
    } catch (e) {}
    const iniciar = () => {
      if (!this.ctx) {
        try {
          this.ctx = new (window.AudioContext || window.webkitAudioContext)();
          this.master = this.ctx.createGain();
          this.master.gain.value = this.ligada ? this.volume : 0;
          this.master.connect(this.ctx.destination);
          this._ligarRelogio();
        } catch (e) { console.warn('WebAudio indisponível:', e); }
      }
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    };
    window.addEventListener('pointerdown', iniciar, { once: false });
    window.addEventListener('keydown', iniciar, { once: false });
  },

  _salvarPref() {
    try { localStorage.setItem('ozein-audio', JSON.stringify({ ligada: this.ligada, volume: this.volume })); } catch (e) {}
  },

  alternar() {
    this.ligada = !this.ligada;
    if (this.master) this.master.gain.linearRampToValueAtTime(this.ligada ? this.volume : 0, this.ctx.currentTime + 0.3);
    this._salvarPref();
    return this.ligada;
  },

  /* ---------- Troca de tema ---------- */
  tocar(temaId) {
    if (this.temaPedido === temaId) return;
    this.temaPedido = temaId;
    this._passo = 0; // recomeça o compasso do tema novo
  },

  _ligarRelogio() {
    this._proximaNota = this.ctx.currentTime + 0.1;
    this._timer = setInterval(() => this._agendar(), 90);
  },

  /* Agendador com lookahead — troca suave de tema entre passos */
  _agendar() {
    if (!this.ctx || !this.temaPedido) return;
    const LOOKAHEAD = 0.25;
    while (this._proximaNota < this.ctx.currentTime + LOOKAHEAD) {
      if (this.temaAtual !== this.temaPedido) { this.temaAtual = this.temaPedido; this._passo = 0; }
      const t = this.temas[this.temaAtual];
      if (!t) return;
      this._tocarPasso(t, this._passo, this._proximaNota);
      this._proximaNota += (60 / t.bpm) / 2; // colcheias
      this._passo++;
    }
  },

  /* ---------- Síntese ---------- */
  _nota(freq, quando, dur, tipo, ganho, brilho) {
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    const f = this.ctx.createBiquadFilter();
    o.type = tipo; o.frequency.value = freq;
    f.type = 'lowpass'; f.frequency.value = brilho || 1500;
    g.gain.setValueAtTime(0.0001, quando);
    g.gain.linearRampToValueAtTime(ganho, quando + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, quando + dur);
    o.connect(f); f.connect(g); g.connect(this.master);
    o.start(quando); o.stop(quando + dur + 0.05);
  },

  _percussao(quando, forte, ganho) {
    // bumbo = seno grave com pitch caindo; chimbal = ruído curto
    if (forte === 2) {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(120, quando);
      o.frequency.exponentialRampToValueAtTime(40, quando + 0.12);
      g.gain.setValueAtTime(ganho * 2.4, quando);
      g.gain.exponentialRampToValueAtTime(0.0001, quando + 0.16);
      o.connect(g); g.connect(this.master);
      o.start(quando); o.stop(quando + 0.2);
    } else {
      const dur = 0.05;
      const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * dur, this.ctx.sampleRate);
      const dados = buf.getChannelData(0);
      for (let i = 0; i < dados.length; i++) dados[i] = (Math.random() * 2 - 1) * (1 - i / dados.length);
      const src = this.ctx.createBufferSource();
      const g = this.ctx.createGain();
      const f = this.ctx.createBiquadFilter();
      f.type = 'highpass'; f.frequency.value = 5000;
      src.buffer = buf;
      g.gain.value = ganho;
      src.connect(f); f.connect(g); g.connect(this.master);
      src.start(quando);
    }
  },

  _tocarPasso(t, passo, quando) {
    const passoNoCompasso = passo % t.passosPorCompasso;
    const compasso = Math.floor(passo / t.passosPorCompasso) % t.acordes.length;
    const acorde = t.acordes[compasso];
    const dur = (60 / t.bpm);

    // PAD — acorde sustentado no 1º passo do compasso
    if (passoNoCompasso === 0 && t.pad) {
      for (const st of acorde) this._nota(this._hz(st + 12), quando, dur * 4.2, 'triangle', t.pad, t.brilho * 0.7);
    }
    // BAIXO — no 1 e no 5
    if ((passoNoCompasso === 0 || passoNoCompasso === 4) && t.bx) {
      this._nota(this._hz(t.baixo[compasso]), quando, dur * 1.6, 'sawtooth', t.bx, 700);
    }
    // ARPEJO — dedilhado subindo (cidade/estrada)
    if (t.arpejo && t.plk) {
      const seq = [0, 1, 2, 1];
      const st = acorde[seq[passoNoCompasso % 4]] + (passoNoCompasso >= 4 ? t.arpejoOitava : 0);
      this._nota(this._hz(st + 12), quando, dur * 0.9, 'triangle', t.plk, t.brilho);
    }
    // RIFF de combate — ostinato marcado
    if (t.riff && t.plk) {
      const st = t.riff[passoNoCompasso];
      if (st !== null) this._nota(this._hz(st), quando, dur * 0.55, 'square', t.plk, t.brilho);
    }
    // SINO das minas — nota esparsa e fria (a cada 2 compassos)
    if (t.sino && passoNoCompasso === 6 && compasso % 2 === 0) {
      this._nota(this._hz(acorde[2] + 24), quando, dur * 3, 'sine', 0.12, 4000);
    }
    // PERCUSSÃO
    if (t.perc && t.percPadrao) {
      const p = t.percPadrao[passoNoCompasso];
      if (p) this._percussao(quando, p, t.perc);
    }
  },

  /* Contexto de cena → tema (as 3 ambientações se revezam pelo lugar) */
  porCenario(caminhoImagem) {
    if (!caminhoImagem) return;
    const c = String(caminhoImagem);
    if (c.includes('cidade')) this.tocar('cidade');
    else if (c.includes('estrada') || c.includes('encosta') || c.includes('porto') || c.includes('ubia-vista')) this.tocar('estrada');
    else this.tocar('minas'); // mina, caverna, forja, masmorra, subsolo, batalha
  }
};

Musica.armar();
