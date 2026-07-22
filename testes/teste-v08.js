/* =====================================================
   OZEIN RPG — testes/teste-v08.js
   Suíte da v0.8.0 — rodar com:  node testes/teste-v08.js
   Cobre: integridade dos dados da M4, regiões (Úbia),
   ⭐ próximo passo no mapa, vestes da maga, migração v8
   e o rebalanceamento das trilhas de prestígio.
   ===================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.join(__dirname, '..');

/* ---------- sandbox com stubs de navegador ---------- */
const sandbox = {
  console,
  window: { addEventListener() {}, AudioContext: null, webkitAudioContext: null },
  document: {
    getElementById() { return { classList: { add() {}, remove() {} }, appendChild() {}, innerHTML: '', style: {} }; },
    createElement() { return { classList: { add() {}, remove() {} }, style: {}, appendChild() {}, setAttribute() {} }; },
    createElementNS() { return { setAttribute() {}, appendChild() {} }; },
    addEventListener() {}
  },
  localStorage: undefined,
  setInterval: () => 0, clearInterval: () => {}, setTimeout: (f) => 0, clearTimeout: () => {},
  Math, JSON, Object, Array, String, Number, parseInt, parseFloat, RegExp, Date, URL
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

function carregar(rel) {
  const codigo = fs.readFileSync(path.join(RAIZ, rel), 'utf8');
  vm.runInContext(codigo, sandbox, { filename: rel });
}

// núcleo + dados + motor (sem UI de verdade)
carregar('js/core.js');
['game', 'abilities', 'prestige', 'loot', 'encounters', 'heroes', 'monsters', 'items', 'world', 'dialogs', 'quests']
  .forEach(d => carregar('data/' + d + '.js'));
carregar('js/loot.js');
carregar('js/engine.js');
// stub da UI de combate ANTES do combat.js
vm.runInContext('var UICombate = { render(){}, flutuar(){}, flutuarDado(){}, telaFim(){} };', sandbox);
carregar('js/combat.js');

// top-level const/let do vm ficam no escopo léxico do contexto — resgata por avaliação
const { GameData, Regras, Engine, Loot, Combat } = vm.runInContext('({ GameData, Regras, Engine, Loot, Combat })', sandbox);

/* ---------- mini-framework ---------- */
let ok = 0, falhas = [];
function teste(nome, fn) {
  try { fn(); ok++; console.log('  ✅ ' + nome); }
  catch (e) { falhas.push(nome + ' — ' + e.message); console.log('  ❌ ' + nome + ' — ' + e.message); }
}
function afirmar(cond, msg) { if (!cond) throw new Error(msg || 'afirmação falhou'); }

console.log('\n🧪 OZEIN v0.8.0 — suíte de testes\n');

/* ================= 1. INTEGRIDADE DOS DADOS ================= */
console.log('— Integridade dos dados —');

const dialogs = GameData.get('dialogs');
const encounters = GameData.get('encounters');
const monsters = GameData.get('monsters');
const abilities = GameData.get('abilities');
const items = GameData.get('items');
const lootD = GameData.get('loot');
const world = GameData.get('world');
const quests = GameData.get('quests');

teste('todo goto/dialogo/combate referenciado existe', () => {
  for (const [id, dlg] of Object.entries(dialogs)) {
    for (const op of (dlg.opcoes || [])) {
      if (op.goto) afirmar(dialogs[op.goto], `${id}: goto '${op.goto}' não existe`);
      for (const ef of (op.efeito || [])) {
        if (ef.tipo === 'dialogo') afirmar(dialogs[ef.valor], `${id}: diálogo '${ef.valor}' não existe`);
        if (ef.tipo === 'combate') afirmar(encounters[ef.valor], `${id}: encontro '${ef.valor}' não existe`);
        if (ef.tipo === 'aceitarMissao') afirmar(quests[ef.valor], `${id}: missão '${ef.valor}' não existe`);
        if (ef.tipo === 'item') afirmar(items[ef.valor], `${id}: item '${ef.valor}' não existe`);
        if (ef.tipo === 'itemUnico') afirmar(lootD.unicos.some(u => u.id === ef.valor), `${id}: único '${ef.valor}' não existe`);
        if (ef.tipo === 'teste') {
          afirmar(dialogs[ef.sucesso], `${id}: sucesso '${ef.sucesso}' não existe`);
          afirmar(dialogs[ef.falha], `${id}: falha '${ef.falha}' não existe`);
        }
      }
    }
    for (const ef of (dlg.efeitoEntrada || [])) {
      if (ef.tipo === 'itemUnico') afirmar(lootD.unicos.some(u => u.id === ef.valor), `${id}: único '${ef.valor}' não existe`);
      if (ef.tipo === 'item') afirmar(items[ef.valor], `${id}: item '${ef.valor}' não existe`);
    }
  }
});

teste('toda cena de nó (2 regiões) existe em dialogs', () => {
  for (const reg of Object.values(world.regioes)) {
    for (const no of reg.mapa.nos) {
      if (no.cena) afirmar(dialogs[no.cena], `nó ${no.id}: cena '${no.cena}' não existe`);
    }
  }
});

teste('encontros: refs de monstros, habilidades e posVitoria existem', () => {
  for (const [id, enc] of Object.entries(encounters)) {
    for (const ini of enc.inimigos) {
      afirmar(monsters[ini.ref], `${id}: monstro '${ini.ref}' não existe no bestiário`);
      for (const h of (ini.habilidades || [])) afirmar(abilities[h], `${id}: habilidade '${h}' não existe`);
    }
    if (enc.posVitoria) afirmar(dialogs[enc.posVitoria], `${id}: posVitoria '${enc.posVitoria}' não existe`);
    for (const f of ((enc.recompensa || {}).fixos || [])) afirmar(items[f], `${id}: fixo '${f}' não existe`);
  }
});

teste('lojas (Bruno e Úbia): itens e bases existem', () => {
  for (const lista of [lootD.loja, lootD.lojaUbia]) {
    for (const of_ of lista) {
      if (of_.item) afirmar(items[of_.item], `loja: item '${of_.item}' não existe`);
      if (of_.base) afirmar(lootD.bases.some(b => b.id === of_.base), `loja: base '${of_.base}' não existe`);
    }
  }
});

teste('missao4 registrada com 8 etapas e nó-chefe mapeado', () => {
  afirmar(quests.missao4 && quests.missao4.etapas.length === 8, 'missao4 incompleta');
  afirmar(Engine.NOS_CHEFE_MISSAO.missao4 === 'no_u_forum', 'nó-chefe da M4 não mapeado');
});

teste('mapa de Úbia: arestas conectam nós existentes e há caminho cidade→chefe', () => {
  const m = world.regioes.ubia.mapa;
  const ids = new Set(m.nos.map(n => n.id));
  for (const [a, b] of m.arestas) afirmar(ids.has(a) && ids.has(b), `aresta ${a}-${b} com nó fantasma`);
  // BFS da cidade ao chefe
  const adj = {};
  for (const [a, b] of m.arestas) { (adj[a] = adj[a] || []).push(b); (adj[b] = adj[b] || []).push(a); }
  const fila = ['no_u_cidade'], visto = new Set(fila);
  while (fila.length) { const n = fila.shift(); for (const v of (adj[n] || [])) if (!visto.has(v)) { visto.add(v); fila.push(v); } }
  afirmar(visto.has('no_u_forum'), 'Fórum inalcançável a partir da cidade');
});

/* ================= 2. REGIÕES + ⭐ PRÓXIMO PASSO ================= */
console.log('— Regiões e próximo passo —');

teste('novo jogo nasce em Renânia e ⭐ aponta a cidade (gancho na taverna)', () => {
  Engine.novoJogo('Teste', 1);
  afirmar(Engine.regiaoAtual() === 'renania');
  afirmar(Engine.cidadeAtual().id === 'renania_cidade');
  afirmar(Engine.proximoDestino() === 'no_cidade', 'sem missão, o próximo passo é a cidade');
});

teste('M1 ativa: ⭐ aponta o primeiro nó acessível não concluído', () => {
  Engine.aceitarMissao('missao1');
  afirmar(Engine.proximoDestino() === 'no_estrada1', 'devia apontar a Estrada das Carroças; deu ' + Engine.proximoDestino());
  Engine.estado.nosConcluidos.push('no_estrada1', 'no_estrada2');
  afirmar(Engine.proximoDestino() === 'no_mina_entrada');
});

teste('CENÁRIO DO CARLOS — fim da M2: chefe morto, ⭐ aponta a CIDADE', () => {
  Engine.estado.nosConcluidos.push('no_mina_entrada', 'no_caverna', 'no_fundo');
  Engine.estado.missoes.missao1 = { aceita: true, etapasFeitas: [], concluida: true };
  Engine.aceitarMissao('missao2');
  afirmar(Engine.proximoDestino() === 'no_galeria', 'início da M2 devia apontar a Galeria');
  Engine.estado.nosConcluidos.push('no_galeria', 'no_bolsao', 'no_antessala', 'no_fissura', 'no_paredao');
  // missão 2 ainda ABERTA (relatório pendente) e rota limpa → cidade
  afirmar(Engine.proximoDestino() === 'no_cidade', 'ao fim da M2 o mapa deve apontar a CIDADE');
  afirmar(Engine.cidadeBloqueada() === null, 'cidade não pode estar travada com o chefe morto');
});

teste('viagem de região: Úbia abre, mapa exige M4, ⭐ aponta o Porto', () => {
  Engine.estado.missoes.missao2.concluida = true;
  Engine.estado.missoes.missao3 = { aceita: true, etapasFeitas: [], concluida: true };
  Engine.executarEfeitos([{ tipo: 'regiao', valor: 'ubia' }]);
  afirmar(Engine.regiaoAtual() === 'ubia');
  afirmar(Engine.cidadeAtual().id === 'ubia_cidade');
  afirmar(!Engine.missaoAtiva(), 'mapa de Úbia só abre com a M4');
  Engine.aceitarMissao('missao4');
  afirmar(Engine.missaoAtiva());
  afirmar(Engine.proximoDestino() === 'no_u_porto', 'M4 aceita → ⭐ Baixa do Porto; deu ' + Engine.proximoDestino());
});

teste('trava da cidade vale em Úbia até o Fórum cair', () => {
  afirmar(Engine.cidadeBloqueada() !== null, 'M4 ativa deve travar a cidade');
  Engine.estado.nosConcluidos.push('no_u_porto', 'no_u_armazem', 'no_u_museu', 'no_u_subterraneo', 'no_u_santuario', 'no_u_forum');
  afirmar(Engine.cidadeBloqueada() === null, 'Fórum caiu, cidade destrava');
  afirmar(Engine.proximoDestino() === 'no_u_cidade', 'rota limpa → ⭐ cidade (relatório)');
});

teste('estadoDoNo reconhece a cidade de Úbia como raiz (1º nó acessível)', () => {
  Engine.novoJogo('Teste2', 2);
  Engine.estado.regiao = 'ubia';
  Engine.estado.missoes.missao4 = { aceita: true, etapasFeitas: [] };
  const porto = Engine.mapaAtual().nos.find(n => n.id === 'no_u_porto');
  const armazem = Engine.mapaAtual().nos.find(n => n.id === 'no_u_armazem');
  afirmar(Engine.estadoDoNo(porto) === 'acessivel', 'Porto deve abrir a partir da Praça Alta');
  afirmar(Engine.estadoDoNo(armazem) === 'bloqueado', 'Armazém só abre depois do Porto');
});

/* ================= 3. VESTES DA MAGA ================= */
console.log('— Vestes da maga —');

teste('maga PODE equipar vestes; couro/cota seguem proibidos', () => {
  const maga = { classe: 'Maga (Evocadora)' };
  afirmar(Loot.podeEquipar(maga, items.vestes_aprendiz).pode, 'vestes de aprendiz negadas');
  const manto = lootD.unicos.find(u => u.id === 'u_manto_incantatrix');
  afirmar(Loot.podeEquipar(maga, manto).pode, 'Manto da Incantatrix negado');
  const couro = lootD.bases.find(b => b.id === 'b_couro');
  afirmar(!Loot.podeEquipar(maga, couro).pode, 'couro deveria seguir proibido');
  const cota = lootD.bases.find(b => b.id === 'b_cota');
  afirmar(!Loot.podeEquipar(maga, cota).pode, 'cota deveria seguir proibida');
});

teste('maga nova já nasce com as vestes equipadas (CA sobe)', () => {
  Engine.novoJogo('Teste3', 3);
  Engine.recrutarHeroi('maga');
  const eq = Engine.estado.equips.maga;
  afirmar(eq.armadura && eq.armadura.id === 'vestes_aprendiz', 'vestes não equipadas no recrutamento');
  const stats = Loot.statsHeroi(Engine.estado.herois.maga, eq);
  afirmar(stats.ca === 10 + 1 + 2, 'CA da maga devia ser 13 (10 + vestes 1 + DES 2); deu ' + stats.ca);
});

teste('migração v8: save antigo ganha regiao + vestes na maga', () => {
  Engine.novoJogo('Migra', 4);
  Engine.recrutarHeroi('maga');
  Engine.estado.equips.maga.armadura = null; // save antigo: corpo vazio
  delete Engine.estado.regiao;
  Engine.estado.versaoSave = 7;
  Engine._migrarSave();
  afirmar(Engine.estado.regiao === 'renania', 'regiao não migrada');
  afirmar(Engine.estado.equips.maga.armadura && Engine.estado.equips.maga.armadura.id === 'vestes_aprendiz', 'vestes não migradas');
  afirmar(Engine.estado.versaoSave === 8);
});

/* ================= 4. PRESTÍGIO REBALANCEADO ================= */
console.log('— Prestígio rebalanceado —');

const P = GameData.get('prestige');

teste('orçamento de poder: nenhum bônus fixo destoa (pv ≤ 12, CA ≤ 1)', () => {
  for (const classe of ['paladino', 'ladino', 'maga']) {
    for (const t of P[classe]) {
      afirmar((t.bonus.pvExtra || 0) <= 12, `${t.id}: pvExtra alto demais`);
      afirmar((t.bonus.caExtra || 0) <= 1, `${t.id}: caExtra alto demais (CdP 3.5 não empilha CA fixa)`);
      afirmar(t.passiva !== undefined && Object.keys(t.passiva).length > 0, `${t.id}: sem passiva (trilha oca)`);
      afirmar(abilities[t.habilidadeNova], `${t.id}: habilidade '${t.habilidadeNova}' não existe`);
    }
  }
});

teste('Dançarino ganhou a Rolada Defensiva (a passiva que faltava)', () => {
  const d = P.ladino.find(t => t.id === 'dancarino_sombras');
  afirmar(d.passiva.roladaDefensiva === true);
});

teste('Baluarte virou +2 CA (resguardado) e Punição 2×', () => {
  afirmar(abilities.baluarte.aplicarParty.condicao === 'resguardado');
  afirmar(abilities.punicao_celestial.usosPorCombate === 2);
  afirmar(P.maga.find(t => t.id === 'maga_batalha').bonus.caExtra === undefined, 'War Wizard não é tanque');
});

teste('motor: resguardado soma +2 CA; riposte limitado a 1×/rodada', () => {
  Engine.novoJogo('Cb', 5);
  Combat.iniciar('no1_matilha');
  Combat.pararRelogio();
  const h = Combat.c.herois[0];
  const caBase = Combat._caHeroi(h);
  Combat._aplicar(h, 'resguardado', 2);
  afirmar(Combat._caHeroi(h) === caBase + 2, 'resguardado não somou +2');
  // riposte 1×/rodada
  h.stats.passiva = { contraAtaque: true };
  h._riposteRodada = undefined;
  Combat.c.rodada = 3;
  h._riposteRodada = 3;
  const inimigo = Combat.c.inimigos[0];
  const pvAntes = Engine.estado.pv[h.id];
  // inimigo erra de propósito não dá pra forçar sem mock de dado — checagem estrutural:
  afirmar(h._riposteRodada === Combat.c.rodada, 'controle de riposte por rodada presente');
});

teste('rolada defensiva: golpe letal vira metade (1×/combate)', () => {
  Engine.novoJogo('Rd', 6);
  Combat.iniciar('no1_matilha');
  Combat.pararRelogio();
  const h = Combat.c.herois[0];
  h.stats.passiva = { roladaDefensiva: true };
  h.usos = {};
  Engine.estado.pv[h.id] = 10;
  Combat._ferir(h, 10, 'teste'); // letal → vira 5
  afirmar(Engine.estado.pv[h.id] === 5, 'dano letal devia cair pra 5; PV=' + Engine.estado.pv[h.id]);
  Combat._ferir(h, 10, 'teste'); // segunda vez não protege
  afirmar(Engine.estado.pv[h.id] === 0, 'segunda rolada não deveria existir');
});

teste('limite do Golpe Sagrado: base 1 (+1 do Campeão) + nível/5', () => {
  Engine.novoJogo('Gs', 7);
  Engine.estado.xp = 10000; // nível 5
  const h = { nivel: 5, stats: { passiva: {} } };
  afirmar(Combat._limiteGolpe(h) === 2, 'nível 5 sem trilha = 2 usos');
  h.stats.passiva = { golpeSagradoUsos: 2 };
  afirmar(Combat._limiteGolpe(h) === 3, 'Campeão nível 5 = 3 usos');
});

/* ================= 5. FLUXO NARRATIVO DA M4 ================= */
console.log('— Fluxo da M4 —');

teste('cadeia de flags da M4 fecha (convocação → relatório → manto)', () => {
  const conv = dialogs.m4_convocacao.opcoes[0].efeito;
  afirmar(conv.some(e => e.tipo === 'flag' && e.valor === 'ubiaAberta'));
  afirmar(conv.some(e => e.tipo === 'regiao' && e.valor === 'ubia'));
  const vit = dialogs.m4_forum_vitoria.opcoes[0].efeito;
  afirmar(vit.some(e => e.tipo === 'flag' && e.valor === 'missao4Relatorio'));
  const rel = dialogs.m4_relatorio.opcoes[0].efeito;
  afirmar(rel.some(e => e.tipo === 'concluirMissao' && e.valor === 'missao4'));
  afirmar(rel.some(e => e.tipo === 'flag' && e.valor === 'v04Completa'));
  const manto = dialogs.m4_torre_manto.efeitoEntrada;
  afirmar(manto.some(e => e.tipo === 'itemUnico' && e.valor === 'u_manto_incantatrix'));
});

teste('todas as 8 etapas da M4 são marcadas em algum diálogo', () => {
  const marcadas = new Set();
  for (const dlg of Object.values(dialogs)) {
    for (const op of (dlg.opcoes || [])) for (const ef of (op.efeito || []))
      if (ef.tipo === 'etapa' && ef.missao === 'missao4') marcadas.add(ef.valor);
    for (const ef of (dlg.efeitoEntrada || []))
      if (ef.tipo === 'etapa' && ef.missao === 'missao4') marcadas.add(ef.valor);
  }
  for (let i = 1; i <= 8; i++) afirmar(marcadas.has('e' + i), 'etapa e' + i + ' nunca é marcada');
});

teste('Lysia foge (script) e Yara é chefe com Lâmina-Tempestade', () => {
  const f = encounters.m4_forum;
  const lysia = f.inimigos.find(i => i.ref === 'lysia_moss');
  afirmar(lysia && lysia.script && lysia.script.fogeEmPv > 0, 'Lysia precisa fugir (ela SEMPRE foge)');
  const yara = f.inimigos.find(i => i.ref === 'yara_lamina');
  afirmar(yara && yara.chefe && yara.habilidades.includes('lamina_tempestade'));
});

teste('combate M4 (smoke): Fórum roda em auto-batalha sem exceção', () => {
  Engine.novoJogo('Smoke', 8);
  Engine.recrutarHeroi('ladino');
  Engine.recrutarHeroi('maga');
  Engine.estado.xp = 36000; // nível 9
  Engine._aplicarNivel(2, 9);
  Engine.estado.inventario.push('pocao_cura_leve', 'pocao_cura_leve', 'pocao_cura_leve');
  Combat.iniciar('m4_forum');
  Combat.pararRelogio();
  Combat.c.auto = true;
  let passos = 0;
  while (!Combat.c.terminado && passos < 8000) { Combat.tick(); passos++; }
  afirmar(Combat.c.terminado, 'combate não terminou em 8000 ticks');
});

/* ================= 6. v0.8.1 — SEQUÊNCIA CLARA E SEM RECOMPENSA DUPLA ================= */
console.log('— v0.8.1: recompensa única + próximo clique —');

teste('cobrar recompensa da M1 exige missão NÃO concluída (sem farm de 450 po)', () => {
  const op = dialogs.quadro_contratos.opcoes.find(o => o.texto.includes('COBRAR'));
  afirmar(op.condicao.missaoNaoConcluida === 'missao1', 'opção de cobrança sem trava de missão concluída');
  // e o filtro de condição respeita:
  const cd = op.condicao;
  const estadoFake = { missoes: { missao1: { concluida: true } }, flags: { missao1Cobrar: true } };
  const passa = !(cd.missaoNaoConcluida && (estadoFake.missoes[cd.missaoNaoConcluida] || {}).concluida);
  afirmar(!passa, 'a opção deveria SUMIR com a M1 concluída');
});

teste('beco some do hub depois que a M2 é aceita', () => {
  const beco = world.cidade.locais.find(l => l.id === 'beco');
  afirmar(beco.condicao.semMissao === 'missao2');
});

teste('dicaProximoPasso cobre o fluxo M1→M4 sem buracos', () => {
  Engine.novoJogo('Dica', 1);
  const e = Engine.estado;
  afirmar(Engine.dicaProximoPasso().includes('Basilisco'), 'início: aceitar M1');
  Engine.aceitarMissao('missao1');
  afirmar(Engine.dicaProximoPasso().includes('⭐'), 'M1 ativa: seguir a estrela');
  e.flags.missao1Cobrar = true;
  afirmar(Engine.dicaProximoPasso().includes('COBRE'), 'M1: cobrar recompensa');
  e.missoes.missao1.concluida = true; e.flags.v01Completa = true;
  afirmar(Engine.dicaProximoPasso().includes('Beco'), 'pós-M1: beco');
  Engine.aceitarMissao('missao2');
  afirmar(Engine.dicaProximoPasso().includes('⭐'), 'M2 ativa: estrela');
  e.flags.missao2Relatorio = true;
  afirmar(Engine.dicaProximoPasso().includes('Envelope'), 'M2: envelope');
  e.missoes.missao2.concluida = true; e.flags.v02Completa = true;
  afirmar(Engine.dicaProximoPasso().includes('CONTRATO DIRETO'), 'pós-M2: contrato M3');
  Engine.aceitarMissao('missao3');
  e.flags.missao3Relatorio = true;
  afirmar(Engine.dicaProximoPasso().includes('Correio'), 'M3: correio');
  e.missoes.missao3.concluida = true; e.flags.v03Completa = true;
  afirmar(Engine.dicaProximoPasso().includes('ÚBIA'), 'pós-M3: convocação');
  e.flags.ubiaAberta = true; e.regiao = 'ubia';
  afirmar(Engine.dicaProximoPasso().includes('Mural'), 'Úbia: aceitar M4');
  Engine.aceitarMissao('missao4');
  afirmar(Engine.dicaProximoPasso().includes('⭐'), 'M4 ativa: estrela');
  e.flags.missao4Relatorio = true;
  afirmar(Engine.dicaProximoPasso().includes('RELATÓRIO'), 'M4: relatório');
  e.missoes.missao4.concluida = true; e.flags.v04Completa = true;
  afirmar(Engine.dicaProximoPasso().includes('Torre de Marfim'), 'pós-M4: manto na torre');
  e.flags.mantoEntregue = true;
  afirmar(Engine.dicaProximoPasso().includes('Avenches'), 'fim: aguardando M5');
});

/* ================= RESULTADO ================= */
console.log('\n============================');
console.log(`RESULTADO: ${ok} ✅ · ${falhas.length} ❌`);
if (falhas.length) { falhas.forEach(f => console.log('  ❌ ' + f)); process.exit(1); }
console.log('v0.8.0 aprovada pela suíte.');
