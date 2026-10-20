/* ============================================================
   NUTRI-ZANO · Service Worker
   Permite instalar la tarjeta digital como app y navegar
   aunque el dispositivo pierda conexión temporalmente.
   ============================================================ */

const CACHE = "nutrizano-v2";

const CORE = [
  "./",
  "index.html",
  "aviso-privacidad.html",
  "manifest.webmanifest",
  "assets/css/styles.css",
  "assets/js/config.js",
  "assets/js/data/products.js",
  "assets/js/components/ui.js",
  "assets/js/components/nav.js",
  "assets/js/components/services.js",
  "assets/js/components/catalog.js",
  "assets/js/components/form.js",
  "assets/js/components/contact.js",
  "assets/js/components/install.js",
  "assets/js/main.js",
  "assets/img/favicon.svg",
  "assets/img/icono-192.png",
  "assets/img/icono-512.png",
  "assets/img/logo-nutri-zano.jpg",
  "assets/img/hero-cuenco-saludable.jpg",
  "assets/img/foto-nutriologa.jpg",
  "assets/img/producto-chips-coliflor-adobada.jpg",
];

self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches
      .open(CACHE)
      .then((cache) =>
        // addAll falla si un archivo no existe: se agregan uno por uno
        Promise.allSettled(CORE.map((ruta) => cache.add(ruta)))
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((claves) =>
        Promise.all(claves.filter((c) => c !== CACHE).map((c) => caches.delete(c)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (evento) => {
  const req = evento.request;
  if (req.method !== "GET") return;

  // Solo recursos del propio sitio; fuentes externas van a la red
  if (new URL(req.url).origin !== self.location.origin) return;

  evento.respondWith(
    caches.match(req, { ignoreSearch: true }).then((cacheado) => {
      if (cacheado) return cacheado;
      return fetch(req)
        .then((respuesta) => {
          if (respuesta && respuesta.status === 200) {
            const copia = respuesta.clone();
            caches.open(CACHE).then((cache) => cache.put(req, copia));
          }
          return respuesta;
        })
        .catch(() =>
          // Sin conexión y sin copia: página principal como respaldo
          req.mode === "navigate" ? caches.match("index.html") : Response.error()
        );
    })
  );
});
