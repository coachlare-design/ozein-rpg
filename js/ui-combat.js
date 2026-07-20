/* =====================================================
   OZEIN RPG — js/ui-combat.js
   Tela de combate ATB: heróis à esquerda, inimigos à
   direita (guia de estilo §6.4), menu de ações, log,
   números flutuantes e telas de vitória/derrota.
   ===================================================== */
'use strict';

const UICombate = {
  contexto: null,     // { noId, farm }
  selecionando: null, // habilidade aguardando alvo
  floats: [],
  _fseq: 0,

  abrir(encontroId, contexto) {
    this.contexto = contexto || {};
    this.selecionando = null;
    this.floats = [];
    Musica.tocar('combate');
    UI.limpar();
    UI.atualizarHud();
    const enc = GameData.get('encounters')[encontroId];
    UI.fundo(enc.fundo);
    const tela = UI.el('div');
    tela.id = 'tela-combate';
    tela.innerHTML = `
      <div id="cb-topo"></div>
      <div id="cb-arena"><div id="cb-herois"></div><div id="cb-inimigos"></div></div>
      <div id="cb-rodape"><div id="cb-menu"></div><div id="cb-log"></div></div>`;
    UI.raiz.appendChild(tela);
    Combat.iniciar(encontroId, null);
    this.render();
  },

  flutuar(alvo, texto, classe) {
    const chave = alvo.stats ? 'h_' + alvo.id : 'e_' + alvo.idx;
    this.floats.push({ chave, texto, classe, id: ++this._fseq });
    const idAtual = this._fseq;
    setTimeout(() => { this.floats = this.floats.filter(f => f.id !== idAtual); }, 1100);
  },

  /* Dado d20 com "flip" no atacante/salvador — a sorte visível em cada rolagem */
  flutuarDado(alvo, dado, classe, prefixo) {
    const chave = alvo.stats ? 'h_' + alvo.id : 'e_' + alvo.idx;
    this.floats.push({ chave, texto: (prefixo || '') + '🎲' + dado, classe: 'dado ' + classe, id: ++this._fseq });
    const idAtual = this._fseq;
    setTimeout(() => { this.floats = this.floats.filter(f => f.id !== idAtual); }, 1300);
  },

  _barra(pct, classe) {
    return `<div class="barra"><div class="barra-fill ${classe}" style="width:${Math.max(0, Math.min(100, pct))}%"></div></div>`;
  },

  _condicoesTxt(alvo) {
    const icones = { queimando: '🔥', atordoado: '💫', petrificando: '🪨', petrificado: '🗿', protegido: '🛡️', escudo_arcano: '🔮', abalado: '😨', acelerado: '🌀', abencoado: '✨', oculto: '🌑' };
    let txt = alvo.condicoes.map(c => (icones[c.tipo] || '') + (c.tipo === 'petrificando' ? (c.stacks || 1) + '/2' : '')).join(' ');
    if (alvo.desviando) txt += ' 👁️⤵';
    return txt;
  },

  _floatsDe(chave) {
    return this.floats.filter(f => f.chave === chave)
      .map(f => `<span class="dano-flutuante ${f.classe}">${f.texto}</span>`).join('');
  },

  render() {
    const c = Combat.c;
    if (!c || !document.getElementById('cb-arena')) return;

    /* topo: nome + botões globais */
    const topo = document.getElementById('cb-topo');
    const botoes = [];
    botoes.push(`<button class="btn mini ${c.auto ? 'destaque' : ''}" onclick="Combat.alternarAuto()">⚡ Auto ${c.auto ? 'ON' : 'off'}</button>`);
    if (c.enc.olharAtivo) botoes.push(`<button class="btn mini" onclick="Combat.alternarDesvio()" title="Alterna no herói pronto: imune ao olhar, -4 no acerto. Não gasta a ação.">👁️ Desviar os olhos</button>`);
    topo.innerHTML = `<span class="cb-titulo">⚔️ ${c.enc.nome} — rodada ${c.rodada}</span><span class="cb-botoes">${botoes.join('')}</span>`;

    /* heróis */
    const divH = document.getElementById('cb-herois');
    divH.innerHTML = c.herois.map(h => {
      const pv = Engine.estado.pv[h.id];
      const pronto = Combat.heroiPronto() === h;
      const fora = h.caido || Combat._tem(h, 'petrificado');
      return `
        <div class="carta-comb heroi ${pronto ? 'pronto' : ''} ${fora ? 'fora' : ''}">
          ${this._floatsDe('h_' + h.id)}
          <div class="cc-retrato" style="${h.ref.retrato ? `background-image:url('${h.ref.retrato}')` : ''}">${h.ref.retrato ? '' : '🧙'}</div>
          <div class="cc-info">
            <div class="cc-nome">${h.ref.nome} <span class="cc-cond">${this._condicoesTxt(h)}</span></div>
            <div class="cc-pv">PV ${pv}/${h.stats.pvMax}</div>
            ${this._barra(pv / h.stats.pvMax * 100, 'pv')}
            ${this._barra(h.atb, 'atb')}
          </div>
        </div>`;
    }).join('');

    /* inimigos */
    const divE = document.getElementById('cb-inimigos');
    divE.innerHTML = c.inimigos.map((e, i) => {
      if (e.fugiu) return `<div class="carta-comb inimigo fora"><div class="cc-info"><div class="cc-nome">${e.apelido} — fugiu 💨</div></div></div>`;
      const clicavel = this.selecionando && !e.morto;
      return `
        <div class="carta-comb inimigo ${e.morto ? 'fora' : ''} ${e.chefe ? 'chefe' : ''} ${clicavel ? 'alvo' : ''}"
             ${clicavel ? `onclick="UICombate.escolherAlvo(${i})"` : ''}>
          ${this._floatsDe('e_' + i)}
          <div class="cc-icone ${e.img ? 'com-img' : ''}" style="${e.img ? `background-image:url('${e.img}')` : ''}">${e.img ? '' : (e.icone || '👹')}</div>
          <div class="cc-info">
            <div class="cc-nome">${e.apelido} <span class="cc-cond">${this._condicoesTxt(e)}</span></div>
            <div class="cc-pv">${e.morto ? '☠️' : 'PV ' + e.pv + '/' + e.pvMax + ' · CA ' + e.ca}</div>
            ${this._barra(e.pv / e.pvMax * 100, 'pv-inimigo')}
            ${this._barra(e.atb, 'atb-inimigo')}
          </div>
        </div>`;
    }).join('');

    /* menu de ações */
    const menu = document.getElementById('cb-menu');
    const h = Combat.heroiPronto();
    if (h && !c.terminado && !c.auto) {
      const abs = GameData.get('abilities');
      const foco = (h.foco !== null && h.foco !== undefined) ? ` · <span style="color:var(--conjunto)">🔮 Foco ${h.foco}</span>` : '';
      let html = `<div class="cb-vez">▶ Vez de <b>${h.ref.nome}</b>${foco}${this.selecionando ? ' — <span style="color:var(--tocha-clara)">escolha o alvo</span> <button class="btn mini" onclick="UICombate.cancelarAlvo()">cancelar</button>' : ''}</div><div class="cb-acoes">`;
      if (!this.selecionando) {
        for (const abId of h.ref.habilidadesCombate) {
          const ab = abs[abId];
          if (!ab || ab.tipo === 'passiva') continue;
          let extra = '';
          if (abId === 'usar_pocao') extra = ` (${Engine.estado.inventario.filter(x => x === 'pocao_cura_leve').length})`;
          if (abId === 'impor_maos') extra = ` (${Engine.estado.reservaImpor} PV)`;
          if (abId === 'golpe_sagrado') {
            const lim = (h.stats.passiva && h.stats.passiva.golpeSagradoUsos) || 1;
            if ((h.usos.golpe_sagrado || 0) >= lim) extra = ' (usado)';
            else if (lim > 1) extra = ` (${lim - (h.usos.golpe_sagrado || 0)}×)`;
          }
          if (ab.usosPorCombate && abId !== 'golpe_sagrado') {
            const resta = ab.usosPorCombate - (h.usos[abId] || 0);
            extra += resta <= 0 ? ' (usado)' : (ab.usosPorCombate > 1 ? ` (${resta}×)` : '');
          }
          if (ab.circulo && h.foco !== null && h.foco !== undefined) extra += ` [${ab.circulo}◈]`;
          html += `<button class="btn mini" title="${ab.desc}" onclick="UICombate.usar('${abId}')">${ab.nome}${extra}</button>`;
        }
        // itens de GATILHO (varinhas/bastões) que ESTE herói pode ativar
        const itensDef = GameData.get('items');
        const gatilhos = [...new Set(Engine.estado.inventario)].filter(id => {
          const d = itensDef[id];
          return d && d.tipo === 'gatilho' && d.quem.includes(h.id);
        });
        for (const gid of gatilhos) {
          const d = itensDef[gid];
          const cg = Engine.estado.cargas[gid] || 0;
          html += `<button class="btn mini gatilho" ${cg <= 0 ? 'disabled' : ''} title="${d.efeito} ${d.desc}" onclick="UICombate.usar('gatilho:${gid}')">⚡ ${d.nome.replace('Varinha de ', 'Varinha: ').replace('Bastão das ', 'Bastão: ')} (${cg})</button>`;
        }
        if (c.enc.forjaInstavel && !c.forjaUsada) {
          html += `<button class="btn mini destaque" title="Arromba a válvula da forja: 3d6 de dano e ATORDOA o gigante. 1× por combate." onclick="UICombate.usar('forja')">💨 Liberar Vapor da Forja</button>`;
        }
        html += `<button class="btn mini" onclick="Combat.tentarFugir()">🏃 Fugir (50%)</button>`;
        html += `<button class="btn mini ajuda-taticas" onclick="UICombate.painelTaticas()" title="Como cada herói funciona: furtivo, foco, gatilhos.">📖 Táticas</button>`;
      }
      html += '</div>';
      menu.innerHTML = html;
    } else {
      menu.innerHTML = c.terminado ? '' : `<div class="cb-vez" style="opacity:.6">${c.auto ? '⚡ Auto-batalha em curso...' : '⏳ As barras de ação correm...'}</div>`;
    }

    /* log */
    const log = document.getElementById('cb-log');
    log.innerHTML = c.log.slice(-6).map(l => `<div>${l}</div>`).join('');
    log.scrollTop = log.scrollHeight;
  },

  usar(abId) {
    // gatilho de dano único precisa de alvo; cura e área, não
    if (abId.indexOf('gatilho:') === 0) {
      const d = GameData.get('items')[abId.slice(8)];
      if (d && d.gatilho.dano && !d.gatilho.area) {
        const vivos = Combat.c.inimigos.filter(e => !e.morto && !e.fugiu);
        if (vivos.length === 1) { Combat.agir(abId, Combat.c.inimigos.indexOf(vivos[0])); return; }
        this.selecionando = abId;
        this.render();
        return;
      }
      Combat.agir(abId);
      return;
    }
    const ab = GameData.get('abilities')[abId] || {};
    const precisaAlvo = ['atacar', 'golpe_sagrado', 'truque_sujo', 'misseis_magicos', 'raio_de_gelo'];
    if (ab.alvo === 'inimigo' || precisaAlvo.includes(abId)) {
      const vivos = Combat.c.inimigos.filter(e => !e.morto && !e.fugiu);
      if (vivos.length === 1) { Combat.agir(abId, Combat.c.inimigos.indexOf(vivos[0])); return; }
      this.selecionando = abId;
      this.render();
    } else {
      Combat.agir(abId);
    }
  },

  escolherAlvo(idx) {
    if (!this.selecionando) return;
    const ab = this.selecionando;
    this.selecionando = null;
    Combat.agir(ab, idx);
  },

  cancelarAlvo() { this.selecionando = null; this.render(); },

  /* ---------- 📖 Táticas: como cada herói funciona (funciona no toque) ---------- */
  painelTaticas() {
    const antigo = document.getElementById('painel-taticas');
    if (antigo) { antigo.remove(); return; }
    const abs = GameData.get('abilities');
    const est = Engine.estado;
    const nivelL = est.herois.ladino ? est.herois.ladino.nivel : 1;
    const dadosFurtivo = Math.max(1, Math.ceil(nivelL / 2));

    const blocoHeroi = (id, dicas) => {
      const hr = est.herois[id];
      if (!hr || !est.party.includes(id)) return '';
      const habs = (hr.habilidadesCombate || [])
        .map(a => abs[a]).filter(a => a && a.tipo !== 'passiva')
        .map(a => `<li><b>${a.nome}</b>${a.circulo ? ` <span style="color:var(--conjunto)">[${a.circulo}◈ foco]</span>` : ''} — ${a.desc}</li>`).join('');
      return `<div class="bloco"><h4>${hr.nome} <span style="color:var(--texto-fraco)">(${hr.classe})</span></h4>
        ${dicas}<ul class="lista-simples" style="font-size:13px">${habs}</ul></div>`;
    };

    const dicaLadino = `<p class="dica-tatica">🗡️ <b>ATAQUE FURTIVO (+${dadosFurtivo}d6)</b> — sai <u>sozinho</u> sempre que o alvo estiver
      <b>ATORDOADO</b>, <b>CEGO</b> ou <b>DORMINDO</b>, ou quando o ladino estiver <b>OCULTO</b>.
      A jogada clássica: <b>💨 Truque Sujo</b> (atordoa) e no turno seguinte o golpe entra com os dados extras.
      O dado extra cresce com o nível.</p>`;
    const dicaMaga = `<p class="dica-tatica">🔮 <b>FOCO ARCANO</b> — o orçamento de magia de CADA combate (recarrega na luta seguinte).
      Cada magia custa o círculo dela, mostrado como [n◈].
      📜 <b>APRENDER MAGIAS NOVAS</b>: compre/encontre <b>pergaminhos de magia</b> e estude-os no
      <b>DESCANSO</b> (botão "📖 Estudar o grimório"). O estudo rola Identificar Magia e gasta tinta — falhou, tenta no próximo descanso.</p>`;
    const dicaPaladino = `<p class="dica-tatica">⚔️ <b>LINHA DE FRENTE</b> — ☀️ Golpe Sagrado devasta o MAL (chefes adoram ser o alvo);
      ✋ Impor as Mãos cura o aliado mais ferido usando a reserva diária (renova no descanso).</p>`;
    const dicaGatilhos = `<div class="bloco"><h4>⚡ Itens de gatilho (varinhas & bastões)</h4>
      <p class="dica-tatica">Disparam a magia <b>sem teste e sem gastar foco</b> — consomem <b>CARGAS</b>.
      Regra de D&D 3.5: só ativa quem tem a magia na <b>lista da classe</b> —
      varinhas arcanas são da <b>maga</b>; a Varinha de Cura também obedece ao <b>paladino</b>.
      O ladino não ativa nenhuma (e resmunga sobre isso). À venda na Forja do Bruno; aparecem como ⚡ no menu de quem pode usar.</p></div>`;

    const painel = UI.el('div', 'painel-cheio');
    painel.id = 'painel-taticas';
    painel.style.zIndex = 60;
    painel.innerHTML = `
      <h2>📖 Táticas da Party</h2>
      <button class="btn fechar" onclick="this.parentElement.remove()">✕ Fechar</button>
      ${blocoHeroi('paladino', dicaPaladino)}
      ${blocoHeroi('ladino', dicaLadino)}
      ${blocoHeroi('maga', dicaMaga)}
      ${dicaGatilhos}`;
    UI.raiz.appendChild(painel);
  },

  /* ---------- Fim de combate ---------- */
  telaFim(resultado, premio) {
    this.selecionando = null;
    const painel = UI.el('div', 'painel-cheio');
    painel.style.background = 'rgba(8,11,16,.9)';

    if (resultado === 'vitoria') {
      const cfg = GameData.get('config');
      const cartasLoot = [
        ...premio.fixos.map(f => `<div class="carta-loot" style="border-color:${cfg.raridades[f.raridade].cor}">
            <b style="color:${cfg.raridades[f.raridade].cor}">${f.nome}</b><br><span>${f.desc}</span></div>`),
        ...premio.drops.map(d => `<div class="carta-loot" style="border-color:${Loot.corItem(d)}">
            <b style="color:${Loot.corItem(d)}">${Loot.nomeExibicao(d)}</b><br>
            <span>${d.naoIdentificado ? 'Identifique na mochila (pergaminho) ou equipe às cegas — por sua conta e risco.' : (d.lore || 'Item de ' + d.raridade + '.')}</span></div>`)
      ].join('') || '<p style="color:var(--texto-fraco)">Nenhum item desta vez — os deuses do loot são caprichosos.</p>';

      painel.innerHTML = `
        <h2>🏆 VITÓRIA!</h2>
        <div class="bloco">
          <h4>Recompensas</h4>
          <p style="font-size:16px">✨ <b>+${premio.xp} XP</b>${premio.subiu ? ` — <span style="color:var(--conjunto)">A PARTY SOBE PARA O NÍVEL ${premio.nivel}!</span>` : ''} · 💰 <b>+${premio.ouro} po</b></p>
        </div>
        <div class="bloco"><h4>Espólios</h4><div class="cartas-loot">${cartasLoot}</div></div>
        <button class="btn destaque" onclick="UICombate.fecharFim('vitoria')">Continuar ▸</button>`;
    } else if (resultado === 'derrota') {
      painel.innerHTML = `
        <h2>💀 DERROTA...</h2>
        <div class="bloco">
          <p style="font-size:16px;line-height:1.6">A escuridão desce — mas a Triuni ainda tem planos para vocês. Mineradores encontram os corpos e os arrastam de volta à taverna de Renânia.</p>
          <p style="margin-top:10px">PV restaurados. <b style="color:var(--sangue)">−${premio.perda} po</b> pagos ao curandeiro da vila.</p>
        </div>
        <button class="btn destaque" onclick="UICombate.fecharFim('derrota')">Voltar a Renânia</button>`;
    } else { // fuga
      painel.innerHTML = `
        <h2>🏃 Fuga!</h2>
        <div class="bloco"><p style="font-size:16px">Vocês escapam por pouco. O nó continua lá — mais forte do que a vergonha, com sorte, é a próxima tentativa.</p></div>
        <button class="btn destaque" onclick="UICombate.fecharFim('fuga')">Voltar ao mapa</button>`;
    }
    UI.raiz.appendChild(painel);
  },

  fecharFim(resultado) {
    const ctx = this.contexto || {};
    const enc = Combat.c.enc;
    Combat.c = null;
    UI.atualizarHud();
    Musica.tocar(resultado === 'derrota' ? 'cidade' : 'estrada');

    if (resultado === 'vitoria') {
      if (!ctx.farm && ctx.noId) {
        Engine.concluirNo(ctx.noId);
        const etapasM1 = { no_mina_entrada: 'e3', no_caverna: 'e4', no_fundo: 'e5' };
        const etapasM2 = { no_galeria: 'e2', no_bolsao: 'e3', no_antessala: 'e4', no_fissura: 'e5', no_paredao: 'e6' };
        const etapasM3 = { no_m3_vau: 'e3', no_m3_capela: 'e4', no_m3_pasto: 'e6', no_m3_covil: 'e7' };
        if (etapasM1[ctx.noId]) Engine.marcarEtapa('missao1', etapasM1[ctx.noId]);
        if (etapasM2[ctx.noId]) Engine.marcarEtapa('missao2', etapasM2[ctx.noId]);
        if (etapasM3[ctx.noId]) Engine.marcarEtapa('missao3', etapasM3[ctx.noId]);
      }
      if (enc.posVitoria && !ctx.farm) { UI.contextoCena = null; UI.abrirDialogo(enc.posVitoria); return; }
      UI.telaMapa();
    } else if (resultado === 'derrota') {
      UI.telaCidade();
      UI.toast('🛏️ Vocês acordam na taverna, vivos. É o que conta.');
    } else {
      UI.telaMapa();
    }
  }
};
