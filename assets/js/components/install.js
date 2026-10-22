/* ============================================================
   NUTRI-ZANO · Instalar la tarjeta como app
   ------------------------------------------------------------
   Los botones "Descargar app" SIEMPRE están visibles (portada,
   barra superior y contacto). Al tocarlos:
   - Android/Chrome: abre el diálogo de instalación del navegador.
   - iPhone/iOS (Safari): muestra instrucciones de
     "Compartir → Agregar a pantalla de inicio".
   - Si ya está instalada: lo indica con un mensaje.
   ============================================================ */
(function () {
  "use strict";

  const NZ = (window.NZ = window.NZ || {});
  const { modal, toast } = NZ.ui;

  let prompPendiente = null;

  function esIOS() {
    return (
      /iphone|ipad|ipod/i.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    );
  }

  function yaInstalada() {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches
    );
  }

  function instrucciones() {
    const contenido = esIOS()
      ? `<p class="modal-texto">Para guardar Nutri-Zano en tu iPhone:</p>
         <ul class="modal-lista">
           <li><span>Toca el botón <strong>Compartir</strong> (el icono de cuadrado con flecha) en la barra de Safari.</span></li>
           <li><span>Elige <strong>«Agregar a pantalla de inicio»</strong>.</span></li>
           <li><span>Confirma tocando <strong>Agregar</strong>. Listo: podrás abrirla como una app.</span></li>
         </ul>`
      : `<p class="modal-texto">Para guardar Nutri-Zano en tu teléfono:</p>
         <ul class="modal-lista">
           <li><span>Abre el menú del navegador (los tres puntos <strong>⋮</strong> de la barra superior o inferior).</span></li>
           <li><span>Elige <strong>«Instalar aplicación»</strong> o <strong>«Agregar a pantalla de inicio»</strong>.</span></li>
           <li><span>Confirma y la tarjeta se abrirá como una app, con su propio icono.</span></li>
         </ul>`;
    modal.abrir(`
      <p class="modal-eyebrow">Tarjeta digital como app</p>
      <h2 class="modal-titulo" id="modalTitulo">Guarda Nutri-Zano en tu teléfono</h2>
      ${contenido}
      <div class="modal-acciones">
        <button class="btn btn-ghost" data-cerrar-modal>Entendido</button>
      </div>
    `);
  }

  function instalar() {
    if (yaInstalada()) {
      if (toast) toast("Nutri-Zano ya está guardada en tu teléfono, con su icono en la pantalla de inicio.");
      return;
    }
    if (prompPendiente) {
      try {
        prompPendiente.prompt();
        prompPendiente.userChoice.then((respuesta) => {
          if (respuesta && respuesta.outcome === "accepted" && toast) {
            toast("¡Nutri-Zano se instaló en tu teléfono!");
          }
          prompPendiente = null;
        });
        return;
      } catch (e) {
        prompPendiente = null; // el navegador rechazó el diálogo: mostramos instrucciones
      }
    }
    instrucciones();
  }

  function init() {
    // Diálogo nativo de instalación (Chrome/Android y escritorio)
    window.addEventListener("beforeinstallprompt", (evento) => {
      evento.preventDefault();
      prompPendiente = evento;
    });

    window.addEventListener("appinstalled", () => {
      if (toast) toast("¡Nutri-Zano se instaló en tu teléfono!");
    });

    // Todos los botones [data-instalar] (portada, barra superior y contacto)
    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-instalar]")) {
        e.preventDefault();
        instalar();
      }
    });

    // Service worker (solo cuando el sitio se sirve por HTTP/HTTPS)
    if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js").catch(() => {
          /* sin service worker el sitio sigue funcionando */
        });
      });
    }
  }

  NZ.instalar = { init };
})();
