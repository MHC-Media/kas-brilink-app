const C='kas-v3',PRE=['./','index.html','manifest.json','icon.svg'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>Promise.all(PRE.map(u=>c.add(u).catch(()=>{})))))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(u.hostname.endsWith('google.com')||u.hostname.endsWith('googleusercontent.com'))return; // API tidak pernah di-cache
 if(r.mode==='navigate'){e.respondWith(Promise.race([fetch(r),new Promise((_,no)=>setTimeout(no,3500))]).then(x=>{if(x.ok)caches.open(C).then(c=>c.put('index.html',x.clone()));return x}).catch(()=>caches.match('index.html')));return}
 e.respondWith(caches.match(r).then(h=>{const n=fetch(r).then(x=>{if(x.ok||x.type==='opaque')caches.open(C).then(c=>c.put(r,x.clone()));return x}).catch(()=>h);return h||n}))});
