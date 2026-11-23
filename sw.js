const SHELL="atlas-shell-v3",RUN="atlas-run-v3";
self.addEventListener("install",e=>{e.waitUntil(caches.open(SHELL).then(c=>c.addAll(["./","index.html","manifest.webmanifest","icon.svg"])).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==SHELL&&k!==RUN).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);if(e.request.method!=="GET")return;
  const same=u.origin===location.origin;
  const ext=/pokeapi\.co|githubusercontent\.com|fonts\.(googleapis|gstatic)\.com/.test(u.host);
  if(!same&&!ext)return;
  const store=r=>{if(r&&(r.ok||r.type==="opaque")){const c=r.clone();caches.open(same?SHELL:RUN).then(ch=>ch.put(e.request,c))}return r};
  if(same){
    // la propia aplicación: primero la red, para recibir las actualizaciones; la caché sirve sin conexión
    e.respondWith(fetch(e.request).then(store).catch(()=>caches.match(e.request,{ignoreSearch:true})));
  }else{
    // datos e imágenes: primero la caché
    e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(store).catch(()=>hit)));
  }
});
