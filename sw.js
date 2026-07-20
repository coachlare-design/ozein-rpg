/* Ozein RPG — service worker: jogo 100% offline após a 1ª visita.
   Estratégia: cache-first com atualização em segundo plano (stale-while-revalidate).
   Trocar a VERSAO força atualização dos arquivos em todos os aparelhos. */
const VERSAO = 'ozein-v0.7.0';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(chaves =>
      Promise.all(chaves.filter(c => c !== VERSAO).map(c => caches.delete(c)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // fontes externas: rede normal
  e.respondWith(
    caches.open(VERSAO).then(async (cache) => {
      const emCache = await cache.match(e.request);
      const daRede = fetch(e.request).then((resp) => {
        if (resp && resp.ok) cache.put(e.request, resp.clone());
        return resp;
      }).catch(() => emCache);
      return emCache || daRede;
    })
  );
});
