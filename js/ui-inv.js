/* =====================================================
   OZEIN RPG — js/ui-inv.js
   Inventário (mochila + equipamento por herói) e a
   Loja do Mestre Bruno (comprar, vender, remover maldição).
   ===================================================== */
'use strict';

const UIInv = {
  heroiSel: null,

  /* ---------- INVENTÁRIO ---------- */
  telaInventario() {
    if (!this.heroiSel || !Engine.estado.party.includes(this.heroiSel)) this.heroiSel = Engine.estado.party[0];
    const antigo = document.getElementById('painel-inv');
    if (antigo) antigo.remove();

    const est = Engine.estado;
    const heroi = est.herois[this.heroiSel];
    const equip = est.equips[this.heroiSel];
    const stats = Loot.statsHeroi(heroi, equip);

    const abas = est.party.map(id =>
      `<button class="btn mini ${id === this.heroiSel ? 'destaque' : ''}" onclick="UIInv.trocarAba('${id}')">${est.herois[id].nome}</button>`).join(' ');

    const SLOTS = [['arma', '⚔️ Arma'], ['armadura', '🛡️ Armadura'], ['escudo', '🛡 Escudo'], ['elmo', '⛑️ Elmo'],
                   ['amuleto', '📿 Amuleto'], ['anel1', '💍 Anel 1'], ['anel2', '💍 Anel 2'], ['botas', '🥾 Botas']];
    const slotsHtml = SLOTS.map(([slot, rotulo]) => {
      const it = equip[slot];
      return `<div class="slot-equip">
        <div class="slot-rotulo">${rotulo}</div>
        ${it ? `<div class="slot-item" style="color:${Loot.corItem(it)}">${Loot.nomeExibicao(it)}
                 <button class="btn mini" onclick="UIInv.desequipar('${slot}')">tirar</button></div>`
             : '<div class="slot-item vazio">—</div>'}
      </div>`;
    }).join('');

    const consum = {};
    for (const id of est.inventario) consum[id] = (consum[id] || 0) + 1;
    const consumHtml = Object.entries(consum).map(([id, n]) => {
      const it = GameData.get('items')[id];
      const usavel = id === 'pocao_cura_leve';
      const cargas = it.tipo === 'gatilho' ? ` <b style="color:var(--conjunto)">⚡ ${Engine.estado.cargas[id] || 0} cargas</b>` : '';
      const quem = it.tipo === 'gatilho' && it.quem ? ` <span style="color:var(--texto-fraco)">(usa em combate: ${it.quem.map(q => Engine.estado.herois[q] ? Engine.estado.herois[q].nome : q).join(', ')})</span>` : '';
      return `<li><b>${it.nome}</b> ×${n}${cargas} — <span style="color:var(--texto-fraco)">${it.efeito || it.desc}</span>${quem}
        ${usavel ? `<button class="btn mini" onclick="UIInv.usarPocao()">usar</button>` : ''}</li>`;
    }).join('') || '<li style="color:var(--texto-fraco)">Nada além de fiapos de bolso.</li>';

    const mochilaHtml = est.mochila.map((it, i) => {
      const cor = Loot.corItem(it);
      const podeEquipar = !!it.slot;
      let acoes = '';
      if (it.naoIdentificado) {
        const temPerg = est.inventario.includes('pergaminho_identificar');
        acoes += temPerg ? `<button class="btn mini" onclick="UIInv.identificar(${i}, false)">📜 identificar</button>` : `<span class="aviso-mini">sem pergaminho</span>`;
        if (podeEquipar) acoes += `<button class="btn mini" onclick="UIInv.identificar(${i}, true)" title="20% de chance de revelar uma maldição — que só o Bruno remove.">😨 equipar às cegas</button>`;
      } else if (podeEquipar) {
        acoes += `<button class="btn mini" onclick="UIInv.equipar(${i})">equipar</button>`;
      }
      const detalhes = it.naoIdentificado ? 'Propriedades ocultas.' :
        [it.dano ? `Dano ${it.dano} (${it.critico})` : '', it.caBonus ? `CA +${it.caBonus}` : '',
         ...(it.afixos || []).map(a => this._efeitoTxt(a.efeito)),
         it.efeito ? this._efeitoTxt(it.efeito) : '',
         it.maldicao ? `<span style="color:var(--sangue)">${this._efeitoTxt(it.maldicao.efeito)} — ${it.maldicao.desc}</span>` : '',
         it.conjuntoNome ? `Conjunto: ${it.conjuntoNome}` : '', it.lore ? `<i>${it.lore}</i>` : '']
        .filter(Boolean).join(' · ');
      return `<li><b style="color:${cor}">${Loot.nomeExibicao(it)}</b> <span class="tag-raridade" style="color:${cor}">${GameData.get('config').raridades[it.raridade].nome}</span>${it.naoIdentificado ? '' : Loot.quemUsa(it)}<br>
        <span style="color:var(--texto-fraco);font-size:13px">${detalhes}</span><br>${acoes}</li>`;
    }).join('') || '<li style="color:var(--texto-fraco)">Mochila vazia. As minas resolvem isso.</li>';

    const painel = UI.el('div', 'painel-cheio');
    painel.id = 'painel-inv';
    painel.innerHTML = `
      <h2>🎒 Inventário da Party</h2>
      <button class="btn fechar" onclick="this.parentElement.remove()">✕ Fechar</button>
      <div style="margin-bottom:14px">${abas}</div>
      <div class="grade-ficha">
        <div>
          <div class="bloco"><h4>Equipado — ${heroi.nome}</h4>${slotsHtml}</div>
          <div class="bloco"><h4>Stats com equipamento</h4>
            <ul class="lista-simples">
              <li>PV máx <b>${stats.pvMax}</b> · CA <b>${stats.ca}</b></li>
              <li>Ataque <b>${Regras.fmtMod(stats.ataque)}</b> · Dano <b>${stats.danoDado}${stats.danoBonus ? Regras.fmtMod(stats.danoBonus) : ''}</b> (${stats.critico})</li>
              ${stats.danoExtraElem.map(e => `<li>Dano extra: <b>${e.dado} ${e.elemento}</b></li>`).join('')}
              <li>Fort <b>${Regras.fmtMod(stats.salvamentos.fortitude)}</b> · Refl <b>${Regras.fmtMod(stats.salvamentos.reflexos)}</b> · Von <b>${Regras.fmtMod(stats.salvamentos.vontade)}</b></li>
            </ul>
          </div>
          <div class="bloco"><h4>Consumíveis (da party)</h4><ul class="lista-simples">${consumHtml}</ul></div>
        </div>
        <div><div class="bloco"><h4>Mochila (${est.mochila.length})</h4><ul class="lista-simples">${mochilaHtml}</ul></div></div>
      </div>`;
    UI.raiz.appendChild(painel);
  },

  _efeitoTxt(ef) {
    const partes = [];
    if (ef.bonusDano) partes.push(`dano ${Regras.fmtMod(ef.bonusDano)}`);
    if (ef.bonusAcerto) partes.push(`acerto ${Regras.fmtMod(ef.bonusAcerto)}`);
    if (ef.caExtra) partes.push(`CA ${Regras.fmtMod(ef.caExtra)}`);
    if (ef.pvExtra) partes.push(`PV ${Regras.fmtMod(ef.pvExtra)}`);
    if (ef.danoExtra) partes.push(`+${ef.danoExtra} ${ef.elemento}`);
    if (ef.atributo) partes.push(`${ef.atributo} ${Regras.fmtMod(ef.bonus)}`);
    if (ef.salvamento) partes.push(`${ef.salvamento} ${Regras.fmtMod(ef.bonus)}`);
    if (ef.roubo) partes.push(`rouba ${ef.roubo} PV por acerto`);
    return partes.join(', ');
  },

  trocarAba(id) { this.heroiSel = id; this.telaInventario(); },

  equipar(i) {
    const est = Engine.estado;
    const it = est.mochila[i];
    if (!it || !it.slot) return;
    const regra = Loot.podeEquipar(est.herois[this.heroiSel], it);
    if (!regra.pode) { UI.toast(regra.motivo); return; }
    let slot = it.slot;
    if (slot === 'anel') slot = !est.equips[this.heroiSel].anel1 ? 'anel1' : (!est.equips[this.heroiSel].anel2 ? 'anel2' : 'anel1');
    const atual = est.equips[this.heroiSel][slot];
    if (atual) est.mochila.push(atual);
    est.equips[this.heroiSel][slot] = it;
    est.mochila.splice(i, 1);
    Engine.ajustarPvAoMax();
    UI.atualizarHud();
    this.telaInventario();
    UI.toast(`⚔️ ${est.herois[this.heroiSel].nome} equipa ${it.nome}.`);
  },

  desequipar(slot) {
    const est = Engine.estado;
    const it = est.equips[this.heroiSel][slot];
    if (!it) return;
    if (it.maldicao) { UI.toast('⛓️ Amaldiçoado! Só o Mestre Bruno remove (na loja).'); return; }
    est.equips[this.heroiSel][slot] = null;
    est.mochila.push(it);
    Engine.ajustarPvAoMax();
    UI.atualizarHud();
    this.telaInventario();
  },

  identificar(i, comRisco) {
    const est = Engine.estado;
    const it = est.mochila[i];
    if (!it) return;
    if (!comRisco) {
      const idx = est.inventario.indexOf('pergaminho_identificar');
      if (idx < 0) { UI.toast('📜 Sem pergaminhos — o Bruno vende.'); return; }
      est.inventario.splice(idx, 1);
      Loot.identificar(it, false);
      UI.toast(`📜 Identificado: ${it.nome}!`);
    } else {
      const maldicao = Loot.identificar(it, true);
      if (maldicao) UI.toast(`⛓️ MALDIÇÃO! ${it.nome} — ${maldicao.desc}`);
      else UI.toast(`😅 Sorte! ${it.nome} — sem maldição.`);
      if (it.slot) { this.telaInventario(); this.equipar(est.mochila.indexOf(it)); return; }
    }
    this.telaInventario();
  },

  usarPocao() {
    const est = Engine.estado;
    const idx = est.inventario.indexOf('pocao_cura_leve');
    if (idx < 0) return;
    const heroi = est.herois[this.heroiSel];
    const stats = Loot.statsHeroi(heroi, est.equips[this.heroiSel]);
    if (est.pv[this.heroiSel] >= stats.pvMax) { UI.toast('PV já está cheio.'); return; }
    est.inventario.splice(idx, 1);
    const cura = Combat.rolarDado('1d8+1');
    est.pv[this.heroiSel] = Math.min(stats.pvMax, est.pv[this.heroiSel] + cura);
    UI.atualizarHud();
    this.telaInventario();
    UI.toast(`🧪 +${cura} PV em ${heroi.nome}.`);
  },

  /* ---------- LOJAS (Bruno em Renânia · Empório da Guilda em Úbia) ---------- */
  lojaAtual: 'bruno',
  _ofertaLoja() {
    const L = GameData.get('loot');
    return this.lojaAtual === 'ubia' ? (L.lojaUbia || L.loja) : L.loja;
  },

  telaLoja(lojaId) {
    if (lojaId) this.lojaAtual = lojaId;
    const antigo = document.getElementById('painel-loja');
    if (antigo) antigo.remove();
    const est = Engine.estado;
    const L = GameData.get('loot');
    const itens = GameData.get('items');

    const comprarHtml = this._ofertaLoja().map((of, i) => {
      const nome = of.item ? itens[of.item].nome : L.bases.find(b => b.id === of.base).nome;
      const desc = of.item ? (itens[of.item].efeito || itens[of.item].desc) : 'Equipamento base, sem encantos.';
      return `<li><b>${nome}</b> — <span style="color:var(--ouro)">${of.preco} po</span><br>
        <span style="color:var(--texto-fraco);font-size:13px">${desc}</span>
        <button class="btn mini" onclick="UIInv.comprar(${i})">comprar</button></li>`;
    }).join('');

    const venderHtml = est.mochila.map((it, i) => {
      const preco = Math.max(1, Math.floor((it.valor || 5) * L.fatorVenda));
      return `<li><b style="color:${Loot.corItem(it)}">${Loot.nomeExibicao(it)}</b> — Bruno paga <span style="color:var(--ouro)">${preco} po</span>
        <button class="btn mini" onclick="UIInv.vender(${i})">vender</button></li>`;
    }).join('') || '<li style="color:var(--texto-fraco)">Nada pra vender. Ainda.</li>';

    // itens amaldiçoados equipados em qualquer herói
    let maldicoesHtml = '';
    for (const hid of est.party) {
      for (const [slot, it] of Object.entries(est.equips[hid])) {
        if (it && it.maldicao) {
          maldicoesHtml += `<li><b style="color:${Loot.corItem(it)}">${it.nome}</b> (${est.herois[hid].nome})
            <button class="btn mini" onclick="UIInv.removerMaldicao('${hid}','${slot}')">purificar — ${L.precoRemoverMaldicao} po</button></li>`;
        }
      }
    }

    const ehUbia = this.lojaAtual === 'ubia';
    const painel = UI.el('div', 'painel-cheio');
    painel.id = 'painel-loja';
    painel.innerHTML = `
      <h2>${ehUbia ? '🏪 Empório da Guilda — Úbia' : '⚒️ Forja do Mestre Bruno'}</h2>
      <button class="btn fechar" onclick="this.parentElement.remove()">✕ Fechar</button>
      <p style="color:var(--texto-fraco);margin-bottom:14px">${ehUbia
        ? '"Desconto de membro. Não conta pro Jack que a margem já era pequena." · A intendente também purifica maldições.'
        : '"Aço honesto, preço honesto. Maldição eu tiro também — por um preço menos honesto."'}  · Seu ouro: <b style="color:var(--ouro)">${est.ouro} po</b></p>
      <div class="grade-ficha">
        <div><div class="bloco"><h4>Comprar</h4><ul class="lista-simples">${comprarHtml}</ul></div>
        ${maldicoesHtml ? `<div class="bloco"><h4>⛓️ Purificar maldições</h4><ul class="lista-simples">${maldicoesHtml}</ul></div>` : ''}</div>
        <div><div class="bloco"><h4>Vender (a casa paga 40%)</h4><ul class="lista-simples">${venderHtml}</ul></div></div>
      </div>`;
    UI.raiz.appendChild(painel);
  },

  comprar(i) {
    const est = Engine.estado;
    const L = GameData.get('loot');
    const of = this._ofertaLoja()[i];
    // pergaminhos de magia: um por vez, e só se a maga ainda não souber a magia
    if (of.item) {
      const def = GameData.get('items')[of.item];
      if (def && def.magia) {
        if (est.inventario.includes(of.item)) { UI.toast('📖 Você já tem este pergaminho — estude-o num descanso.'); return; }
        if (est.herois.maga && est.herois.maga.habilidadesCombate.includes(def.magia)) { UI.toast('📖 Esta magia já está no grimório da maga.'); return; }
      }
    }
    if (est.ouro < of.preco) { UI.toast('💰 Ouro insuficiente.'); return; }
    est.ouro -= of.preco;
    if (of.item) {
      est.inventario.push(of.item);
      const def = GameData.get('items')[of.item];
      if (def && def.tipo === 'gatilho') {
        est.cargas[of.item] = (est.cargas[of.item] || 0) + (def.cargas || 0);
        UI.toast('⚡ ' + def.nome + ': aparece no submenu GATILHOS (⚡) de quem pode ativá-la, durante o combate.');
      }
      if (def && def.magia) UI.toast('📜 Pergaminho de magia! A maga o estuda no DESCANSO — botão "📖 Estudar o grimório".');
    }
    else {
      const base = JSON.parse(JSON.stringify(L.bases.find(b => b.id === of.base)));
      base.uid = 'it' + Math.floor(Math.random() * 1e9);
      base.raridade = 'normal'; base.afixos = []; base.nomeBase = base.nome;
      est.mochila.push(base);
    }
    UI.atualizarHud();
    this.telaLoja();
    UI.toast('🛒 Comprado!');
  },

  vender(i) {
    const est = Engine.estado;
    const it = est.mochila[i];
    const preco = Math.max(1, Math.floor((it.valor || 5) * GameData.get('loot').fatorVenda));
    est.ouro += preco;
    est.mochila.splice(i, 1);
    UI.atualizarHud();
    this.telaLoja();
    UI.toast(`💰 Vendido por ${preco} po.`);
  },

  removerMaldicao(hid, slot) {
    const est = Engine.estado;
    const L = GameData.get('loot');
    if (est.ouro < L.precoRemoverMaldicao) { UI.toast('💰 Ouro insuficiente.'); return; }
    const it = est.equips[hid][slot];
    if (!it || !it.maldicao) return;
    est.ouro -= L.precoRemoverMaldicao;
    it.nome = it.nome.replace(' ' + it.maldicao.nome, '');
    delete it.maldicao;
    Engine.ajustarPvAoMax();
    UI.atualizarHud();
    this.telaLoja();
    UI.toast('✨ Maldição removida. O Bruno guarda o troco e o segredo.');
  }
};
