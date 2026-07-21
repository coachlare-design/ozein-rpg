/* =====================================================
   OZEIN RPG — js/ui.js
   Renderização: título, intro, cidade-hub, mapa de nós,
   cenas de diálogo, ficha, diário e prévia de combate.
   ===================================================== */
'use strict';

const UI = {
  raiz: null,
  contextoCena: null, // { noId } quando a cena veio de um nó do mapa

  iniciar() {
    this.raiz = document.getElementById('palco');
    this.telaTitulo();
  },

  limpar() { this.raiz.innerHTML = ''; },

  el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  },

  fundo(img) {
    const f = this.el('div', 'fundo-cena');
    if (img) f.style.backgroundImage = `url('${img}')`;
    else f.style.background = 'radial-gradient(ellipse at 50% 30%, #2a3949, #0d1117)';
    this.raiz.appendChild(f);
    this.raiz.appendChild(this.el('div', 'vinheta-inferior'));
  },

  toast(texto, ms = 2600) {
    const t = document.getElementById('toast');
    t.textContent = texto;
    t.classList.add('ativo');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => t.classList.remove('ativo'), ms);
  },

  filaToasts(instrucoes) {
    const toasts = instrucoes.filter(i => i.ui === 'toast');
    toasts.forEach((t, i) => setTimeout(() => this.toast(t.texto), i * 1400));
  },

  /* ---------- HUD ---------- */
  atualizarHud() {
    const hud = document.getElementById('hud');
    if (!Engine.estado) { hud.classList.remove('ativo'); return; }
    hud.classList.add('ativo');
    const h = Engine.heroiAtivo();
    const nivel = Regras.nivelPorXp(Engine.estado.xp);
    const nParty = Engine.estado.party.length;
    hud.innerHTML = `
      <div class="retrato-mini" style="${h.retrato ? `background-image:url('${h.retrato}')` : ''}"></div>
      <div class="stat"><b>${h.nome}</b>${nParty > 1 ? ' <span style="color:var(--tocha)">(líder)</span> · party de ' + nParty : ''}<br>${h.classe} · Nível ${nivel} · <span style="color:var(--tocha-clara)">🎮 ${Engine.estado.nomeJogador || 'Aventureiro'} (slot ${Engine.estado.slot || 1})</span></div>
      <div class="stat">PV <b class="pv">${Engine.pvAtivo()}/${Engine.pvMax()}</b></div>
      <div class="stat">Ouro <b class="ouro-v">${Engine.estado.ouro} po</b></div>
      <div class="stat">XP <b>${Engine.estado.xp}</b></div>
      <div class="hud-botoes">
        <button class="btn mini" onclick="UI.telaFicha()">⚔️ Ficha</button>
        <button class="btn mini" onclick="UIInv.telaInventario()">🎒 Inventário</button>
        <button class="btn mini" onclick="UI.telaDiario()">📖 Diário</button>
        <button class="btn mini" onclick="UI.alternarLocal()">${Engine.estado.local === 'mapa' ? (Engine.cidadeBloqueada() ? '🔒 Cidade' : '🗺️ Ir à Cidade') : '🗺️ Ir ao Mapa'}</button>
        <button class="btn mini" onclick="SaveSystem.exportar(Engine.estado)" title="Baixa o save como arquivo .json (cópia de segurança)">💾 Exportar</button>
        <button class="btn mini" onclick="UI.botaoMusica(this)">🎵 ${Musica.ligada ? 'ON' : 'off'}</button>
        <button class="btn mini" onclick="UI.telaTitulo()" title="Voltar à tela de título (troca de slot/jogador). Salve antes!">🏠 Título</button>
      </div>`;
  },

  irLocalAtual() {
    if (Engine.estado.local === 'mapa') this.telaMapa();
    else this.telaCidade();
  },

  alternarLocal() {
    if (Engine.estado.local === 'mapa') {
      const trava = Engine.cidadeBloqueada();
      if (trava) {
        this.toast(`🔒 A missão "${trava}" está em andamento — a cidade reabre quando o objetivo da rota cair. Descanse nos pontos do caminho.`);
        return;
      }
      this.telaCidade(); return;
    }
    if (!Engine.missaoAtiva()) { this.toast('Aceite um contrato no quadro da guilda primeiro.'); return; }
    this.telaMapa();
  },

  /* ---------- Tela de título (slots de save) ---------- */
  slotSel: null,

  telaTitulo() {
    this.limpar();
    document.getElementById('hud').classList.remove('ativo');
    this.fundo(GameData.get('world').cidade.fundo);
    Musica.tocar('cidade');
    SaveSystem.migrarLegado();
    const cfg = GameData.get('config');

    const cartas = SaveSystem.listarSlots().map(sl => {
      if (sl.vazio) {
        return `<div class="carta-slot vazia">
          <div class="slot-num">SLOT ${sl.slot}</div>
          <div class="slot-info">— vazio —</div>
          <div class="slot-acoes">
            <button class="btn mini destaque" onclick="UI.abrirNovoJogo(${sl.slot})">⚔️ Novo Jogo</button>
            <button class="btn mini" onclick="UI.importarParaSlot(${sl.slot})">📁 Importar</button>
          </div></div>`;
      }
      return `<div class="carta-slot">
        <div class="slot-num">SLOT ${sl.slot}</div>
        <div class="slot-info"><b>${sl.nome}</b> · Nível ${sl.nivel} · party de ${sl.party}<br>
          <span>${sl.progresso} · ${sl.ouro} po</span><br>
          <span class="slot-data">salvo em ${sl.quando}</span></div>
        <div class="slot-acoes">
          <button class="btn mini destaque" onclick="UI.continuarSlot(${sl.slot})">▶ Continuar</button>
          <button class="btn mini" onclick="UI.abrirNovoJogo(${sl.slot})">⚔️ Novo</button>
          <button class="btn mini" onclick="UI.apagarSlot(${sl.slot}, this)">🗑</button>
        </div></div>`;
    }).join('');

    const tela = this.el('div', '', '');
    tela.id = 'tela-titulo';
    tela.innerHTML = `
      <h1>OZEIN</h1>
      <h2>OS PESADELOS DE RENÂNIA</h2>
      <div class="grade-slots">${cartas}</div>
      <div class="versao">${cfg.versao} · ${cfg.mundo} · <button class="btn mini" onclick="UI.botaoMusica(this)">🎵 Música: ${Musica.ligada ? 'ON' : 'off'}</button></div>
      <input type="file" id="input-save" accept=".json" style="display:none">`;
    this.raiz.appendChild(tela);
  },

  botaoMusica(botao) {
    const ligada = Musica.alternar();
    if (botao) botao.textContent = '🎵 Música: ' + (ligada ? 'ON' : 'off');
    this.atualizarHud();
  },

  abrirNovoJogo(slot) {
    const antigo = document.getElementById('painel-nome');
    if (antigo) antigo.remove();
    const painel = this.el('div', 'painel-cheio');
    painel.id = 'painel-nome';
    painel.style.background = 'rgba(8,11,16,.9)';
    painel.innerHTML = `
      <h2>⚔️ Novo Jogo — Slot ${slot}</h2>
      <div class="bloco" style="max-width:460px">
        <h4>Quem enfrenta os pesadelos de Renânia?</h4>
        <input type="text" id="input-nome" class="campo-nome" maxlength="20" placeholder="Nome do jogador" value="">
        <div style="margin-top:14px;display:flex;gap:10px">
          <button class="btn destaque" onclick="UI.comecarNovoJogo(${slot})">Começar a jornada ▸</button>
          <button class="btn" onclick="document.getElementById('painel-nome').remove()">Voltar</button>
        </div>
        ${SaveSystem.existe(slot) ? '<p style="margin-top:12px;color:var(--sangue);font-size:13px">⚠️ Este slot tem um save — começar um novo jogo vai SOBRESCREVÊ-LO.</p>' : ''}
      </div>`;
    this.raiz.appendChild(painel);
    const campo = document.getElementById('input-nome');
    campo.focus();
    campo.onkeydown = (ev) => { if (ev.key === 'Enter') this.comecarNovoJogo(slot); };
  },

  comecarNovoJogo(slot) {
    const nome = (document.getElementById('input-nome').value || '').trim() || 'Aventureiro';
    Engine.novoJogo(nome, slot);
    const p = document.getElementById('painel-nome');
    if (p) p.remove();
    this.telaIntro();
  },

  continuarSlot(slot) {
    if (Engine.continuar(slot)) {
      this.atualizarHud();
      this.irLocalAtual();
      this.toast('📜 Bem-vindo de volta, ' + (Engine.estado.nomeJogador || 'aventureiro') + '!');
    } else this.toast('⚠️ Não consegui carregar este slot.');
  },

  apagarSlot(slot, botao) {
    if (botao && !botao.dataset.confirmando) {
      botao.dataset.confirmando = '1';
      botao.textContent = '🗑 apagar mesmo?';
      setTimeout(() => { if (botao.isConnected) { delete botao.dataset.confirmando; botao.textContent = '🗑'; } }, 3000);
      return;
    }
    SaveSystem.apagar(slot);
    this.telaTitulo();
    this.toast('🗑 Slot ' + slot + ' apagado.');
  },

  importarParaSlot(slot) {
    const input = document.getElementById('input-save');
    input.onchange = (ev) => {
      const arq = ev.target.files[0];
      if (!arq) return;
      SaveSystem.importar(arq, (estado) => {
        if (estado) {
          estado.slot = slot;
          SaveSystem.salvar(estado);
          this.telaTitulo();
          this.toast('📁 Save importado para o slot ' + slot + '.');
        } else this.toast('⚠️ Arquivo de save inválido.');
      });
      input.value = '';
    };
    input.click();
  },

  /* ---------- Intro (slides de texto) ---------- */
  telaIntro() {
    const textos = GameData.get('config').intro;
    let i = 0;
    const mostrar = () => {
      this.limpar();
      this.fundo(null);
      const tela = this.el('div');
      tela.id = 'tela-intro';
      tela.innerHTML = `<div class="texto-intro">${textos[i]}<br><br>
        <button class="btn destaque">${i < textos.length - 1 ? 'Continuar ▸' : '⚔️ Chegar a Renânia'}</button></div>`;
      tela.querySelector('button').onclick = () => {
        i++;
        if (i < textos.length) mostrar();
        else { this.atualizarHud(); this.telaCidade(); this.toast('🏘️ Bem-vindo a Renânia. Comece pela taverna.'); }
      };
      this.raiz.appendChild(tela);
    };
    mostrar();
  },

  /* ---------- Cidade (hub) ---------- */

  /* v0.8.0 — quais locais têm o PRÓXIMO PASSO da história (ganham ❗ e destaque) */
  _locaisComNovidade() {
    const e = Engine.estado, f = e.flags, m = e.missoes;
    const nov = [];
    if (Engine.regiaoAtual() === 'renania') {
      if (!m.missao1) nov.push('quadro');
      if (f.missao1Cobrar && m.missao1 && !m.missao1.concluida) nov.push('quadro');
      if (f.v01Completa && !m.missao2) nov.push('beco');
      if (f.missao2Relatorio && !f.v02Completa) nov.push('carta_guilda');
      if (f.v02Completa && !m.missao3) nov.push('quadro');
      if (f.missao3Relatorio && !f.v03Completa) nov.push('carta_m3');
      if (f.v03Completa && !f.ubiaAberta) nov.push('convocacao');
      if (f.ubiaAberta && (!m.missao4 || !m.missao4.concluida)) nov.push('viagem_ubia');
    } else {
      if (!m.missao4) nov.push('u_mural');
      if (f.missao4Relatorio && !f.v04Completa) nov.push('u_mural');
      if (f.v04Completa && !f.mantoEntregue) nov.push('u_torre');
    }
    return nov;
  },

  telaCidade() {
    this.limpar();
    Musica.tocar('cidade');
    Engine.estado.local = 'cidade';
    this.atualizarHud();
    const cidade = Engine.cidadeAtual();
    this.fundo(cidade.fundo);

    const painel = this.el('div');
    painel.id = 'painel-locais';
    painel.innerHTML = `<div class="cabecalho"><h3>${cidade.nome}</h3><p>${cidade.descricao}</p></div>`;

    // 🎖️ Chamada BEM visível: prestígio disponível e alguém ainda sem trilha
    const prestigioPendente = Engine.estado.flags.rankC &&
      Engine.estado.party.some(id => Engine.podePrestigio(id));
    if (prestigioPendente) {
      const emUbia = Engine.regiaoAtual() === 'ubia';
      const alerta = this.el('button', 'btn alerta-prestigio',
        `🎖️ TRILHAS DE PRESTÍGIO DISPONÍVEIS!<span class="sub">${emUbia
          ? 'A Sede dos Caçadores treina as trilhas na própria matriz. A escolha é PERMANENTE. Clique para escolher agora.'
          : 'A veterana do Anexo dos Caçadores espera a party nos fundos da taverna. A escolha é PERMANENTE — e define o futuro de cada herói. Clique para ir agora.'}</span>`);
      alerta.onclick = () => emUbia ? this.telaPrestigio() : this.abrirDialogo('anexo_treinamento');
      painel.appendChild(alerta);
    }

    const novidades = this._locaisComNovidade();
    for (const local of cidade.locais) {
      if (local.condicao) {
        if (local.condicao.flag && !Engine.estado.flags[local.condicao.flag]) continue;
        if (local.condicao.semFlag && Engine.estado.flags[local.condicao.semFlag]) continue;
        if (local.condicao.missao && !Engine.estado.missoes[local.condicao.missao]) continue;
      }
      const novoPrestigio = local.id === 'anexo' && prestigioPendente;
      const novidade = novidades.includes(local.id);
      const b = this.el('button', 'btn' + (novoPrestigio || novidade ? ' destaque' : ''),
        `${novoPrestigio ? '🔔 ' : ''}${novidade ? '❗ ' : ''}${local.nome}<span class="sub">${local.desc}</span>`);
      if (local.acao.tipo === 'viajar' && !Engine.missaoAtiva()) {
        b.disabled = true;
        b.title = 'Aceite um contrato no quadro da guilda primeiro.';
      }
      b.onclick = () => this.acaoLocal(local.acao);
      painel.appendChild(b);
    }
    this.raiz.appendChild(painel);
  },

  acaoLocal(acao) {
    if (acao.tipo === 'mapaMundo') { this.painelMapaMundo(); return; }
    if (acao.tipo === 'loja') { UIInv.telaLoja(acao.loja || 'bruno'); return; }
    if (acao.tipo === 'regiao') { this.contextoCena = null; this.processarInstrucoes(Engine.executarEfeitos([{ tipo: 'regiao', valor: acao.regiao }])); return; }
    if (acao.tipo === 'dialogo') { this.contextoCena = null; this.abrirDialogo(acao.dialogo); }
    else if (acao.tipo === 'viajar') { Engine.estado.local = 'mapa'; this.telaMapa(); }
    else if (acao.tipo === 'descanso') {
      const onde = Engine.descansar();
      this.atualizarHud();
      this.toast(onde === 'disco'
        ? '🛏️ Descanso completo. PV e graça divina restaurados. JOGO SALVO.'
        : '🛏️ PV restaurados. ⚠️ Save em memória — use 💾 Exportar para garantir.');
      if (Engine.estado.party.length > 1) this.painelLider();
      else if (this._pergaminhosDeMagia().length) this.painelGrimorio();
    }
  },

  /* ---------- Grimório: estudo de magias no descanso ---------- */
  _pergaminhosDeMagia() {
    const itens = GameData.get('items');
    if (!Engine.estado.party.includes('maga')) return [];
    return Engine.estado.inventario.filter(id => itens[id] && itens[id].magia)
      .filter((id, i, arr) => arr.indexOf(id) === i); // únicos
  },

  painelGrimorio() {
    const antigo = document.getElementById('painel-grimorio');
    if (antigo) antigo.remove();
    const itens = GameData.get('items');
    const abs = GameData.get('abilities');
    const scrolls = this._pergaminhosDeMagia();
    const painel = this.el('div', 'painel-cheio');
    painel.id = 'painel-grimorio';
    painel.style.background = 'rgba(8,11,16,.92)';

    const linhas = scrolls.map(id => {
      const s = itens[id];
      const ab = abs[s.magia];
      const jaTentou = Engine.estado.estudos[id] === Engine.estado.contadorDescansos;
      const custo = 100 * (s.circulo || 1);
      return `<div class="bloco" style="margin-bottom:10px">
        <b style="color:var(--raro)">${s.nome}</b> — ${s.circulo}º círculo · CD ${15 + (s.circulo || 1)} (Identificar Magia) · tinta rara: ${custo} po
        <div style="color:var(--texto-fraco);font-size:13px;margin:4px 0">${ab ? ab.desc : ''}</div>
        ${jaTentou
          ? '<span style="color:var(--texto-fraco)">😮‍💨 Já tentou neste descanso — a mente precisa assentar. Tente no próximo.</span>'
          : `<button class="btn mini destaque" onclick="UI.estudar('${id}')">📖 Estudar (rolar d20)</button>`}
      </div>`;
    }).join('') || '<p style="color:var(--texto-fraco)">Nenhum pergaminho de magia na mochila. Bruno às vezes recebe alguns; inimigos conjuradores derrubam outros.</p>';

    painel.innerHTML = `
      <h2>📖 O Grimório da Maga</h2>
      <p style="color:var(--texto-fraco);max-width:640px;margin-bottom:14px">Regra 3.5: copiar uma magia nova exige um teste de <b>Identificar Magia (CD 15 + círculo)</b> e tinta rara (100 po × círculo, gasta na tentativa). Falhou? Só no próximo descanso. Aprender magia é um OFÍCIO.</p>
      <div style="max-width:640px">${linhas}</div>
      <p style="color:var(--texto-fraco);margin-top:8px">💰 Ouro: <b>${Engine.estado.ouro} po</b> · Magias no grimório: ${Engine.estado.herois.maga.habilidadesCombate.filter(a => (abs[a] || {}).circulo).length}</p>
      <button class="btn" onclick="document.getElementById('painel-grimorio').remove()">Fechar o grimório</button>`;
    this.raiz.appendChild(painel);
  },

  estudar(scrollId) {
    const r = Engine.estudarMagia(scrollId);
    if (r.erro) { this.toast('📖 ' + r.erro); this.painelGrimorio(); return; }
    const abs = GameData.get('abilities');
    if (r.sucesso) {
      this.toast(`📖✨ APRENDIDA: ${abs[r.magia].nome}! (d20=${r.dado} → ${r.total} vs CD ${r.cd})`);
      SaveSystem.salvar(Engine.estado);
    } else {
      this.toast(`📖💨 A tinta borra, o sentido escapa... (d20=${r.dado} → ${r.total} vs CD ${r.cd}; −${r.custo} po). Tente no próximo descanso.`);
    }
    this.atualizarHud();
    this.painelGrimorio();
  },

  /* ---------- Classes de prestígio (Anexo dos Caçadores) ---------- */
  telaPrestigio() {
    const antigo = document.getElementById('painel-prestigio');
    if (antigo) antigo.remove();
    const P = GameData.get('prestige');
    const nivel = Regras.nivelPorXp(Engine.estado.xp);
    const painel = this.el('div', 'painel-cheio');
    painel.id = 'painel-prestigio';
    painel.style.cssText = 'background:rgba(8,11,16,.94);overflow-y:auto;';

    const blocos = Engine.estado.party.map(id => {
      const h = Engine.estado.herois[id];
      const opcoes = P[id] || [];
      if (h.prestigio) {
        const atual = opcoes.find(o => o.id === h.prestigio);
        return `<div class="bloco" style="margin-bottom:14px"><h4>${h.nome}</h4>
          <p>${atual.icone} <b style="color:var(--conjunto)">${atual.nome}</b> — escolha permanente feita.<br>
          <span style="color:var(--texto-fraco);font-size:13px">${atual.passivaDesc}</span></p></div>`;
      }
      if (nivel < (P.requisitoNivel || 7)) {
        return `<div class="bloco" style="margin-bottom:14px"><h4>${h.nome}</h4>
          <p style="color:var(--texto-fraco)">Requisito: nível ${P.requisitoNivel || 7} (a party está no ${nivel}).</p></div>`;
      }
      const cartas = opcoes.map(o => `
        <div class="carta-loot" style="border-color:var(--conjunto);text-align:left;max-width:290px">
          <b style="color:var(--conjunto)">${o.icone} ${o.nome}</b>
          <div style="font-size:12px;color:var(--texto-fraco);margin:2px 0 6px">${o.fonte}</div>
          <div style="font-size:13px;margin-bottom:6px">${o.desc}</div>
          <div style="font-size:12px;color:var(--tocha-clara);margin-bottom:6px">${o.passivaDesc}</div>
          <div style="font-size:12px;color:var(--texto-fraco);font-style:italic;margin-bottom:8px">${o.lore}</div>
          <button class="btn mini destaque" onclick="UI.confirmarPrestigio('${id}','${o.id}', this)">Trilhar este caminho</button>
        </div>`).join('');
      return `<div class="bloco" style="margin-bottom:14px"><h4>${h.nome} — escolha UMA trilha (permanente!)</h4>
        <div class="cartas-loot">${cartas}</div></div>`;
    }).join('');

    painel.innerHTML = `
      <h2>🎖️ Anexo dos Caçadores — Classes de Prestígio</h2>
      <p style="color:var(--texto-fraco);max-width:720px;margin-bottom:14px">Padrão D&D 3.5: no nível ${P.requisitoNivel || 7}, cada herói pode assumir UMA classe de prestígio — bônus fixos, uma passiva e uma habilidade nova de combate. <b>A escolha é permanente.</b></p>
      ${blocos}
      <button class="btn" onclick="document.getElementById('painel-prestigio').remove()">Sair do Anexo</button>`;
    this.raiz.appendChild(painel);
  },

  confirmarPrestigio(heroiId, prestigioId, btn) {
    if (btn && !btn.dataset.confirmando) {
      btn.dataset.confirmando = '1';
      btn.textContent = '⚠️ Confirmar? (permanente)';
      setTimeout(() => { if (btn.isConnected) { btn.textContent = 'Trilhar este caminho'; delete btn.dataset.confirmando; } }, 4000);
      return;
    }
    if (Engine.aplicarPrestigio(heroiId, prestigioId)) {
      const def = GameData.get('prestige')[heroiId].find(p => p.id === prestigioId);
      this.toast(`🎖️ ${Engine.estado.herois[heroiId].nome} agora é ${def.icone} ${def.nome}!`);
      SaveSystem.salvar(Engine.estado);
      this.atualizarHud();
      this.telaPrestigio();
    } else this.toast('⚠️ Não foi possível (nível insuficiente ou trilha já escolhida).');
  },

  /* 🗺️ Mapa do continente Genesiano (arte canônica do Carlos) */
  painelMapaMundo() {
    const antigo = document.getElementById('painel-mapa-mundo');
    if (antigo) { antigo.remove(); return; }
    const painel = this.el('div', 'painel-cheio');
    painel.id = 'painel-mapa-mundo';
    painel.innerHTML = `
      <h2>🗺️ O Continente Genesiano</h2>
      <button class="btn fechar" onclick="this.parentElement.remove()">✕ Fechar</button>
      <p style="color:var(--texto-fraco);max-width:760px;margin-bottom:12px">Escala: 1 dia a cavalo por quadrado.
        <b style="color:var(--tocha-clara)">RENÂNIA</b> fica no sopé das montanhas do oeste — vizinha de Danos e Nemésia,
        na rota que liga <b>Vithus</b> (norte) a <b>Úbia</b>, a Cidade dos Heróis. A leste, os reinos de <b>Solaris</b> e <b>Alakan</b>;
        ao sul, a Grande Floresta; além das montanhas, as Terras Esquecidas.</p>
      <img src="assets/img/mapa-genesiano.jpg" alt="Mapa do continente Genesiano"
           style="max-width:100%;border:2px solid var(--borda,#5a4a33);border-radius:8px;box-shadow:0 8px 30px rgba(0,0,0,.6)">`;
    this.raiz.appendChild(painel);
  },

  /* Troca de líder — só em pontos de descanso (concept: troca em save points) */
  painelLider() {
    const antigo = document.getElementById('painel-lider');
    if (antigo) antigo.remove();
    const painel = this.el('div', 'painel-cheio');
    painel.id = 'painel-lider';
    painel.style.background = 'rgba(8,11,16,.88)';
    const cartoes = Engine.estado.party.map(id => {
      const h = Engine.estado.herois[id];
      const ativo = id === Engine.estado.ativo;
      return `<button class="btn ${ativo ? 'destaque' : ''}" style="display:block;width:100%;margin-bottom:10px" onclick="UI.definirLider('${id}')">
        ${ativo ? '★ ' : ''}${h.nome} — ${h.classe}<span class="sub">Perícias de líder: ${Object.keys(h.pericias).slice(0, 3).map(p => p.replace(/_/g, ' ')).join(', ')}...</span></button>`;
    }).join('');
    const btnGrimorio = this._pergaminhosDeMagia().length
      ? `<button class="btn destaque" style="margin-right:8px" onclick="document.getElementById('painel-lider').remove();UI.painelGrimorio()">📖 Estudar o grimório (${this._pergaminhosDeMagia().length} pergaminho(s))</button>`
      : '';
    painel.innerHTML = `
      <h2>🛏️ Descanso — quem lidera a marcha?</h2>
      <p style="color:var(--texto-fraco);margin-bottom:16px">O líder faz os testes de perícia fora de combate (a party inteira luta nos combates).</p>
      <div style="max-width:520px">${cartoes}</div>
      ${btnGrimorio}<button class="btn" onclick="document.getElementById('painel-lider').remove()">Manter como está</button>`;
    this.raiz.appendChild(painel);
  },

  definirLider(id) {
    Engine.estado.ativo = id;
    SaveSystem.salvar(Engine.estado); // ainda estamos no ponto de descanso — persiste a escolha
    const p = document.getElementById('painel-lider');
    if (p) p.remove();
    this.atualizarHud();
    this.toast('★ ' + Engine.estado.herois[id].nome + ' agora lidera a marcha. (salvo)');
  },

  /* ---------- Mapa de nós ---------- */
  telaMapa() {
    this.limpar();
    Musica.tocar('estrada');
    Engine.estado.local = 'mapa';
    this.atualizarHud();
    const mapa = Engine.mapaAtual();
    this.fundo(mapa.fundo);

    // v0.8.0: o mapa SEMPRE aponta o próximo passo (nó dourado pulsante ⭐)
    const proximoId = Engine.proximoDestino();
    const noProximo = proximoId ? mapa.nos.find(n => n.id === proximoId) : null;

    // Faixa fina, NÃO intercepta cliques (pointer-events:none) e fica ABAIXO
    // dos nós (z-index menor) — nenhum nó da estrada pode ficar inacessível atrás dela.
    const cab = this.el('div', 'cabecalho-mapa');
    cab.style.cssText = 'position:absolute;left:12px;top:8px;z-index:8;max-width:92vw;pointer-events:none;padding:8px 14px;';
    const missaoTrava = Engine.cidadeBloqueada();
    cab.innerHTML = `<h3 style="display:inline;font-size:15px">🗺️ ${mapa.nome}</h3> <span style="font-size:12px;color:var(--texto-fraco)">${missaoTrava
      ? `<b style="color:var(--tocha-clara)">🔒 "${missaoTrava}" em andamento — a cidade reabre quando o objetivo cair.</b>`
      : '— pode voltar à cidade quando quiser.'}${noProximo
      ? ` <b style="color:var(--ouro)">⭐ Próximo passo: ${noProximo.tipo === 'cidade' ? noProximo.nome + ' (o desfecho espera na cidade)' : noProximo.nome}.</b>` : ''}</span>`;
    this.raiz.appendChild(cab);

    const cont = this.el('div');
    cont.id = 'mapa-nos';

    // linhas SVG entre nós
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    const porId = {};
    const visivel = (n) => !n.condicao || !n.condicao.missao || !!Engine.estado.missoes[n.condicao.missao];
    mapa.nos.forEach(n => porId[n.id] = n);
    for (const [a, b] of mapa.arestas) {
      if (!visivel(porId[a]) || !visivel(porId[b])) continue;
      const l = document.createElementNS(svgNS, 'line');
      l.setAttribute('x1', porId[a].x); l.setAttribute('y1', porId[a].y);
      l.setAttribute('x2', porId[b].x); l.setAttribute('y2', porId[b].y);
      const percorrida = Engine.estado.nosConcluidos.includes(a) || Engine.estado.nosConcluidos.includes(b);
      l.setAttribute('class', 'linha-mapa' + (percorrida ? ' percorrida' : ''));
      l.setAttribute('vector-effect', 'non-scaling-stroke');
      svg.appendChild(l);
    }
    cont.appendChild(svg);

    // nós
    for (const no of mapa.nos) {
      if (!visivel(no)) continue;
      const st = Engine.estadoDoNo(no);
      const travadoCidade = no.tipo === 'cidade' && missaoTrava;
      const ehProximo = noProximo && no.id === noProximo.id && !travadoCidade;
      const b = this.el('button', `no-mapa ${travadoCidade ? 'bloqueado' : st}${ehProximo ? ' proximo' : ''}`);
      b.style.left = no.x + '%';
      b.style.top = no.y + '%';
      b.innerHTML = `<span class="disco">${travadoCidade ? '🔒' : no.icone}</span><span class="rotulo">${no.nome}</span>`;
      b.title = travadoCidade ? `A missão "${missaoTrava}" está em andamento — termine-a para voltar.` : (ehProximo ? '⭐ PRÓXIMO PASSO: ' + no.desc : no.desc);
      if (st === 'bloqueado' && !travadoCidade) b.disabled = true;
      else b.onclick = () => this.entrarNo(no);
      cont.appendChild(b);
    }
    this.raiz.appendChild(cont);
  },

  entrarNo(no) {
    if (no.tipo === 'cidade') {
      const trava = Engine.cidadeBloqueada();
      if (trava) { this.toast(`🔒 A missão "${trava}" está em andamento. A cidade reabre quando o objetivo da rota cair — descanse nos pontos do caminho.`); return; }
      this.telaCidade(); return;
    }
    this.contextoCena = { noId: no.id };
    const refarm = {
      no_mina_entrada: 'refarm_no1_intro', no_caverna: 'refarm_no2_intro', no_fundo: 'refarm_no3_intro',
      no_bolsao: 'refarm_m2_bolsao_intro', no_fissura: 'refarm_m2_fissura_intro',
      no_m3_vau: 'refarm_m3_vau_intro', no_m3_pasto: 'refarm_m3_pasto_intro',
      no_u_armazem: 'refarm_m4_armazem_intro', no_u_subterraneo: 'refarm_m4_subterraneo_intro'
    };
    if (Engine.estado.nosConcluidos.includes(no.id)) {
      if (refarm[no.id]) { this.abrirDialogo(refarm[no.id]); return; }
      if (no.tipo === 'combate' || no.tipo === 'chefe') {
        this.toast('✓ ' + no.nome + ' — nada mais se move por aqui.');
        return;
      }
    }
    this.abrirDialogo(no.cena);
  },

  /* ---------- Cena de diálogo ---------- */
  abrirDialogo(id) {
    const dlg = GameData.get('dialogs')[id];
    if (!dlg) { console.error('Diálogo não encontrado:', id); return; }

    this.limpar();
    this.atualizarHud();
    const fundoNo = this.contextoCena ? Engine.mapaAtual().fundo : Engine.cidadeAtual().fundo;
    const fundoFinal = dlg.cenario || fundoNo;
    this.fundo(fundoFinal);
    Musica.porCenario(fundoFinal);

    const novidades = Engine.aoEntrarDialogo(id, dlg);
    this.filaToasts(novidades);
    this.atualizarHud();

    const caixa = this.el('div');
    caixa.id = 'caixa-cena';
    this.raiz.appendChild(caixa);

    // falas escritas como "Paladino/Ladino/Maga" ganham o NOME do herói
    const NPC_RETRATOS = { 'Lysia Moss': 'assets/img/retrato-lysia.jpg' };
    const nomeFala = (quem) => {
      const h = Engine.estado.herois;
      const mapa = {
        'Paladino': h.paladino, 'Cavaleiro': h.paladino,
        'Ladino': h.ladino, 'Maga': h.maga
      };
      const hr = mapa[quem];
      const retrato = hr ? hr.retrato : NPC_RETRATOS[quem];
      const img = retrato ? `<img class="retrato-fala" src="${retrato}" alt="">` : '';
      return hr ? `${img}${hr.nome} <span style="opacity:.65;font-weight:normal">(${quem})</span>` : `${img}${quem}`;
    };

    let i = 0;
    const mostrarFala = () => {
      const f = dlg.falas[i];
      const ultima = i === dlg.falas.length - 1;
      caixa.innerHTML = `
        <div class="quem">${nomeFala(f.quem)}</div>
        <div class="fala">${f.texto}</div>
        ${ultima ? '' : '<div class="continuar">▸ continuar</div>'}
        ${ultima ? '<div class="opcoes"></div>' : ''}`;
      if (!ultima) {
        caixa.querySelector('.continuar').onclick = () => { i++; mostrarFala(); };
        caixa.onclick = (ev) => {
          if (ev.target.closest('.opcoes') || ev.target.tagName === 'BUTTON') return;
          i++; caixa.onclick = null; mostrarFala();
        };
      } else {
        caixa.onclick = null;
        const ops = caixa.querySelector('.opcoes');
        for (const op of dlg.opcoes) {
          if (op.condicao) {
            const cd = op.condicao;
            if (cd.semMissao && Engine.estado.missoes[cd.semMissao]) continue;
            if (cd.missao && !Engine.estado.missoes[cd.missao]) continue;
            if (cd.flag && !Engine.estado.flags[cd.flag]) continue;
            if (cd.semFlag && Engine.estado.flags[cd.semFlag]) continue;
            if (cd.missaoConcluida && !(Engine.estado.missoes[cd.missaoConcluida] || {}).concluida) continue;
          }
          const b = this.el('button', 'btn', op.texto);
          b.onclick = () => {
            if (op.goto) this.abrirDialogo(op.goto);
            else this.processarInstrucoes(Engine.executarEfeitos(op.efeito, this.contextoCena));
          };
          ops.appendChild(b);
        }
      }
    };
    mostrarFala();
  },

  processarInstrucoes(instrucoes) {
    this.filaToasts(instrucoes);
    for (const ins of instrucoes) {
      switch (ins.ui) {
        case 'abrirDialogo': this.abrirDialogo(ins.id); return;
        case 'cidade': this.telaCidade(); return;
        case 'mapa': this.telaMapa(); return;
        case 'resultadoTeste': this.mostrarTeste(ins); return;
        case 'combate': UICombate.abrir(ins.id, { noId: this.contextoCena ? this.contextoCena.noId : null, farm: ins.farm }); return;
        case 'loja': UIInv.telaLoja(ins.lojaId); return;
        case 'previaCombate': this.telaPreviaCombate(ins.monstros, ins.noId); return;
        case 'prestigio': this.telaPrestigio(); return;
      }
    }
    this.atualizarHud();
  },

  /* ---------- Rolagem de d20 com suspense + banner ---------- */
  mostrarTeste(ins) {
    const r = ins.resultado;
    // 1) o dado gira...
    const overlay = this.el('div', 'dado-overlay');
    overlay.innerHTML = `
      <div class="dado-rotulo">${r.rotulo} — CD ${r.cd}</div>
      <div class="dado-d20 girando"><span id="dado-numero">?</span></div>
      <div class="dado-legenda">🎲 d20 ${Regras.fmtMod(r.bonus)}</div>`;
    this.raiz.appendChild(overlay);
    const numeroEl = overlay.querySelector('#dado-numero');
    const dadoEl = overlay.querySelector('.dado-d20');
    let giros = 0;
    const intervalo = setInterval(() => {
      numeroEl.textContent = Regras.rolar(20);
      giros++;
      if (giros >= 14) {
        clearInterval(intervalo);
        // 2) ...e para no resultado real
        numeroEl.textContent = r.dado;
        dadoEl.classList.remove('girando');
        dadoEl.classList.add(r.critico ? 'nat20' : r.desastre ? 'nat1' : (r.sucesso ? 'parou-sucesso' : 'parou-falha'));
        // 3) banner com a conta completa
        setTimeout(() => {
          const banner = this.el('div', 'banner-teste ' + (r.sucesso ? 'sucesso' : 'falha'));
          banner.innerHTML = `
            ${r.critico ? '🌟 20 NATURAL — SUCESSO CRÍTICO!' : r.desastre ? '💀 1 NATURAL — FALHA CRÍTICA!' : r.sucesso ? '✅ SUCESSO' : '❌ FALHA'}
            <small>${r.rotulo}: 🎲 ${r.dado} ${Regras.fmtMod(r.bonus)} = <b>${r.total}</b> vs CD ${r.cd}</small>`;
          this.raiz.appendChild(banner);
          setTimeout(() => this.abrirDialogo(ins.proximo), 1700);
        }, 650);
      }
    }, 75);
  },

  /* ---------- Prévia de combate (o combate real chega no Passe B) ---------- */
  telaPreviaCombate(idsMonstros, noId) {
    this.limpar();
    this.atualizarHud();
    this.fundo('assets/img/batalha-lateral.png');

    const monstros = GameData.get('monsters');
    const painel = this.el('div', 'painel-cheio');
    painel.style.background = 'rgba(8,11,16,.82)';
    let cartas = '';
    for (const mid of idsMonstros) {
      const m = monstros[mid];
      cartas += `
        <div class="carta-monstro">
          <h5>${m.nome}</h5>
          <div class="nd">ND ${m.nd} · ${m.tipo}</div>
          <p><b>PV</b> ${m.pv} · <b>CA</b> ${m.ca} · ${m.ataques.map(a => `${a.nome} ${a.dano}`).join(' · ')}</p>
          <p>${m.especial.map(e => '◆ ' + e).join('<br>')}</p>
          <p><b>Fraqueza:</b> ${m.fraqueza}</p>
          <p class="lore">${m.lore}</p>
        </div>`;
    }
    painel.innerHTML = `
      <h2>⚔️ Prévia do Encontro</h2>
      <p style="color:var(--texto-fraco);font-size:14px;">O motor de combate ATB (Final Fantasy) com condições de D&D e loot de Diablo é o coração do <b>Passe B</b>. Aqui está o que espera por você neste nó:</p>
      <div class="cartas-monstros">${cartas}</div>
      <span class="selo-passeb">🔒 COMBATE ATB — CHEGA NO PASSE B</span>
      <div style="margin-top:22px;">
        <button class="btn destaque" onclick="UI.fecharPrevia('${noId || ''}')">Voltar ao mapa</button>
      </div>`;
    this.raiz.appendChild(painel);
  },

  fecharPrevia(noId) {
    if (noId) Engine.concluirNo(noId); // no Passe A, ver a prévia conclui o nó (pra testar a progressão do mapa)
    this.telaMapa();
  },

  /* ---------- Ficha de personagem ---------- */
  fichaSel: null,

  telaFicha(idSel) {
    const antigo = document.getElementById('painel-ficha');
    if (antigo) antigo.remove();
    if (idSel) this.fichaSel = idSel;
    if (!this.fichaSel || !Engine.estado.party.includes(this.fichaSel)) this.fichaSel = Engine.estado.ativo;

    const est = Engine.estado;
    const h = est.herois[this.fichaSel];
    const equip = est.equips[this.fichaSel];
    const stats = Loot.statsHeroi(h, equip);
    const cfg = GameData.get('config');
    const nivel = Regras.nivelPorXp(est.xp);

    const abas = est.party.map(id =>
      `<button class="btn mini ${id === this.fichaSel ? 'destaque' : ''}" onclick="UI.telaFicha('${id}')">${est.herois[id].nome}</button>`).join(' ');

    const atrs = cfg.regras.atributos.map(a => `
      <div class="atr">
        <div class="sigla">${a}</div>
        <div class="valor">${stats.atributos[a]}</div>
        <div class="mod">${Regras.fmtMod(Regras.mod(stats.atributos[a]))}</div>
      </div>`).join('');

    const pericias = Object.entries(h.pericias).map(([p, v]) =>
      `<li>${p.replace(/_/g, ' ')} <b>${Regras.fmtMod(v)}</b></li>`).join('');

    const habs = h.habilidades.map(hb => `<li><b>${hb.nome}</b> — ${hb.desc}</li>`).join('');

    const equipHtml = Object.entries(equip).filter(([, it]) => it).map(([slot, it]) => {
      const cor = Loot.corItem(it);
      return `<li><b style="color:${cor}">${Loot.nomeExibicao(it)}</b><span class="tag-raridade" style="color:${cor}">${cfg.raridades[it.raridade].nome}</span>
        <span style="color:var(--texto-fraco);font-size:12px"> · ${slot}</span></li>`;
    }).join('') || '<li style="color:var(--texto-fraco)">Nada equipado.</li>';

    const futuros = Object.values(GameData.get('heroes')).filter(x => !est.party.includes(x.id)).map(x =>
      `<li><b>${x.nome}</b> (${x.classe}) — ainda não recrutado<br>
       <span style="color:var(--texto-fraco);font-size:13px;">${x.bio}</span></li>`).join('');

    const painel = this.el('div', 'painel-cheio');
    painel.id = 'painel-ficha';
    painel.innerHTML = `
      <h2>⚔️ ${h.nome}</h2>
      <button class="btn fechar" onclick="this.parentElement.remove()">✕ Fechar</button>
      <div style="margin-bottom:14px">${abas}</div>
      <div class="grade-ficha">
        <div>
          <div class="retrato-grande ${h.retrato ? '' : 'retrato-vazio'}" ${h.retrato ? `style="background-image:url('${h.retrato}')"` : ''}>
            ${h.retrato ? '' : 'Retrato a gerar no Gemini<br>(conversa-semente do estilo)'}</div>
          <div class="bloco" style="margin-top:14px;">
            <h4>Identidade</h4>
            <ul class="lista-simples">
              <li>${h.titulo}</li>
              <li>Nível <b>${nivel}</b> · ${h.tendencia}</li>
              <li>Devoção: ${h.divindade}</li>
              <li>PV <b>${est.pv[this.fichaSel]}/${stats.pvMax}</b> · CA <b>${stats.ca}</b> · BBA <b>+${h.bba}</b></li>
              <li>Ataque <b>${Regras.fmtMod(stats.ataque)}</b> · Dano <b>${stats.danoDado}${stats.danoBonus ? Regras.fmtMod(stats.danoBonus) : ''}</b> (${stats.critico})</li>
              <li>Fort <b>${Regras.fmtMod(stats.salvamentos.fortitude)}</b> · Refl <b>${Regras.fmtMod(stats.salvamentos.reflexos)}</b> · Von <b>${Regras.fmtMod(stats.salvamentos.vontade)}</b></li>
              ${this.fichaSel === 'paladino' ? `<li>Reserva de Impor as Mãos: <b>${est.reservaImpor} PV</b></li>` : ''}
            </ul>
          </div>
        </div>
        <div>
          <div class="bloco"><h4>Atributos (D&D 3.5, com itens)</h4><div class="linha-atributos">${atrs}</div></div>
          <div class="bloco"><h4>Perícias</h4><ul class="lista-simples">${pericias}</ul></div>
          <div class="bloco"><h4>Habilidades de Classe</h4><ul class="lista-simples">${habs}</ul></div>
          <div class="bloco"><h4>Equipado <button class="btn mini" onclick="document.getElementById('painel-ficha').remove();UIInv.heroiSel='${this.fichaSel}';UIInv.telaInventario()">gerenciar 🎒</button></h4><ul class="lista-simples">${equipHtml}</ul></div>
          ${futuros ? `<div class="bloco"><h4>Futuros companheiros</h4><ul class="lista-simples">${futuros}</ul></div>` : ''}
        </div>
      </div>`;
    this.raiz.appendChild(painel);
  },

  /* ---------- Diário (missões + codex) ---------- */
  telaDiario() {
    const quests = GameData.get('quests');
    let missoesHtml = '';
    for (const q of Object.values(quests)) {
      const m = Engine.estado.missoes[q.id];
      if (q.bloqueada && !m) {
        missoesHtml += `<div class="bloco"><h4>🔒 ???</h4><p style="font-size:13px;color:var(--texto-fraco)">Um gancho ainda não revelado aguarda nas profundezas...</p></div>`;
        continue;
      }
      if (!m) {
        missoesHtml += `<div class="bloco"><h4>📜 ${q.nome}</h4><p style="font-size:13px;color:var(--texto-fraco)">${q.origem || 'Disponível no quadro dos Caçadores, na taverna.'}</p></div>`;
        continue;
      }
      const etapas = q.etapas.map(e =>
        `<div class="etapa-missao ${m.etapasFeitas.includes(e.id) ? 'feita' : ''}">&nbsp;${e.texto}</div>`).join('');
      missoesHtml += `
        <div class="bloco">
          <h4>📜 ${q.nome} — EM ANDAMENTO</h4>
          <p style="font-size:13px;margin-bottom:8px;"><b>Rank ${q.rank}</b> · ${q.recompensa}</p>
          <p style="font-size:14px;font-style:italic;margin-bottom:10px;">${q.resumo}</p>
          ${etapas}
        </div>`;
    }

    const codexHtml = Engine.estado.codex.length
      ? Engine.estado.codex.map(c => `<div class="entrada-codex"><h5>◆ ${c.titulo}</h5><p>${c.texto}</p></div>`).join('')
      : '<p style="color:var(--texto-fraco)">O diário se preenche sozinho conforme você descobre o mundo. Converse, explore, investigue.</p>';

    const painel = this.el('div', 'painel-cheio');
    painel.innerHTML = `
      <h2>📖 Diário-Códex</h2>
      <button class="btn fechar" onclick="this.parentElement.remove()">✕ Fechar</button>
      <div class="grade-ficha">
        <div><div class="bloco"><h4>Missões</h4>${missoesHtml}</div></div>
        <div><div class="bloco"><h4>Conhecimento de Ozein</h4>${codexHtml}</div></div>
      </div>`;
    this.raiz.appendChild(painel);
  }
};

/* ---------- Boot ---------- */
window.addEventListener('DOMContentLoaded', () => UI.iniciar());
