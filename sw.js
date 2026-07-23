/* Ozein RPG — service worker: jogo jogável offline, mas SEMPRE atualizado quando há internet.
   Estratégia: NETWORK-FIRST — a rede vem na frente; o cache é só reserva pra jogar offline.
   Isso impede o aparelho de ficar preso numa versão antiga em cache
   (era a causa do erro de acesso às cenas/nós no mapa no mobile).
   Trocar a VERSAO limpa o cache antigo em todos os aparelhos. */
const VERSAO = 'ozein-v0.8.2';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((chaves) =>
      Promise.all(chaves.filter((c) => c !== VERSAO).map((c) => caches.delete(c)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // fontes externas: rede normal
  e.respondWith(
    caches.open(VERSAO).then(async (cache) => {
      try {
        const resp = await fetch(e.request); // rede primeiro: código/cenas sempre atuais
        if (resp && resp.ok) cache.put(e.request, resp.clone());
        return resp;
      } catch (err) {
        const emCache = await cache.match(e.request); // sem internet: cai no cache
        if (emCache) return emCache;
        throw err;
      }
    })
  );
});
