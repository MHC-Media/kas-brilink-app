const C = 'kas-v3', PRE = ['./', 'index.html', 'manifest.json', 'icon.svg'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(PRE))); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || /google(usercontent)?\.com$/.test(u.hostname) && !u.hostname.startsWith('fonts')) return; // API tidak pernah di-cache
  if (r.mode === 'navigate') { e.respondWith(fetch(r).then(x => { if (x.ok) caches.open(C).then(c => c.put('index.html', x.clone())); return x; }).catch(() => caches.match('index.html'))); return; }
  // stale-while-revalidate: tampil instan dari cache, diperbarui di belakang layar
  e.respondWith(caches.match(r).then(h => { const n = fetch(r).then(x => { if (x.ok) caches.open(C).then(c => c.put(r, x.clone())); return x; }).catch(() => h); return h || n; }));
});
