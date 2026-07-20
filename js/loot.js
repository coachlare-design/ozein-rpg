/* =====================================================
   OZEIN RPG — js/loot.js
   Geração de loot (Diablo-style): raridade → base → afixos.
   Também calcula os stats efetivos do herói equipado.
   ===================================================== */
'use strict';

const Loot = {

  _sortear(lista) { return lista[Math.floor(Math.random() * lista.length)]; },

  _sortearPeso(pesos) {
    const total = Object.values(pesos).reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (const [chave, peso] of Object.entries(pesos)) {
      r -= peso;
      if (r <= 0) return chave;
    }
    return 'normal';
  },

  /* Gera 1 item aleatório para o iLvl/tier dados.
     Itens mágicos+ nascem NÃO-identificados. */
  gerarItem(iLvl, tier) {
    const L = GameData.get('loot');
    const tabela = L.tabelaDrop[tier] || L.tabelaDrop.baixo;
    const raridade = this._sortearPeso(tabela.pesos);

    if (raridade === 'unico') {
      const pool = L.unicos.filter(u => u.iLvl <= iLvl + 1);
      if (pool.length) {
        const u = JSON.parse(JSON.stringify(this._sortear(pool)));
        u.raridade = 'unico'; u.gerado = true; u.naoIdentificado = true;
        u.uid = 'it' + Math.floor(Math.random() * 1e9);
        return u;
      }
      // sem único disponível → cai pra raro
      return this._gerarComAfixos(iLvl, 'raro');
    }

    if (raridade === 'conjunto') {
      const pecas = L.conjuntos.flatMap(c => c.pecas.map(p => ({ ...p, conjuntoId: c.id, conjuntoNome: c.nome })));
      const pool = pecas.filter(p => p.iLvl <= iLvl + 1);
      if (pool.length) {
        const p = JSON.parse(JSON.stringify(this._sortear(pool)));
        p.raridade = 'conjunto'; p.gerado = true; p.naoIdentificado = true;
        p.uid = 'it' + Math.floor(Math.random() * 1e9);
        return p;
      }
      return this._gerarComAfixos(iLvl, 'magico');
    }

    return this._gerarComAfixos(iLvl, raridade);
  },

  _gerarComAfixos(iLvl, raridade) {
    const L = GameData.get('loot');
    const basesOk = L.bases.filter(b => b.iLvlMin <= iLvl);
    const base = JSON.parse(JSON.stringify(this._sortear(basesOk)));
    const item = {
      ...base,
      uid: 'it' + Math.floor(Math.random() * 1e9),
      raridade, gerado: true,
      afixos: [],
      nomeBase: base.nome
    };

    const podePrefixo = (p) => p.iLvl <= iLvl && (!p.slots || p.slots.includes(base.slot)) &&
      // afixos de dano/acerto só em armas; CA só em defesas
      !((p.efeito.bonusDano || p.efeito.danoExtra) && base.slot !== 'arma');

    const nAfixos = raridade === 'raro' ? 2 + (Math.random() < 0.5 ? 1 : 0) : raridade === 'magico' ? 1 : 0;
    const prefixosOk = L.prefixos.filter(podePrefixo);
    const sufixosOk = L.sufixos.filter(sf => sf.iLvl <= iLvl);

    let nome = base.nome;
    for (let i = 0; i < nAfixos; i++) {
      const usarPrefixo = (i === 0 && Math.random() < 0.5 && prefixosOk.length) || !sufixosOk.length;
      if (usarPrefixo && prefixosOk.length) {
        const p = this._sortear(prefixosOk);
        if (!item.afixos.some(a => a.id === p.id)) { item.afixos.push(p); nome = p.nome + ' ' + nome; }
      } else if (sufixosOk.length) {
        const sf = this._sortear(sufixosOk);
        if (!item.afixos.some(a => a.id === sf.id)) { item.afixos.push(sf); if (!nome.includes(sf.nome)) nome = nome + ' ' + sf.nome; }
      }
    }
    item.nome = nome;
    item.valor = Math.round((base.valor + item.afixos.length * 60) * (raridade === 'raro' ? 2.2 : raridade === 'magico' ? 1.4 : 1));
    if (raridade !== 'normal') item.naoIdentificado = true;
    return item;
  },

  /* Identificação — por pergaminho (seguro) ou ao equipar (risco de maldição) */
  identificar(item, comRisco) {
    item.naoIdentificado = false;
    if (comRisco && Math.random() < 0.2) {
      const L = GameData.get('loot');
      const m = JSON.parse(JSON.stringify(this._sortear(L.maldicoes)));
      item.maldicao = m;
      item.nome = item.nome + ' ' + m.nome;
      return m; // devolve a maldição pra UI avisar
    }
    return null;
  },

  nomeExibicao(item) {
    if (item.naoIdentificado) {
      const slot = item.slot ? item.slot.toUpperCase() : 'ITEM';
      return `??? ${item.nomeBase || item.nome} (não identificado)`;
    }
    return item.nome;
  },

  /* ---------- Restrições de classe (D&D 3.5) ----------
     Proficiências por classe. Itens sem categoria caem no fallback:
     arma → marcial; armadura → pelo peso (caBonus); escudo → escudo. */
  PROFICIENCIAS: {
    'Paladino': { armas: ['simples', 'marcial', 'ladino'], armaduras: ['leve', 'media', 'pesada'], escudo: true },
    'Ladino':   { armas: ['simples', 'ladino'],            armaduras: ['leve'],                   escudo: false },
    'Maga':     { armas: ['simples'],                      armaduras: [],                         escudo: false }
  },
  _classeDe(heroi) {
    const c = heroi.classe || '';
    if (c.indexOf('Paladino') >= 0) return 'Paladino';
    if (c.indexOf('Ladino') >= 0) return 'Ladino';
    return 'Maga';
  },
  _categoriaDe(item) {
    if (item.categoria) return item.categoria;
    if (item.slot === 'arma') return 'marcial';
    if (item.slot === 'armadura') return (item.caBonus || 0) <= 3 ? 'leve' : ((item.caBonus || 0) <= 5 ? 'media' : 'pesada');
    return null;
  },
  podeEquipar(heroi, item) {
    if (!item || !item.slot) return { pode: false, motivo: 'Este item não se equipa.' };
    // elmos, botas, anéis e amuletos: livres para todos
    if (['elmo', 'botas', 'anel', 'anel1', 'anel2', 'amuleto'].includes(item.slot)) return { pode: true };
    const cls = this._classeDe(heroi);
    const prof = this.PROFICIENCIAS[cls];
    const cat = this._categoriaDe(item);
    if (item.slot === 'arma' && !prof.armas.includes(cat)) {
      const motivos = {
        'Maga': '🚫 D&D 3.5: magas só treinam armas SIMPLES (adaga, bordão). ' + item.nome + ' fica para quem jurou pelo aço.',
        'Ladino': '🚫 Fora da lista do ladino (D&D 3.5): ele luta com armas simples, espada curta e rapieira — leves e rápidas como ele.'
      };
      return { pode: false, motivo: motivos[cls] || '🚫 ' + cls + ' não tem proficiência com ' + item.nome + '.' };
    }
    if (item.slot === 'armadura' && !prof.armaduras.includes(cat)) {
      const motivos = {
        'Maga': '🚫 D&D 3.5: magos NÃO vestem armadura — os gestos das magias falham dentro de couro e aço (falha arcana).',
        'Ladino': '🚫 Ladinos vestem no máximo armadura LEVE — furtividade e evasão morrem dentro de uma cota de malha.'
      };
      return { pode: false, motivo: motivos[cls] || '🚫 Armadura pesada demais para ' + cls + '.' };
    }
    if (item.slot === 'escudo' && !prof.escudo) {
      const motivos = {
        'Maga': '🚫 Escudo atrapalha os gestos arcanos (falha arcana). A melhor defesa da maga é o Escudo Arcano.',
        'Ladino': '🚫 Ladinos não usam escudo — as duas mãos pertencem às adagas e às fechaduras.'
      };
      return { pode: false, motivo: motivos[cls] || '🚫 ' + cls + ' não usa escudo.' };
    }
    return { pode: true };
  },
  /* Ícones de quem pode usar o item (mostrado no inventário) */
  quemUsa(item) {
    if (!item || !item.slot) return '';
    const icones = { 'Paladino': '⚔️', 'Ladino': '🗡️', 'Maga': '🔮' };
    const podem = ['Paladino', 'Ladino', 'Maga']
      .filter(cls => this.podeEquipar({ classe: cls }, item).pode)
      .map(cls => icones[cls]);
    return podem.length === 3 ? '' : ' <span title="Quem pode equipar (regras de classe D&D)">[' + podem.join('') + ']</span>';
  },

  corItem(item) {
    const cfg = GameData.get('config');
    return cfg.raridades[item.raridade] ? cfg.raridades[item.raridade].cor : '#c8c8c8';
  },

  /* ---------- Stats efetivos do herói (base + equipamento) ---------- */
  _somarEfeitos(equip, chave) {
    let total = 0;
    for (const item of Object.values(equip)) {
      if (!item || item.naoIdentificado) continue;
      if (item.efeito && item.efeito[chave]) total += item.efeito[chave];
      for (const a of (item.afixos || [])) if (a.efeito[chave]) total += a.efeito[chave];
      if (item.maldicao && item.maldicao.efeito[chave]) total += item.maldicao.efeito[chave];
    }
    return total;
  },

  bonusConjunto(equip) {
    const L = GameData.get('loot');
    const bonus = {};
    for (const c of L.conjuntos) {
      const equipadas = Object.values(equip).filter(i => i && i.conjuntoId === c.id && !i.naoIdentificado).length;
      if (equipadas >= 2) for (const [k, v] of Object.entries(c.bonus2)) bonus[k] = (bonus[k] || 0) + v;
    }
    return bonus;
  },

  /* Classe de prestígio do herói (ou null) */
  prestigioDe(heroi) {
    if (!heroi || !heroi.prestigio) return null;
    const P = GameData.get('prestige');
    const lista = P[heroi.id] || [];
    return lista.find(p => p.id === heroi.prestigio) || null;
  },

  statsHeroi(heroi, equip) {
    const conj = this.bonusConjunto(equip);
    const prest = this.prestigioDe(heroi);
    const pb = prest ? (prest.bonus || {}) : {};
    const somar = (k) => this._somarEfeitos(equip, k) + (conj[k] || 0) + (pb[k] || 0);

    // atributos com bônus de item
    const atrs = { ...heroi.atributos };
    for (const item of Object.values(equip)) {
      if (!item || item.naoIdentificado) continue;
      const todos = [...(item.afixos || []).map(a => a.efeito), item.efeito || {}];
      for (const ef of todos) if (ef.atributo) atrs[ef.atributo] = (atrs[ef.atributo] || 10) + ef.bonus;
    }

    const modFor = Regras.mod(atrs.FOR), modDes = Regras.mod(atrs.DES);
    const arma = equip.arma;
    const armaduraCA = (equip.armadura && !equip.armadura.naoIdentificado ? (equip.armadura.caBonus || 0) : 0) +
                       (equip.escudo && !equip.escudo.naoIdentificado ? (equip.escudo.caBonus || 0) : 0) +
                       (equip.elmo && !equip.elmo.naoIdentificado ? (equip.elmo.caBonus || 0) : 0);

    const usaDes = arma && arma.critico && arma.critico.startsWith('18'); // rapieira → acuidade
    const modAtk = usaDes ? Math.max(modFor, modDes) : modFor;

    const passiva = prest ? (prest.passiva || {}) : {};
    const salvaPrest = (t) => (pb.salvamentos && pb.salvamentos[t]) || 0;

    return {
      atributos: atrs,
      ca: 10 + armaduraCA + modDes + somar('caExtra') + (passiva.caInt ? Math.max(0, Regras.mod(atrs.INT)) : 0),
      ataque: heroi.bba + modAtk + somar('bonusAcerto'),
      danoDado: arma && arma.dano ? arma.dano : '1d3',
      danoBonus: modFor + somar('bonusDano'),
      danoExtraElem: this._danosElementais(equip),
      critico: arma && arma.critico ? arma.critico : '20/×2',
      pvMax: heroi.pvBase + somar('pvExtra'),
      salvamentos: {
        fortitude: heroi.salvamentos.fortitude + this._somarSalva(equip, 'fortitude', conj) + salvaPrest('fortitude'),
        reflexos: heroi.salvamentos.reflexos + this._somarSalva(equip, 'reflexos', conj) + salvaPrest('reflexos'),
        vontade: heroi.salvamentos.vontade + this._somarSalva(equip, 'vontade', conj) + salvaPrest('vontade')
      },
      roubo: somar('roubo'),
      passiva
    };
  },

  _somarSalva(equip, tipo, conj) {
    let total = 0;
    for (const item of Object.values(equip)) {
      if (!item || item.naoIdentificado) continue;
      const todos = [...(item.afixos || []).map(a => a.efeito), item.efeito || {}];
      for (const ef of todos) if (ef.salvamento === tipo) total += ef.bonus;
    }
    return total;
  },

  _danosElementais(equip) {
    const extras = [];
    const arma = equip.arma;
    if (!arma || arma.naoIdentificado) return extras;
    const todos = [...(arma.afixos || []).map(a => a.efeito), arma.efeito || {}];
    for (const ef of todos) if (ef.danoExtra) extras.push({ dado: ef.danoExtra, elemento: ef.elemento });
    return extras;
  },

  /* Rola dano de um encontro: ouro dentro da faixa */
  rolarOuro(faixa) {
    return faixa[0] + Math.floor(Math.random() * (faixa[1] - faixa[0] + 1));
  }
};
